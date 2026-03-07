import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";
import { minioClient, MINIO_BUCKET_NAME, MINIO_ACTIVE } from "@/config/minio";

export async function POST(request: Request) {
  try {
    // Check if MinIO is active
    if (!MINIO_ACTIVE || !minioClient) {
      return NextResponse.json(
        { error: "Avatar upload is currently disabled" },
        { status: 503 },
      );
    }

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
    const avatarFile = formData.get("avatar") as File | null;

    if (!avatarFile) {
      return NextResponse.json(
        { error: "Avatar file is required" },
        { status: 400 },
      );
    }

    // Generate avatar path
    const extension = avatarFile.name.split('.').pop();
    const avatarPath = `users/${session.user.id}/${session.user.id}-avatar.${extension}`;

    // Convert File to Buffer
    const buffer = Buffer.from(await avatarFile.arrayBuffer());

    // Upload to MinIO
    await minioClient.putObject(
      MINIO_BUCKET_NAME,
      avatarPath,
      buffer,
      avatarFile.size,
      { 'Content-Type': avatarFile.type }
    );

    // Generate URL for the avatar
    const avatarUrl = `${process.env.NEXT_PUBLIC_MINIO_URL}/${MINIO_BUCKET_NAME}/${avatarPath}`;

    // Update user's avatar URL
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        avatar: avatarUrl,
      },
    });

    return NextResponse.json({
      message: "Avatar updated successfully",
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
} 