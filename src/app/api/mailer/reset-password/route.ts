import { NextResponse } from "next/server";
import { mailTransporter } from "@/utils/mailer";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 },
      );
    }

    const transporter = mailTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/confirm?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <tr>
                <td style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 32px;">
                        <h1 style="margin: 0; font-size: 24px; color: #111827;">Reset Your Password</h1>
                        <p style="margin: 16px 0; font-size: 16px; color: #4b5563;">You requested to reset your password. Click the button below to set a new password:</p>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 16px 0;">
                              <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: 500;">Reset Password</a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">This link will expire in 24 hours.</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-top: 32px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">If you didn't request this password reset, you can safely ignore this email.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: "Reset password email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return NextResponse.json(
      { error: "Failed to send reset password email" },
      { status: 500 },
    );
  }
}
