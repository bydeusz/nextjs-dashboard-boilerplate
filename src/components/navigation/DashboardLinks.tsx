"use client";
import React from "react";
import { Home, Building2 } from "lucide-react";
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
      <NavLink href="/organisation">
        <Building2 className="size-4 mr-2" />
        {t("links.organisation")}
      </NavLink>
    </>
  );
};

export default DashboardLinks;
