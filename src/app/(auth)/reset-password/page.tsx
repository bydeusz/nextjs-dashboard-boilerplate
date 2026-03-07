import type { Metadata } from "next";
import ResetPassword from "@/components/forms/ResetPassword";

export const metadata: Metadata = {
  title: "Reset your password - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function ResetPasswordPage() {
  return (
    <>
      <ResetPassword />
    </>
  );
}
