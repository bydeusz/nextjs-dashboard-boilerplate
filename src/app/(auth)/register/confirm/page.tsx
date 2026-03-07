import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RegisterConfirm from "@/components/forms/RegisterConfirm";

export const metadata: Metadata = {
  title: "Confirm your account - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function RegisterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  
  if (!email) {
    redirect("/register");
  }

  return <RegisterConfirm email={email} />;
}
