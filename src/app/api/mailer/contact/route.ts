import { NextResponse } from "next/server";
import { mailTransporter } from "@/utils/mailer";
import type { SendMailOptions } from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const attachment = formData.get("attachment") as File | null;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const transporter = mailTransporter();

    const mailOptions: SendMailOptions = {
      from: `"${name}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO_EMAIL,
      replyTo: email,
      subject: `Next Js Boilerplate - Support Ticket: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Support Ticket</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <tr>
                <td style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 32px;">
                        <h1 style="margin: 0; font-size: 24px; color: #111827;">New Support Ticket</h1>
                        <p style="margin: 16px 0 0 0; font-size: 16px; color: #4b5563;">You have received a new support ticket with the following details:</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 24px 0; border-top: 1px solid #e5e7eb;">
                        <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f3f4f6; border-radius: 5px;">
                          <tr>
                            <td style="padding: 12px 24px;">
                              <p style="margin: 8px 0; font-size: 16px; color: #374151;">
                                <strong style="color: #111827;">Name:</strong> ${name}
                              </p>
                              <p style="margin: 8px 0; font-size: 16px; color: #374151;">
                                <strong style="color: #111827;">Email:</strong> ${email}
                              </p>
                              <p style="margin: 8px 0; font-size: 16px; color: #374151;">
                                <strong style="color: #111827;">Subject:</strong> ${subject}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-bottom: 32px;">
                        <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Message:</h2>
                        <div style="background-color: #f3f4f6; padding: 24px; border-radius: 5px;">
                          <p style="margin: 0; font-size: 16px; color: #374151; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-top: 32px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">This message was sent from the contact form on your website.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      attachments: attachment ? [
        {
          filename: attachment.name,
          content: await attachment.arrayBuffer().then(buffer => Buffer.from(buffer)),
          contentType: attachment.type,
        }
      ] : undefined,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
