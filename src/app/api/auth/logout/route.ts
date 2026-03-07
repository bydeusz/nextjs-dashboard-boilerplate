import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

export async function POST(request: Request) {
  try {
    const refreshToken = request.headers
      .get("cookie")
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`))
      ?.split("=")[1];

    if (refreshToken) {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: decodeURIComponent(refreshToken) }),
      });
    }

    const nextResponse = NextResponse.json({ message: "Logged out" }, { status: 200 });

    nextResponse.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return nextResponse;
  } catch {
    const nextResponse = NextResponse.json(
      { message: "Unexpected logout error" },
      { status: 500 },
    );

    nextResponse.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return nextResponse;
  }
}
