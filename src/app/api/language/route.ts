import { NextResponse } from "next/server";

const SUPPORTED_LOCALES = new Set(["en", "nl"]);
const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: string };
    const locale = body?.locale;

    if (!locale || !SUPPORTED_LOCALES.has(locale)) {
      return NextResponse.json(
        { error: "Invalid locale. Supported locales are: en, nl." },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ ok: true, locale }, { status: 200 });

    response.cookies.set({
      name: LOCALE_COOKIE_NAME,
      value: locale,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}
