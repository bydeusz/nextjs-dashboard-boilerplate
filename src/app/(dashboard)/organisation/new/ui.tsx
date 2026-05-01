"use client";

import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/AuthProvider";
import { CreateOrganisationForm } from "@/components/forms/CreateOrganisationForm";

export function CreateOrganisationPageClient() {
  const t = useTranslations("forms.createOrganisation");
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500" aria-live="polite">
        {t("loading")}
      </p>
    );
  }

  return <CreateOrganisationForm />;
}
