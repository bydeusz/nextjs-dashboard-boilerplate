import type { Metadata } from "next";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ResetPassword from "@/components/forms/ResetPassword";

export const metadata: Metadata = {
  title: "Reset your password - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function ResetPasswordPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <ResetPassword />
    </>
  );
}
