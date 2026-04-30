"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/messages/Alert";

export function NoOrganisationBanner() {
  const { user, isLoading } = useAuth();
  const t = useTranslations("banners.noOrganisation");

  if (isLoading || !user) {
    return null;
  }

  if (user.organisationIds.length > 0) {
    return null;
  }

  return (
    <Alert variant="info" className="mb-4">
      <AlertTitle>{t("title")}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{t("description")}</span>
        <Link
          href="/settings/organisations/new"
          className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline shrink-0"
        >
          {t("cta")}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </AlertDescription>
    </Alert>
  );
}
