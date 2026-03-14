import type { Metadata } from "next";
import RegisterConfirm from "@/components/forms/RegisterConfirm";

export const metadata: Metadata = {
  title: "Confirm your account - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function RegisterConfirmPage() {
  return <RegisterConfirm />;
}
