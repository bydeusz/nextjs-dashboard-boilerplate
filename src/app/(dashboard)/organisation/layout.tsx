import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/layout/Header";
import { Tabs, Tab } from "@/components/ui/navigation/Tabs";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("pages.organisation");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t("title")} description={t("description")} />
      <Tabs>
        <Tab href={`/organisation`}>{t("tabs.details")}</Tab>
        <Tab href={`/organisation/branding`}>{t("tabs.branding")}</Tab>
        <Tab href={`/organisation/team`}>{t("tabs.team")}</Tab>
      </Tabs>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
