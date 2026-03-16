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
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (!email) {
    redirect("/reset-password");
  }

  return (
    <>
      <PasswordForm email={email} />
    </>
  );
}
