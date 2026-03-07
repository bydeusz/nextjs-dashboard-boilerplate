"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    email: "",
    role: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("/api/user/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFormData({
          firstname: data.user.firstname,
          surname: data.user.surname,
          email: data.user.email,
          role: data.user.role || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: "Failed to load user data",
        });
      }
    };

    getUser();
  }, [t, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstname", formData.firstname);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("role", formData.role);

      const response = await fetch("/api/user/update", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      toast({
        title: t("successTitle"),
        description: t("successMessage"),
        variant: "success",
      });
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("errorTitle"),
        description:
          err instanceof Error ? err.message : "Failed to update user",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

              <InputField
                label={t("role")}
                type="text"
                name="role"
                id="role"
                placeholder={t("rolePlaceholder")}
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-6">
              <Button variant="default" disabled={isLoading}>
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
