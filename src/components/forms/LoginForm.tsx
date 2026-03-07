"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/layout/Card";
import { InputField } from "@/components/ui/inputs/Input";
import { PasswordInput } from "@/components/ui/inputs/Password";
import { Button } from "@/components/ui/actions/Button";
import { Loader2 } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/messages/Alert";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = useTranslations("auth.login");

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "MissingCredentials":
        return t("errors.missingCredentials");
      case "UserNotFound":
        return t("errors.userNotFound");
      case "InvalidCredentials":
        return t("errors.invalidPassword");
      case "EmailNotVerified":
        return t("errors.emailNotVerified");
      default:
        return t("errors.default");
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.code) {
        setError(getErrorMessage(result.code));
        return;
      }

      if (result?.url) {
        router.push(result.url);
        router.refresh();
      }
    } catch (err) {
      setError(getErrorMessage("default"));
      console.error(err);
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
          <PasswordInput
            name="password"
            id="password"
            label={t("password")}
            required={true}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex space-x-4 items-center">
            <Button variant="default" disabled={isLoading}>
              {isLoading && <Loader2 className="size-4" />}
              {t("signIn")}
            </Button>
            <Link
              href="/reset-password"
              className="text-sm text-primary hover:underline underline-offset-4">
              {t("forgotPassword")}
            </Link>
          </div>
          <div className="flex space-x-1 items-center">
            <p className="text-xs text-gray-500">{t("alreadyHaveAccount")}</p>
            <Link
              href="/register"
              className="flex items-center bg-white text-primary font-medium hover:underline underline-offset-4 text-xs">
              {t("noAccount")}
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
