import type { Metadata } from "next";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Login - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}
