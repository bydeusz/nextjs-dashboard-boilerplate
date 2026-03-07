import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    const data = responseText
      ? (JSON.parse(responseText) as {
          access_token?: string;
          refresh_token?: string;
          message?: string;
        })
      : {};

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message ?? "Login failed" },
        { status: response.status },
      );
    }

    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json(
        { message: "Invalid token response from backend" },
        { status: 502 },
      );
    }

    const nextResponse = NextResponse.json(
      { access_token: data.access_token },
      { status: 200 },
    );

    nextResponse.cookies.set(REFRESH_TOKEN_COOKIE_NAME, data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });

    return nextResponse;
  } catch {
    return NextResponse.json({ message: "Unexpected login error" }, { status: 500 });
  }
}
