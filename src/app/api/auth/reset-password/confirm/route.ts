import { prisma } from "@/config/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // Check if token has expired
    if (new Date() > resetToken.expires) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: { email: resetToken.identifier },
      data: { password: hashedPassword },
    });

    // Delete the reset token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
