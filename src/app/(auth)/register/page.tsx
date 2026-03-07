import type { Metadata } from "next";
import { auth } from "@/config/auth";
import RegisterForm from "@/components/forms/RegisterForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Register - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function RegisterPage() {
  const session = await auth();

  // Redirect to home if already logged in
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <RegisterForm />
    </>
  );
}
