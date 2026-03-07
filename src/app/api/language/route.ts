import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { locale } = await request.json();

  // Validate locale
  if (!["en", "nl"].includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  // Set the cookie
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
