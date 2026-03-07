import { prisma } from "@/config/prisma";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message:
          "If an account exists, you will receive a password reset email",
      });
    }

    // Create reset token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store reset token
    await prisma.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send reset email
    const resetResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/mailer/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      },
    );

    if (!resetResponse.ok) {
      throw new Error("Failed to send reset email");
    }

    return NextResponse.json({
      message: "If an account exists, you will receive a password reset email",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
