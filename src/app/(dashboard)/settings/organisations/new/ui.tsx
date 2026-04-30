"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { CreateOrganisationForm } from "@/components/forms/CreateOrganisationForm";

export function CreateOrganisationPageClient() {
  const t = useTranslations("forms.createOrganisation");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!user?.isAdmin) {
      router.replace("/settings");
    }
  }, [isLoading, router, user?.isAdmin]);

  if (isLoading || !user?.isAdmin) {
    return (
      <p className="text-sm text-gray-500" aria-live="polite">
        {t("loading")}
      </p>
    );
  }

  return <CreateOrganisationForm />;
}
