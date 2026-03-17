"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Loader2 } from "lucide-react";
import {
  getAuthMeGetQueryKey,
  useUserUpdate,
} from "@/generated/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";

import { Button } from "@/components/ui/actions/Button";
import { InputField } from "@/components/ui/inputs/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/Card";

export function UpdateUser() {
  const router = useRouter();
  const t = useTranslations("forms.user-update");
  const queryClient = useQueryClient();
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    email: "",
  });

  const { toast } = useToast();
  const { mutateAsync: updateUserMutation } = useUserUpdate();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setFormData((prev) => {
      const hasUserInput = Boolean(prev.firstname || prev.surname || prev.email);

      if (hasUserInput) {
        return prev;
      }

      return {
        firstname: currentUser.name ?? "",
        surname: currentUser.surname ?? "",
        email: currentUser.email ?? "",
      };
    });
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUser = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentUser?.id) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description: "Failed to resolve current user id",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updateUserMutation({
        id: currentUser.id,
        data: {
          name: formData.firstname,
          surname: formData.surname,
          email: formData.email,
        },
      });

      await queryClient.invalidateQueries({ queryKey: getAuthMeGetQueryKey() });

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
        description: maybeMessage ?? (err instanceof Error ? err.message : "Failed to update user"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isResolvingCurrentUser = isAuthLoading || !currentUser?.id;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateUser}>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <InputField
                    label={t("firstname")}
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder={t("firstnamePlaceholder")}
                    value={formData.firstname}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex-1">
                  <InputField
                    label={t("surname")}
                    type="text"
                    name="surname"
                    id="surname"
                    placeholder={t("surnamePlaceholder")}
                    value={formData.surname}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <InputField
                label={t("email")}
                type="email"
                name="email"
                id="email"
                placeholder={t("emailPlaceholder")}
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-6">
              <Button variant="default" disabled={isLoading || isResolvingCurrentUser}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("save")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
