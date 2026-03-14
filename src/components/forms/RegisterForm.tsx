"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { InputField } from "@/components/ui/inputs/Input";
import { PasswordInput } from "@/components/ui/inputs/Password";
import { Button } from "@/components/ui/actions/Button";
import { Loader2 } from "lucide-react";
import { useAuthRegister } from "@/generated/api/endpoints";
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
  const [password, setPassword] = useState("");

  const t = useTranslations("auth.register.form");
  const { mutateAsync: register } = useAuthRegister();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        data: {
          email,
          name: firstname,
          surname,
          password,
        },
      });

      sessionStorage.setItem("registerEmail", email);
      router.push("/register/confirm");
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

      setError(
        maybeMessage ??
          (err instanceof Error ? err.message : "Something went wrong"),
      );
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
          <PasswordInput
            label="Password"
            required={true}
            name="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
