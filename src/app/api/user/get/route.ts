import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { MINIO_ACTIVE } from "@/config/minio";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        firstname: true,
        surname: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transformedUser = {
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
      role: user.role || "",
      avatar: user.avatar || "",
    };

    return NextResponse.json({ 
      user: transformedUser,
      minioActive: MINIO_ACTIVE
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
