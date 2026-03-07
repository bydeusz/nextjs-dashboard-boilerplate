import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get form data
    const formData = await request.formData();
    const firstname = formData.get("firstname") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    // Basic validation
    if (!firstname || !surname || !email || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if email domain is allowed
    const allowedDomains = process.env.ALLOWED_DOMAIN?.split(',') || [];
    const emailDomain = email.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: `Only ${allowedDomains.join(', ')} email addresses are allowed` },
        { status: 403 },
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        firstname,
        surname,
        email,
        role,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        firstname: updatedUser.firstname,
        surname: updatedUser.surname,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
