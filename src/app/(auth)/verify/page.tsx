import type { Metadata } from "next";
import VerifyEmail from "@/components/forms/VerifyEmail";

export const metadata: Metadata = {
  title: "Verify your email - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <>
      <VerifyEmail email={email ?? ""} />
    </>
  );
}
