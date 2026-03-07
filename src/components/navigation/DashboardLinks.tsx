"use client";
import React from "react";
import { Home, Globe, Trophy, Gamepad2 } from "lucide-react";
import { NavLink } from "@/components/ui/actions/NavLink";
import { useTranslations } from "next-intl";

const DashboardLinks = () => {
  const t = useTranslations("navigation.navbar");

  return (
    <>
      <NavLink href="/">
        <Home className="size-4 mr-2" />
        {t("links.dashboard")}
      </NavLink>
      <NavLink href="/websites">
        <Globe className="size-4 mr-2" />
        {t("links.websites")}
      </NavLink>
    </>
  );
};

export default DashboardLinks;
