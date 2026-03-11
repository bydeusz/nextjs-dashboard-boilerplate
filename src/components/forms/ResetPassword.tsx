"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { InputField } from "@/components/ui/inputs/Input";
import { Button } from "@/components/ui/actions/Button";
import { Loader2 } from "lucide-react";
import { useAuthRequestNewPassword } from "@/generated/api/endpoints";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/messages/Alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/layout/Card";

export default function ResetPassword() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const t = useTranslations("auth.reset");
  const { mutateAsync: requestNewPassword } = useAuthRequestNewPassword();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      await requestNewPassword({
        data: { email },
      });

      setSuccess(true);
      setEmail("");
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

      setError(maybeMessage ?? (err instanceof Error ? err.message : t("error")));
    } finally {
      setIsLoading(false);
    }
  }

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
            placeholder="john@doe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex space-x-4 items-center">
            <Button disabled={isLoading} variant="default">
              {isLoading && <Loader2 className="size-4" />}
              {t("submit")}
            </Button>
            <Link
              href="/login"
              className="text-sm text-primary hover:underline underline-offset-4">
              {t("login")}
            </Link>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{t("success")}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
