import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import "./FoodSelection.css";

const FOOD_MENU = [
  { id: "f1", name: "Large Salted Popcorn", description: "Freshly popped classic salted popcorn.", price: 250, image: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&q=80&w=300" },
  { id: "f2", name: "Caramel Popcorn", description: "Sweet and crunchy caramel coated popcorn.", price: 300, image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=300" },
  { id: "f3", name: "Cheese Nachos", description: "Crispy nachos loaded with warm jalapeño cheese sauce.", price: 280, image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=300" },
  { id: "f4", name: "Cold Coffee", description: "Rich and creamy iced coffee.", price: 180, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=300" },
  { id: "f5", name: "Fountain Coke", description: "Chilled classic cola.", price: 150, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300" }
];

export default function FoodSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  const [cart, setCart] = useState({});

  if (!bookingDetails) {
    return <div className="page-wrapper container"><p>Invalid booking session. Please start over.</p></div>;
  }

  const handleAdd = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 0) newCart[id] -= 1;
      if (newCart[id] === 0) delete newCart[id];
      return newCart;
    });
  };

  const calculateFoodTotal = () => {
    let total = 0;
    Object.keys(cart).forEach(id => {
      const item = FOOD_MENU.find(f => f.id === id);
      if (item) total += item.price * cart[id];
    });
    return total;
  };

  const foodTotal = calculateFoodTotal();

  const handleProceed = () => {
    const selectedFood = Object.keys(cart).map(id => {
      const item = FOOD_MENU.find(f => f.id === id);
      return {
        name: item.name,
        price: item.price,
        quantity: cart[id]
      };
    });

    navigate("/payment", {
      state: {
        bookingDetails,
        foodItems: selectedFood
      }
    });
  };

  return (
    <div className="food-selection-page page-wrapper">
      <SEO title="Grab a Snack - CineVault" />
      <div className="container" style={{ padding: "40px 20px" }}>
        <h1 style={{ marginBottom: "10px" }}>Grab a Bite! 🍿</h1>
        <p style={{ color: "var(--clr-text-muted)", marginBottom: "40px" }}>
          Pre-book your favorite snacks and skip the queue.
        </p>

        <div className="food-grid">
          {FOOD_MENU.map(item => (
            <div key={item.id} className="food-card glass">
              <div className="food-img-wrapper">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="food-info">
                <h3>{item.name}</h3>
                <p className="food-desc">{item.description}</p>
                <div className="food-bottom">
                  <span className="food-price">₹{item.price}</span>
                  <div className="food-controls">
                    {cart[item.id] ? (
                      <div className="qty-selector">
                        <button onClick={() => handleRemove(item.id)}>-</button>
                        <span>{cart[item.id]}</span>
                        <button onClick={() => handleAdd(item.id)}>+</button>
                      </div>
                    ) : (
                      <button className="btn btn-sm btn-outline" onClick={() => handleAdd(item.id)}>Add</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="food-action-bar glass">
          <div className="food-action-right" style={{ width: "100%", justifyContent: "space-between", display: "flex", alignItems: "center" }}>
            {foodTotal > 0 ? (
              <div className="food-total" style={{ fontSize: "1.1rem", fontWeight: "600" }}>Food Total: ₹{foodTotal}</div>
            ) : (
              <div className="food-total text-muted">No snacks selected</div>
            )}
            <button className="btn btn-primary btn-lg" onClick={handleProceed}>
              {foodTotal > 0 ? "Proceed to Pay" : "Skip Snacks & Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
