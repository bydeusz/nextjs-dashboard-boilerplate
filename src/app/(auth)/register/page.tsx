import type { Metadata } from "next";
import RegisterForm from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Register - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
    </>
  );
}
