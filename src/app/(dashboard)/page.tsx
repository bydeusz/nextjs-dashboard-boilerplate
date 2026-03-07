import { getTranslations } from "next-intl/server";
import { isLoggedIn } from "@/utils/isLoggedIn";
import type { Metadata } from "next";

import { Header } from "@/components/ui/layout/Header";
import LinkedCard from "@/components/cards/LinkedCard";

export const metadata: Metadata = {
  title: "Dashboard - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Home() {
  await isLoggedIn();
  const t = await getTranslations("pages.dashboard");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header border={true} title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <LinkedCard
          title="Websites"
          description="Add your websites that have access to the API routes."
          button="Add websites"
          href="/websites"
          badge="Access"
        />
      </div>
    </div>
  );
}
