const nodemailer = require("nodemailer");

// Create a reusable transporter using Ethereal email
const createTransporter = async () => {
  // Generate a test account on Ethereal automatically
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
};

const sendBookingConfirmationEmail = async (userEmail, userName, bookingDetails) => {
  try {
    const transporter = await createTransporter();

    let movieDetailsHtml = "";
    if (bookingDetails.isPremiere) {
      movieDetailsHtml = `
        <p style="font-size: 16px; margin-bottom: 8px;"><strong>Premiere Stream:</strong> ${bookingDetails.title}</p>
        <p style="font-size: 14px; color: #aaaaaa;">Lifetime Access</p>
      `;
    } else {
      movieDetailsHtml = `
        <p style="font-size: 16px; margin-bottom: 8px;"><strong>Movie:</strong> ${bookingDetails.title}</p>
        <p style="font-size: 14px; margin-bottom: 8px;"><strong>Theatre:</strong> ${bookingDetails.theatre}</p>
        <p style="font-size: 14px; margin-bottom: 8px;"><strong>Date & Time:</strong> ${bookingDetails.date} at ${bookingDetails.time}</p>
        <p style="font-size: 14px; margin-bottom: 8px;"><strong>Seats:</strong> ${bookingDetails.seats}</p>
      `;
    }

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
        <div style="background-color: #e50914; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 1px;">Ticket Confirmed!</h1>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 18px; margin-bottom: 24px;">Hi ${userName},</p>
          <p style="font-size: 16px; color: #cccccc; margin-bottom: 24px;">Your booking has been successfully processed. Here are your ticket details:</p>
          
          <div style="background-color: #16213e; border: 1px solid #30475e; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            ${movieDetailsHtml}
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #30475e;">
              <p style="font-size: 18px; font-weight: bold; margin: 0; color: #e50914;">Total Paid: Rs. ${bookingDetails.totalAmount}</p>
            </div>
          </div>
          
          <p style="font-size: 14px; color: #aaaaaa; text-align: center; margin-bottom: 24px;">
            You can download your PDF ticket with the scannable QR code directly from your account.
          </p>
          
          <div style="text-align: center;">
            <a href="http://localhost:5173/my-bookings" style="display: inline-block; background-color: #e50914; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; font-size: 16px;">View & Download Ticket</a>
          </div>
        </div>
        <div style="background-color: #0f3460; padding: 16px; text-align: center; font-size: 12px; color: #cccccc;">
          <p style="margin: 0;">&copy; 2026 Cinevault. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Cinevault Tickets" <no-reply@cinevault.com>', // sender address
      to: userEmail, // list of receivers
      subject: "Your Movie Ticket is Confirmed! 🍿", // Subject line
      html: htmlContent, // html body
    });

    console.log("-----------------------------------------");
    console.log("📧 EMAIL SENT SUCCESSFULLY!");
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("-----------------------------------------");
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendBookingConfirmationEmail };
