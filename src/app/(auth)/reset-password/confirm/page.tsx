import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PasswordForm from "@/components/forms/PasswordForm";

export const metadata: Metadata = {
  title:
    "Confirm your password reset - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function ResetPasswordConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  // Redirect to reset password page if no token
  if (!token) {
    redirect("/reset-password");
  }

  return (
    <>
      <PasswordForm token={token} />
    </>
  );
}
