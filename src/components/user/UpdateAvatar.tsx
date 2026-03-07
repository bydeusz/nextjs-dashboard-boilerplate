"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import { Loader2 } from "lucide-react";

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
  const router = useRouter();
  const t = useTranslations("forms.user-avatar");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isMinioActive, setIsMinioActive] = useState(false);
  const { toast } = useToast();

  // Check MinIO status on component mount
  useEffect(() => {
    const checkMinioStatus = async () => {
      try {
        const response = await fetch("/api/user/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsMinioActive(data.minioActive || false);
          setAvatarPreview(data.user?.avatar || null);
        }
      } catch (err) {
        console.error("Error checking MinIO status:", err);
        setIsMinioActive(false);
      }
    };

    checkMinioStatus();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if MinIO is active before proceeding
    if (!isMinioActive) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: "Avatar upload is currently disabled",
      });
      return;
    }

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

        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch("/api/user/update-avatar", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update avatar");
        }

        // Update preview with new avatar URL
        setAvatarPreview(data.avatar);

        toast({
          title: t("successTitle"),
          description: t("success"),
          variant: "success",
        });
        router.refresh();
      } catch (err) {
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description:
            err instanceof Error ? err.message : "Failed to update avatar",
        });
      } finally {
        setIsLoading(false);
      }
    };

    img.src = objectUrl;
  };

  if (!isMinioActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            Avatar upload feature is currently disabled.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
