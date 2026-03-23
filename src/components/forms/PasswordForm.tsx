"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthResetPassword } from "@/generated/api/endpoints";

import { PasswordInput } from "@/components/ui/inputs/Password";
import { InputField } from "@/components/ui/inputs/Input";
import { Loader2 } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/messages/Alert";
import { Button } from "@/components/ui/actions/Button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/layout/Card";

interface PasswordFormProps {
  email: string;
}

export default function PasswordForm({ email }: PasswordFormProps) {
  const router = useRouter();
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("auth.reset");
  const { mutateAsync: resetPassword } = useAuthResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t("missingEmail"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("errors.passwordLength"));
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        data: {
          email,
          temporaryPassword,
          newPassword,
        },
      });

      router.push("/login?reset=success");
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

      if (maybeMessage === "Temporary password has expired.") {
        setError(t("errors.expired"));
      } else {
        setError(
          maybeMessage ?? (err instanceof Error ? err.message : t("error")),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label={t("email")}
            required={true}
            type="email"
            name="email"
            id="email"
            placeholder={email || ""}
            disabled={true}
            value={email}
            onChange={() => undefined}
          />
          <PasswordInput
            label={t("temporaryPassword")}
            required={true}
            name="temporaryPassword"
            id="temporaryPassword"
            placeholder={t("temporaryPasswordPlaceholder")}
            value={temporaryPassword}
            onChange={(e) => setTemporaryPassword(e.target.value)}
          />
          <PasswordInput
            label={t("newPassword")}
            required={true}
            name="newPassword"
            id="newPassword"
            placeholder={t("newPasswordPlaceholder")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          <Button disabled={isLoading} variant="default">
            {isLoading && <Loader2 className="size-4" />}
            {t("resetButton")}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
