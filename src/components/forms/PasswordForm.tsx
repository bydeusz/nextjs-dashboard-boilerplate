"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { PasswordInput } from "@/components/ui/inputs/Password";
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
  token: string;
}

export default function PasswordForm({ token }: PasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("auth.reset");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("errors.passwordLength"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      router.push("/login?reset=success");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
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
