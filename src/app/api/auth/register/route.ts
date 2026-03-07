import { prisma } from "@/config/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { validateDomain } from "@/utils/validateDomain";
import { randomBytes } from "crypto";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, firstname, surname } = await request.json();
    const allowedDomains = process.env.ALLOWED_DOMAIN;

    // Validate the input
    if (!email || !firstname || !surname) {
      return NextResponse.json(
        { error: "Email, firstname and surname are required" },
        { status: 400 },
      );
    }

    // Check if email domain is allowed
    if (!validateDomain(email, allowedDomains)) {
      const domains = allowedDomains?.split(',').map(d => d.trim()).join(', ');
      return NextResponse.json(
        { error: `Only ${domains} email addresses are allowed` },
        { status: 403 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Generate temporary password
    const temporaryPassword = randomBytes(8).toString("hex");
    const hashedPassword = await hash(temporaryPassword, 12);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        firstname,
        surname,
        password: hashedPassword,
        emailVerified: null,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        surname: true,
      },
    });

    if (!user || !user.id) {
      throw new Error("Failed to create user");
    }

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email with temporary password
    const verificationResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/mailer/verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          token,
          temporaryPassword,
          firstname,
          surname,
        }),
      },
    );

    if (!verificationResponse.ok) {
      // If email sending fails, we should clean up the created user
      await prisma.user.delete({
        where: { id: user.id },
      });
      throw new Error("Failed to send verification email");
    }

    return NextResponse.json(
      { 
        message: "User created successfully. Please check your email for verification and login details.",
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          surname: user.surname,
        }
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
