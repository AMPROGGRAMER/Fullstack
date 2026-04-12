import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  // For development/testing, use Ethereal (fake emails)
  // For production, use real SMTP settings from env
  
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Production SMTP
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // Development - log to console
  return null;
};

let transporter = createTransporter();

// Send email with fallback to console in development
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // If no transporter configured, log to console (development mode)
    if (!transporter) {
      console.log('\n========== EMAIL (Development Mode) ==========');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Text: ${text || 'HTML email'}`);
      console.log('==============================================\n');
      return { success: true, message: 'Email logged to console (dev mode)' };
    }
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@servelocal.com',
      to,
      subject,
      text,
      html
    });
    
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Password reset email
export const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  const subject = 'Password Reset - ServeLocal';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Password Reset Request</h2>
      <p>Hi ${name || 'there'},</p>
      <p>You requested a password reset for your ServeLocal account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Reset Password
      </a>
      <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
      <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  
  const text = `
    Password Reset - ServeLocal
    
    Hi ${name || 'there'},
    
    You requested a password reset for your ServeLocal account.
    
    Click this link to reset your password: ${resetUrl}
    
    This link expires in 1 hour.
    If you didn't request this, please ignore this email.
  `;
  
  return sendEmail({ to: email, subject, html, text });
};

// Booking confirmation email
export const sendBookingConfirmation = async (email, booking, provider) => {
  const subject = 'Booking Confirmed - ServeLocal';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Booking Confirmed!</h2>
      <p>Your service booking has been confirmed.</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Provider:</strong> ${provider?.name || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.time || 'N/A'}</p>
        <p><strong>Amount:</strong> ₹${booking.amount}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
      <p>Thank you for using ServeLocal!</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};

// Welcome email
export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to ServeLocal!';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Welcome to ServeLocal!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining ServeLocal - your trusted platform for local services.</p>
      <p>With ServeLocal, you can:</p>
      <ul>
        <li>Find verified service providers</li>
        <li>Book services instantly</li>
        <li>Track your bookings</li>
        <li>Pay securely</li>
      </ul>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/services" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        Explore Services
      </a>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};

export default {
  sendEmail,
  sendPasswordResetEmail,
  sendBookingConfirmation,
  sendWelcomeEmail
};
