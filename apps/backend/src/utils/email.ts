import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"Zone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Zone verification code",
    html: `
      <h2>Zone 🔐</h2>
      <p>Your verification code:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"Zone" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Zone password",
    html: `
      <h2>Zone 🔐</h2>
      <p>Your password reset code:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

