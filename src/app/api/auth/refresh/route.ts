import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  try {
    const refreshToken = request.headers
      .get("cookie")
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`))
      ?.split("=")[1];

    if (!refreshToken) {
      return NextResponse.json({ message: "Missing refresh token" }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: decodeURIComponent(refreshToken) }),
    });

    const responseText = await response.text();
    const data = responseText
      ? (JSON.parse(responseText) as {
          access_token?: string;
          refresh_token?: string;
          message?: string;
          data?: {
            access_token?: string;
            refresh_token?: string;
          };
        })
      : {};
    const accessToken = data.access_token ?? data.data?.access_token;
    const refreshTokenFromBackend = data.refresh_token ?? data.data?.refresh_token;

    if (!response.ok) {
      const nextResponse = NextResponse.json(
        { message: data.message ?? "Refresh failed" },
        { status: response.status },
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

    if (!accessToken || !refreshTokenFromBackend) {
      return NextResponse.json(
        { message: "Invalid token response from backend" },
        { status: 502 },
      );
    }

    const nextResponse = NextResponse.json(
      { access_token: accessToken },
      { status: 200 },
    );

    nextResponse.cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshTokenFromBackend, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "Unexpected refresh error" },
      { status: 500 },
    );
  }
}
