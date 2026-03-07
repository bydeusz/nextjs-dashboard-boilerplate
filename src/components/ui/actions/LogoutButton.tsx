"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const t = useTranslations("common.buttons");

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full items-center text-xs font-medium transition-all duration-200 text-gray-900 hover:bg-gray-100 hover:text-slate-700 rounded-md px-[10px] py-2">
      <LogOut className="size-4 mr-1.5" />
      {t("logout")}
    </button>
  );
}
