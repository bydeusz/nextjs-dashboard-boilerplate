import type { Metadata } from "next";
import { redirect } from "next/navigation";
import VerifyEmail from "@/components/forms/VerifyEmail";

export const metadata: Metadata = {
  title: "Verify your email - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;
  
  if (!token) {
    redirect("/login");
  }

  return (
    <>
      <VerifyEmail token={token} />
    </>
  );
}
