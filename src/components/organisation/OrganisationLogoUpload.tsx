"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import {
  getOrganisationGetListQueryKey,
  getOrganisationGetQueryKey,
  useFileReplace,
} from "@/generated/api/endpoints";
import type { OrganisationGetListParams } from "@/generated/api/model/organisationGetListParams";
import { useToast } from "@/hooks/useToast";

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

function downloadUrlFromReplaceResult(result: unknown): string | null {
  if (!result || typeof result !== "object") {
    return null;
  }
  const outer = result as { data?: unknown };
  const first = outer.data;
  if (
    first &&
    typeof first === "object" &&
    "downloadUrl" in first &&
    typeof (first as { downloadUrl: unknown }).downloadUrl === "string"
  ) {
    return (first as { downloadUrl: string }).downloadUrl;
  }
  if (first && typeof first === "object" && "data" in first) {
    const inner = (first as { data: unknown }).data;
    if (
      inner &&
      typeof inner === "object" &&
      "downloadUrl" in inner &&
      typeof (inner as { downloadUrl: unknown }).downloadUrl === "string"
    ) {
      return (inner as { downloadUrl: string }).downloadUrl;
    }
  }
  return null;
}

type OrganisationLogoUploadProps = {
  organisationId: string;
  name: string;
  logoUrl: string | null;
  canEdit: boolean;
};

export function OrganisationLogoUpload({
  organisationId,
  name,
  logoUrl,
  canEdit,
}: OrganisationLogoUploadProps) {
  const t = useTranslations("forms.organisation-settings");
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(logoUrl);

  useEffect(() => {
    setPreview(logoUrl);
  }, [logoUrl]);

  const { mutateAsync: replaceFile } = useFileReplace();

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canEdit) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("logoInvalidType"),
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: t("logoTooLarge"),
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await replaceFile({
        scope: "organisation",
        ownerId: organisationId,
        folder: "logo",
        data: { file },
      });

      const url = downloadUrlFromReplaceResult(response);
      if (url) {
        setPreview(url);
      }

      await queryClient.invalidateQueries({
        queryKey: getOrganisationGetQueryKey(organisationId),
      });
      await queryClient.invalidateQueries({
        queryKey: getOrganisationGetListQueryKey(LIST_PARAMS),
      });

      router.refresh();

      toast({
        title: t("successTitle"),
        description: t("successMessage"),
        variant: "success",
      });
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
      setIsLoading(false);
      e.target.value = "";
    }
  };

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("logoTitle")}</CardTitle>
        <CardDescription>{t("logoDescription")}</CardDescription>
        {!canEdit ? (
          <p className="text-xs text-gray-600 pt-1">{t("adminOnlyHint")}</p>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- signed URLs from storage
              <img
                src={preview}
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-3xl font-semibold text-gray-500">
                {initial}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
              id="organisation-logo-upload"
              disabled={isLoading || !canEdit}
            />
            <label
              htmlFor="organisation-logo-upload"
              className={`inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 ${
                isLoading || !canEdit
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("logoButton")}
                </>
              ) : (
                t("logoButton")
              )}
            </label>
            <p className="text-xs text-gray-500">{t("logoHelp")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
