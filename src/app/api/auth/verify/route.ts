import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Update user
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
