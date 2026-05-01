"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getOrganisationGetListQueryKey,
  getOrganisationGetQueryKey,
  useOrganisationGet,
  useOrganisationUpdate,
} from "@/generated/api/endpoints";
import type { OrganisationGetListParams } from "@/generated/api/model/organisationGetListParams";
import type { UpdateOrganisationDto } from "@/generated/api/model/updateOrganisationDto";
import { useToast } from "@/hooks/useToast";
import { extractOrganisationFromResponse } from "@/helpers/organisation-response";
import { useAuth } from "@/providers/AuthProvider";
import { useOrganisation } from "@/providers/OrganisationProvider";

import { Button } from "@/components/ui/actions/Button";
import { CreateOrganisationForm } from "@/components/forms/CreateOrganisationForm";
import { InputField } from "@/components/ui/inputs/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/Card";

const LIST_PARAMS = {
  page: 1,
  limit: 100,
} as unknown as OrganisationGetListParams;

export function UpdateOrganisation() {
  const t = useTranslations("forms.organisation-settings");
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    kvk: "",
    vatNumber: "",
    iban: "",
  });

  useEffect(() => {
    if (!organisation) {
      return;
    }
    setFormData({
      name: organisation.name ?? "",
      address: organisation.address ?? "",
      postalCode: organisation.postalCode ?? "",
      city: organisation.city ?? "",
      kvk: organisation.kvk ?? "",
      vatNumber: organisation.vatNumber ?? "",
      iban: organisation.iban ?? "",
    });
  }, [organisation]);

  const [isSaving, setIsSaving] = useState(false);
  const { mutateAsync: updateOrganisation } = useOrganisationUpdate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisation?.id) {
      return;
    }

    const payload: UpdateOrganisationDto = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      postalCode: formData.postalCode.trim(),
      city: formData.city.trim(),
    };
    if (formData.kvk.trim()) {
      payload.kvk = formData.kvk.trim();
    }
    if (formData.vatNumber.trim()) {
      payload.vatNumber = formData.vatNumber.trim();
    }
    if (formData.iban.trim()) {
      payload.iban = formData.iban.trim();
    }

    setIsSaving(true);
    try {
      await updateOrganisation({ id: organisation.id, data: payload });
      await queryClient.invalidateQueries({
        queryKey: getOrganisationGetQueryKey(organisation.id),
      });
      await queryClient.invalidateQueries({
        queryKey: getOrganisationGetListQueryKey(LIST_PARAMS),
      });
      toast({
        title: t("successTitle"),
        description: t("successMessage"),
        variant: "success",
      });
      router.refresh();
    } catch (err) {
      const maybeMessage =
        err &&
        typeof err === "object" &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : null;

      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description:
          maybeMessage ??
          (err instanceof Error ? err.message : t("errorMessage")),
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  const disabled = false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label={t("name")}
            type="text"
            name="name"
            id="org-settings-name"
            placeholder={t("namePlaceholder")}
            value={formData.name}
            onChange={handleChange}
            disabled={disabled}
          />
          <InputField
            label={t("address")}
            type="text"
            name="address"
            id="org-settings-address"
            placeholder={t("addressPlaceholder")}
            value={formData.address}
            onChange={handleChange}
            disabled={disabled}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label={t("postalCode")}
              type="text"
              name="postalCode"
              id="org-settings-postal"
              placeholder={t("postalCodePlaceholder")}
              value={formData.postalCode}
              onChange={handleChange}
              disabled={disabled}
            />
            <InputField
              label={t("city")}
              type="text"
              name="city"
              id="org-settings-city"
              placeholder={t("cityPlaceholder")}
              value={formData.city}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
          <InputField
            label={t("kvk")}
            type="text"
            name="kvk"
            id="org-settings-kvk"
            placeholder={t("kvkPlaceholder")}
            value={formData.kvk}
            onChange={handleChange}
            disabled={disabled}
          />
          <InputField
            label={t("vatNumber")}
            type="text"
            name="vatNumber"
            id="org-settings-vat"
            placeholder={t("vatNumberPlaceholder")}
            value={formData.vatNumber}
            onChange={handleChange}
            disabled={disabled}
          />
          <InputField
            label={t("iban")}
            type="text"
            name="iban"
            id="org-settings-iban"
            placeholder={t("ibanPlaceholder")}
            value={formData.iban}
            onChange={handleChange}
            disabled={disabled}
          />
          <div className="pt-2">
            <Button type="submit" disabled={disabled || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
