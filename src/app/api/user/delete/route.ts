import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
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

    // Get the request body
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Only allow admins to delete other users, but users can delete their own account
    if (!currentUser?.isAdmin && userId !== session.user.id) {
      return NextResponse.json(
        { error: "Only administrators can delete other user accounts" },
        { status: 403 },
      );
    }

    // Check if the target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user from the database
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
