import { NextResponse } from "next/server";
import { mailTransporter } from "@/utils/mailer";

export async function POST(request: Request) {
  try {
    const { email, token, temporaryPassword } = await request.json();

    if (!email || !token || !temporaryPassword) {
      return NextResponse.json(
        { error: "Email, token, and temporary password are required" },
        { status: 400 },
      );
    }

    const transporter = mailTransporter();
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Welcome! Verify your email and access your account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <tr>
                <td style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 32px;">
                        <h1 style="margin: 0; font-size: 24px; color: #111827;">Thanks for signing up!</h1>
                        <p style="font-size: 16px; color: #4b5563;">Please click the button below to verify your email and activate your account:</p>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 16px 0;">
                              <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: 500;">Verify Email</a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">This verification link will expire in 24 hours.</p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 32px 0; border-top: 1px solid #e5e7eb;">
                        <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Your Login Credentials</h2>
                        <p style="margin: 0 0 16px 0; font-size: 16px; color: #4b5563;">Here are your temporary login credentials:</p>
                        <table width="100%" cellpadding="16" cellspacing="0" style="background-color: #f3f4f6; border-radius: 5px;">
                          <tr>
                            <td>
                              <p style="margin: 8px 0; font-size: 16px; color: #374151;"><strong>Email:</strong> ${email}</p>
                              <p style="margin: 8px 0; font-size: 16px; color: #374151;"><strong>Password:</strong> ${temporaryPassword}</p>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 16px 0 0 0; font-size: 14px; color: #dc2626;">For security reasons, please change your password after your first login.</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-top: 32px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">If you didn't request this account, please ignore this email.</p>
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
      { message: "Verification email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 },
    );
  }
}
