"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { InputField } from "@/components/ui/inputs/Input";
import { Button } from "@/components/ui/actions/Button";
import { Loader2 } from "lucide-react";
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

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");

  const t = useTranslations("auth.register.form");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstname,
          surname,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register");
      }

      router.push(`/register/confirm?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
            label={t("firstname")}
            type="text"
            name="firstname"
            id="firstname"
            placeholder={t("firstnamePlaceholder")}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />

          <InputField
            label={t("surname")}
            type="text"
            name="surname"
            id="surname"
            placeholder={t("surnamePlaceholder")}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />

          <InputField
            label={t("email")}
            type="email"
            name="email"
            id="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex space-x-4 items-center">
            <Button disabled={isLoading} variant="default">
              {isLoading && <Loader2 className="size-4" />}
              {t("signUp")}
            </Button>
            <Link
              href="/login"
              className="font-medium text-sm text-primary hover:underline underline-offset-4">
              {t("alreadyHaveAccount")}
            </Link>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t("errorTitle")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
