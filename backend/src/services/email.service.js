const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, html) {
  return transporter.sendMail({
    from: `"AM38 Rent A Car" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

async function sendBookingConfirmation(data) {
  return sendEmail(
    data.email,
    `Booking Confirmed - ${data.reference}`,
    `
      <h2>Booking Confirmed</h2>
      <p>Hello ${data.customer},</p>
      <p>Your booking has been confirmed.</p>
      <p>Reference: ${data.reference}</p>
      <p>Vehicle: ${data.vehicle}</p>
      <p>Total: MUR ${data.total}</p>
    `
  );
}

// ----- NEW FUNCTION ADDED -----
async function sendPasswordResetEmail(to, resetToken, name) {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
  return sendEmail(
    to,
    "Password Reset Request",
    `
      <h2>Reset Your Password</h2>
      <p>Hello ${name},</p>
      <p>You requested a password reset for your AM38 Rent A Car account.</p>
      <p>Click the link below to set a new password (this link is valid for 1 hour):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  );
}
// ---------------------------------

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendPasswordResetEmail,   // exported for use in auth controller
};