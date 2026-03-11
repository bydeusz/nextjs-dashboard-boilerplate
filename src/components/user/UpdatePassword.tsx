"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthChangePassword } from "@/generated/api/endpoints";

import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/Card";
import { PasswordInput } from "@/components/ui/inputs/Password";
import { Button } from "@/components/ui/actions/Button";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/messages/Alert";

export function UpdatePassword() {
  const { logout } = useAuth();
  const t = useTranslations("forms.user-password");
  const { mutateAsync: changePassword } = useAuthChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("errors.passwordLength"));
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        data: {
          currentPassword,
          newPassword: password,
        },
      });

      await logout();
    } catch (error: unknown) {
      const maybeMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : null;

      setError(
        maybeMessage ?? (error instanceof Error ? error.message : t("errors.default")),
      );
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <PasswordInput
              label={t("currentPassword")}
              required={true}
              name="currentPassword"
              id="currentPassword"
              placeholder={t("currentPasswordPlaceholder")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <PasswordInput
              label={t("newPassword")}
              required={true}
              name="password"
              id="password"
              placeholder={t("newPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              label={t("confirmPassword")}
              required={true}
              name="confirmPassword"
              id="confirmPassword"
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <Button variant="default" disabled={isLoading}>
            {isLoading && <Loader2 className="size-4 mr-2" />}
            {t("update")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
