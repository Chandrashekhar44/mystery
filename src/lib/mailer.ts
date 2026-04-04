import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com", 
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export async function sendOtp(email: string, otp: string) {
  await transporter.sendMail({
    from: `"My App" <${process.env.BREVO_SMTP_USER}>`,
    to: email,
    subject: "Your OTP for My App",
    html: `
      <div style="font-family:sans-serif;padding:20px">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Expires in 5 minutes.</p>
      </div>
    `,
  });
}
