import { isLoggedIn } from "@/utils/isLoggedIn";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/ui/layout/Header";
import { Tabs, Tab } from "@/components/ui/navigation/Tabs";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await isLoggedIn();
  const t = await getTranslations("pages.settings");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header title={t("title")} description={t("description")} />
      <Tabs>
        <Tab href={`/settings`}>{t("tabs.profile")}</Tab>
        <Tab href={`/settings/account`}>{t("tabs.account")}</Tab>
        <Tab href={`/settings/team`}>{t("tabs.team")}</Tab>
      </Tabs>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
