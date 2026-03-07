import type { Metadata } from "next";
import { auth } from "@/config/auth";
import LoginForm from "@/components/forms/LoginForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function LoginPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <LoginForm />
    </>
  );
}
