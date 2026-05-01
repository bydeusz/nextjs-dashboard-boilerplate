"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { useOrganisationGet } from "@/generated/api/endpoints";
import { extractOrganisationFromResponse } from "@/helpers/organisation-response";
import { useAuth } from "@/providers/AuthProvider";
import { useOrganisation } from "@/providers/OrganisationProvider";

import { CreateOrganisationForm } from "@/components/forms/CreateOrganisationForm";

import { OrganisationLogoUpload } from "./OrganisationLogoUpload";

export function UpdateOrganisationBranding() {
  const t = useTranslations("forms.organisation-settings");
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const orgFromUrl = searchParams.get("org");
  const { selectedOrganisationId, setSelectedOrganisationId } =
    useOrganisation();

  useEffect(() => {
    if (!orgFromUrl || !user) {
      return;
    }
    if (!user.organisationIds.includes(orgFromUrl)) {
      return;
    }
    setSelectedOrganisationId(orgFromUrl);
  }, [orgFromUrl, user, setSelectedOrganisationId]);

  const orgId = selectedOrganisationId ?? "";

  const { data: rawGet, isLoading, isError } = useOrganisationGet(orgId, {
    query: {
      enabled: Boolean(selectedOrganisationId),
    },
  });

  const organisation = useMemo(
    () => extractOrganisationFromResponse(rawGet),
    [rawGet],
  );

  if (!selectedOrganisationId) {
    return <CreateOrganisationForm />;
  }

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500" aria-live="polite">
        {t("loading")}
      </p>
    );
  }

  if (isError || !organisation) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {t("errorLoad")}
      </p>
    );
  }

  return (
    <OrganisationLogoUpload
      organisationId={organisation.id}
      name={organisation.name}
      logoUrl={organisation.logoUrl}
      canEdit
    />
  );
}
