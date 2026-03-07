import type { Metadata } from "next";
import { isLoggedIn } from "@/utils/isLoggedIn";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/ui/layout/Header";

export const metadata: Metadata = {
  title: "Websites - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Websites() {
  await isLoggedIn();
  const t = await getTranslations("pages.websites");

  return (
    <div className="p-4 md:p-12 space-y-6">
      <Header border={true} title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"></div>
    </div>
  );
}
