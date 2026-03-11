"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  getAuthMeGetQueryKey,
  useAuthMeGet,
  useFileUpload,
} from "@/generated/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/layout/Card";

interface UpdateAvatarProps {
  firstname?: string;
}

export function UpdateAvatar({ firstname }: UpdateAvatarProps) {
  const t = useTranslations("forms.user-avatar");
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: meResponse } = useAuthMeGet();
  const { mutateAsync: uploadFile } = useFileUpload();

  useEffect(() => {
    setAvatarPreview(meResponse?.data?.avatarUrl ?? null);
  }, [meResponse]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: "Please upload a JPEG, PNG, or GIF file",
      });
      return;
    }

    // Validate file size (3MB = 3 * 1024 * 1024 bytes)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: "File size must be less than 3MB",
      });
      return;
    }

    // Validate image dimensions
    const img = document.createElement("img");
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      if (img.width > 800 || img.height > 800) {
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: "Image dimensions must be maximum 800x800 pixels",
        });
        return;
      }

      try {
        setIsLoading(true);
        const me = meResponse?.data;
        if (!me?.id) {
          throw new Error("Failed to resolve current user id");
        }

        const response = await uploadFile({
          scope: "user",
          ownerId: me.id,
          folder: "avatars",
          data: { file },
        });

        // Update preview with new avatar URL
        setAvatarPreview(response.data.downloadUrl);
        await queryClient.invalidateQueries({ queryKey: getAuthMeGetQueryKey() });

        toast({
          title: t("successTitle"),
          description: t("success"),
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
          description: maybeMessage ?? (err instanceof Error ? err.message : "Failed to update avatar"),
        });
      } finally {
        setIsLoading(false);
      }
    };

    img.src = objectUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar"
                width={800}
                height={800}
                className="rounded-md object-cover w-24 h-24"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500 text-3xl">
                  {firstname?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleAvatarUpload}
              className="hidden"
              id="avatar-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="avatar-upload"
              className={`text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md inline-flex items-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("button")}
                </>
              ) : (
                t("button")
              )}
            </label>
            <p className="text-xs text-gray-500">
              JPEG, PNG, GIF (max 800x800px, max 3MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
