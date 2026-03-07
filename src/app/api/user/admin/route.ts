import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    // Check if the user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get the current user to check if they are an admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.isAdmin) {
      return NextResponse.json(
        { error: "Only administrators can perform this action" },
        { status: 403 },
      );
    }

    // Get the request body
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Don't allow admins to toggle their own admin status
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot modify your own admin status" },
        { status: 400 },
      );
    }

    // Get the target user to check their current admin status
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle the admin status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: !targetUser.isAdmin },
    });

    return NextResponse.json({
      message: `User admin status ${updatedUser.isAdmin ? "enabled" : "disabled"} successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error updating user admin status:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
