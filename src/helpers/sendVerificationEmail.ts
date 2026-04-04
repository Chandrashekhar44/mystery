
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export default async function sendVerificationEmail(
  email: string,
  verifyCode: string
) {
  try {
    await transporter.sendMail({
      from: `"My App" <${process.env.BREVO_SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Hello,</p>
          <p>Thank you for signing up. Please use the OTP below to verify your account:</p>

          <div style="margin: 30px 0; text-align: center;">
            <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 12px 24px; background: #f4f4f4; border-radius: 8px;">
              ${verifyCode}
            </span>
          </div>

          <p>This OTP will expire in 1 hour.</p>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you did not create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return {
      status: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);

    return {
      status: false,
      message: "Failed to send verification email",
    };
  }
}
