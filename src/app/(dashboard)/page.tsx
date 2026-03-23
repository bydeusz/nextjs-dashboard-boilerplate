import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { Header } from "@/components/ui/layout/Header";

export const metadata: Metadata = {
  title: "Dashboard - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function DashboardPage() {
  const t = await getTranslations("pages.dashboard");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header border={true} title={t("title")} />
    </div>
  );
}
