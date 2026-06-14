import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, createBooking, getMovieById, validateCoupon } from "../config/allApis";
import "./Payment.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51234");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#333333",
      fontFamily: "'Roboto', sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#999999" },
      iconColor: "#666666",
    },
    invalid: { color: "#F84464", iconColor: "#F84464" },
  },
  hidePostalCode: true,
};

function CheckoutForm({ show, isPremiere, premiereItem, selectedSeats, totalAmount, convenienceFee, gst, grandTotal }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !name) return;

    setProcessing(true);
    setCardError("");

    try {
      const piRes = await createPaymentIntent({ amount: grandTotal });
      const { clientSecret, paymentIntentId } = piRes.data.data;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      const bookingData = {
        showId: show?._id,
        itemId: premiereItem?._id,
        seats: selectedSeats?.map((s) => ({ type: s.type, seatNumber: s.id })),
        foodItems,
        stripePaymentIntentId: paymentIntent.id,
        useCoins: window.useCoinsGlobal // passing via a global var for simplicity or pass as prop
      };

      const bookingRes = await createBooking(bookingData);
      navigate("/payment-success", { state: { booking: bookingRes.data.data } });
    } catch (err) {
      setCardError(err.response?.data?.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-group">
        <label className="form-label" htmlFor="cardholder-name">Cardholder Name</label>
        <input
          id="cardholder-name"
          type="text"
          className="form-input"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cardholder-email">Email for Receipt</label>
        <input
          id="cardholder-email"
          type="email"
          className="form-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Card Details</label>
        <div className="stripe-card-wrap">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {cardError && <div className="auth-error">{cardError}</div>}

      <button
        type="submit"
        className="btn btn-primary w-full btn-lg pay-btn mt-6"
        disabled={!stripe || processing}
      >
        {processing ? (
          <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Processing...</>
        ) : (
          `Pay Rs. ${grandTotal}`
        )}
      </button>

      <div className="stripe-security mt-4">
        <span>By proceeding, I express my consent to complete this transaction.</span>
      </div>
    </form>
  );
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const { bookingDetails, foodItems } = state || {};
  const { show, itemId, selectedSeats, isPremiere } = bookingDetails || state || {};

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiApp, setUpiApp] = useState("gpay");
  const [processing, setProcessing] = useState(false);
  const [premiereItem, setPremiereItem] = useState(null);
  const [loading, setLoading] = useState(isPremiere);

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [cineCoins, setCineCoins] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  useEffect(() => {
    import("../config/allApis").then(({ getProfile }) => {
      getProfile().then(res => setCineCoins(res.data.data.cineCoins || 0)).catch(err => console.error(err));
    });
  }, []);

  useEffect(() => {
    window.useCoinsGlobal = useCoins;
  }, [useCoins]);

  useEffect(() => {
    if (isPremiere && itemId) {
      getMovieById(itemId)
        .then((r) => setPremiereItem(r.data.data))
        .catch(() => navigate("/"))
        .finally(() => setLoading(false));
    }
  }, [isPremiere, itemId]);

  useEffect(() => {
    if (!show && !isPremiere) {
      navigate("/");
    }
  }, [show, isPremiere, navigate]);

  if (!show && !isPremiere) {
    return null;
  }

  if (loading) return <div className="page-loader" style={{ paddingTop: "80px" }}><div className="spinner" /></div>;

  const initialAmount = bookingDetails?.totalAmount || state?.totalAmount || 0;
  const foodTotal = foodItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const totalAmount = initialAmount + foodTotal;
  const convenienceFee = Math.round(totalAmount * 0.05);
  const gst = Math.round(totalAmount * 0.18);
  const discountAmount = Math.round((totalAmount * appliedDiscount) / 100);
  
  let preCoinTotal = totalAmount + convenienceFee + gst - discountAmount;
  let coinDiscount = 0;

  if (useCoins && cineCoins > 0) {
    if (cineCoins >= preCoinTotal) {
      coinDiscount = preCoinTotal;
    } else {
      coinDiscount = cineCoins;
    }
  }

  const grandTotal = preCoinTotal - coinDiscount;

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoError("");
    setPromoSuccess("");
    try {
      const res = await validateCoupon({ code: promoCode });
      setAppliedDiscount(res.data.data.discountPercent);
      setPromoSuccess(`Coupon applied! ${res.data.data.discountPercent}% off`);
    } catch (err) {
      setPromoError(err.response?.data?.message || "Invalid promo code");
      setAppliedDiscount(0);
    }
  };

  const handleUpiPayment = async () => {
    setProcessing(true);
    try {
      const bookingData = {
        showId: show?._id,
        itemId: premiereItem?._id,
        seats: selectedSeats?.map((s) => ({ type: s.type, seatNumber: s.id })),
        foodItems,
        stripePaymentIntentId: `mock_upi_${upiApp}_${Date.now()}`,
        useCoins
      };

      const bookingRes = await createBooking(bookingData);
      navigate("/payment-success", { state: { booking: bookingRes.data.data } });
    } catch (err) {
      alert("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="payment-page page-wrapper">
      <div className="container">
        <div className="payment-layout">
          <div className="order-summary-col">
            <div className="pay-card order-summary">
              <h2 className="pay-section-title">Order Summary</h2>

              {isPremiere ? (
                <div className="pay-movie-card">
                  <h3 className="pay-movie-name">{premiereItem?.title}</h3>
                  <p className="pay-detail text-dim">Premiere Stream • {premiereItem?.language?.join(", ")}</p>
                </div>
              ) : (
                <div className="pay-movie-card">
                  <h3 className="pay-movie-name">{show.movie?.title}</h3>
                  <p className="pay-detail text-dim">{show.movie?.language} • {show.format}</p>
                  <p className="pay-detail">{show.theatre?.name}: {show.theatre?.location}</p>
                </div>
              )}

              <div className="pay-seats-section">
                {!isPremiere && (
                  <div className="pay-price-row text-dim">
                    <span>{selectedSeats?.map(s => s.id).join(", ")} ({selectedSeats?.length} Tickets)</span>
                    <span>Rs. {initialAmount}</span>
                  </div>
                )}
                
                {foodItems && foodItems.length > 0 && (
                  <>
                    <div className="pay-price-row text-dim mt-2">
                      <span>Food & Beverage</span>
                      <span>Rs. {foodTotal}</span>
                    </div>
                    <div style={{ paddingLeft: "10px", marginBottom: "10px" }}>
                      {foodItems.map((f, i) => (
                        <div key={i} style={{ fontSize: "0.8rem", color: "var(--clr-text-muted)", display: "flex", justifyContent: "space-between" }}>
                          <span>{f.quantity}x {f.name}</span>
                          <span>Rs. {f.price * f.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="pay-price-row text-dim mt-2">
                  <span>Convenience fees</span>
                  <span>Rs. {convenienceFee}</span>
                </div>
                <div className="pay-price-row text-dim mt-2">
                  <span>Base GST</span>
                  <span>Rs. {gst}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="pay-price-row discount-row mt-2" style={{ color: "var(--clr-accent)" }}>
                    <span>Promo Discount ({appliedDiscount}%)</span>
                    <span>- Rs. {discountAmount}</span>
                  </div>
                )}
                {coinDiscount > 0 && (
                  <div className="pay-price-row discount-row mt-2" style={{ color: "#f59e0b" }}>
                    <span>CineCoins Applied</span>
                    <span>- Rs. {coinDiscount}</span>
                  </div>
                )}
              </div>

              {cineCoins > 0 && (
                <div className="cinecoins-section mt-4" style={{ background: "rgba(245, 158, 11, 0.1)", padding: "15px", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: 0, color: "#f59e0b", display: "flex", alignItems: "center", gap: "5px" }}>🪙 CineCoins Balance: {cineCoins}</h4>
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", color: "var(--clr-text-muted)" }}>Use your coins to get an instant discount!</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={useCoins} onChange={(e) => setUseCoins(e.target.checked)} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              )}

              <div className="promo-code-section mt-4">
                <div style={{ display: "flex", gap: "10px" }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter Promo Code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    style={{ textTransform: "uppercase" }}
                  />
                  <button className="btn btn-outline" onClick={handleApplyPromo}>Apply</button>
                </div>
                {promoError && <div className="auth-error mt-2" style={{ fontSize: "0.85rem", padding: "8px" }}>{promoError}</div>}
                {promoSuccess && <div className="auth-success mt-2" style={{ color: "var(--clr-accent)", fontSize: "0.85rem", padding: "8px", background: "rgba(255, 60, 106, 0.1)", borderRadius: "4px" }}>{promoSuccess}</div>}
              </div>

              <div className="pay-breakdown mt-4">
                <div className="pay-price-row pay-total">
                  <span>Amount Payable</span>
                  <span>Rs. {grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-col">
            <div className="pay-card">
              <h2 className="pay-section-title">Payment Options</h2>
              
              <div className="payment-method-tabs">
                <button 
                  className={`pm-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <span className="icon">📱</span> UPI
                </button>
                <button 
                  className={`pm-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <span className="icon">💳</span> Credit/Debit Card
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="upi-section">
                  <p className="upi-title">Select your UPI App</p>
                  <div className="upi-apps-grid">
                    <button 
                      className={`upi-app-btn ${upiApp === 'gpay' ? 'selected' : ''}`}
                      onClick={() => setUpiApp('gpay')}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" />
                      <span>GPay</span>
                    </button>
                    <button 
                      className={`upi-app-btn ${upiApp === 'phonepe' ? 'selected' : ''}`}
                      onClick={() => setUpiApp('phonepe')}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" style={{ height: "24px", objectFit: "contain" }} />
                      <span>PhonePe</span>
                    </button>
                    <button 
                      className={`upi-app-btn ${upiApp === 'paytm' ? 'selected' : ''}`}
                      onClick={() => setUpiApp('paytm')}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" />
                      <span>Paytm</span>
                    </button>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-full btn-lg pay-btn mt-6"
                    onClick={handleUpiPayment}
                    disabled={processing}
                  >
                    {processing ? "Processing..." : `Pay Rs. ${grandTotal} via ${upiApp === 'gpay' ? 'GPay' : upiApp === 'phonepe' ? 'PhonePe' : 'Paytm'}`}
                  </button>
                  <div className="stripe-security mt-4">
                    <span>By proceeding, I express my consent to complete this transaction.</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="card-section">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      show={show}
                      isPremiere={state.isPremiere}
                      premiereItem={premiereItem}
                      selectedSeats={selectedSeats}
                      totalAmount={totalAmount}
                      convenienceFee={convenienceFee}
                      gst={gst}
                      grandTotal={grandTotal}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
