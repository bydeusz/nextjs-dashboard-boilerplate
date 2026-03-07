import { NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { auth } from "@/config/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany();
    
    // Sort users alphabetically by name
    const sortedUsers = users.sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

    return NextResponse.json(sortedUsers);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
