"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/hooks/useToast";
import {
  getOrganisationGetListQueryKey,
  useOrganisationCreate,
} from "@/generated/api/endpoints";
import type { CreateOrganisationDto } from "@/generated/api/model/createOrganisationDto";
import type { OrganisationGetListParams } from "@/generated/api/model/organisationGetListParams";
import type { OrganisationResponseDto } from "@/generated/api/model/organisationResponseDto";
import { useOrganisation } from "@/providers/OrganisationProvider";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/Card";
import { InputField } from "@/components/ui/inputs/Input";
import { Button } from "@/components/ui/actions/Button";

const LIST_PARAMS = {
  page: 1,
  limit: 100,
} as unknown as OrganisationGetListParams;

function unwrapCreatedOrganisation(
  result: unknown,
): OrganisationResponseDto | null {
  if (!result || typeof result !== "object") {
    return null;
  }
  const outer = result as { data?: unknown };
  const body = outer.data;
  if (!body || typeof body !== "object") {
    return null;
  }
  const envelope = body as { data?: unknown };
  if (
    envelope.data &&
    typeof envelope.data === "object" &&
    "id" in envelope.data
  ) {
    return envelope.data as OrganisationResponseDto;
  }
  return null;
}

export function CreateOrganisationForm() {
  const t = useTranslations("forms.createOrganisation");
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setSelectedOrganisationId } = useOrganisation();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [kvk, setKvk] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [iban, setIban] = useState("");

  const { mutateAsync: createOrganisation, isPending } = useOrganisationCreate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateOrganisationDto = {
      name: name.trim(),
      address: address.trim(),
      postalCode: postalCode.trim(),
      city: city.trim(),
    };
    if (kvk.trim()) {
      payload.kvk = kvk.trim();
    }
    if (vatNumber.trim()) {
      payload.vatNumber = vatNumber.trim();
    }
    if (iban.trim()) {
      payload.iban = iban.trim();
    }
    try {
      const result = await createOrganisation({ data: payload });
      await queryClient.invalidateQueries({
        queryKey: getOrganisationGetListQueryKey(LIST_PARAMS),
      });
      const created = unwrapCreatedOrganisation(result);
      if (created?.id) {
        setSelectedOrganisationId(created.id);
      }
      toast({
        title: t("successTitle"),
        description: t("success"),
        variant: "success",
      });
      router.push("/settings");
      router.refresh();
    } catch {
      toast({
        title: t("errorTitle"),
        description: t("error"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            id="org-name"
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            label={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputField
            id="org-address"
            name="address"
            type="text"
            placeholder={t("addressPlaceholder")}
            label={t("address")}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              id="org-postal"
              name="postalCode"
              type="text"
              placeholder={t("postalCodePlaceholder")}
              label={t("postalCode")}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
            <InputField
              id="org-city"
              name="city"
              type="text"
              placeholder={t("cityPlaceholder")}
              label={t("city")}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <InputField
            id="org-kvk"
            name="kvk"
            type="text"
            placeholder={t("kvkPlaceholder")}
            label={t("kvk")}
            value={kvk}
            onChange={(e) => setKvk(e.target.value)}
          />
          <InputField
            id="org-vat"
            name="vatNumber"
            type="text"
            placeholder={t("vatNumberPlaceholder")}
            label={t("vatNumber")}
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
          />
          <InputField
            id="org-iban"
            name="iban"
            type="text"
            placeholder={t("ibanPlaceholder")}
            label={t("iban")}
            value={iban}
            onChange={(e) => setIban(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/settings")}
              disabled={isPending}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
