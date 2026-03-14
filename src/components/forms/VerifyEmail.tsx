"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuthActivate } from "@/generated/api/endpoints";

import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/layout/Card";
import { InputField } from "@/components/ui/inputs/Input";
import { Button } from "@/components/ui/actions/Button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/messages/Alert";
import { Loader2 } from "lucide-react";

const CODE_LENGTH = 6;

export default function VerifyEmail({ email }: { email: string }) {
  const t = useTranslations("auth.verify");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { mutateAsync: activate } = useAuthActivate();
  const sanitizedEmail = email.trim();
  const hasEmail = sanitizedEmail.length > 0;
  const displayError = !hasEmail ? t("missingEmail") : error;
  const codeDigits = Array.from(
    { length: CODE_LENGTH },
    (_, index) => code[index] ?? "",
  );

  const updateCodeAtIndex = (index: number, value: string) => {
    const digits = codeDigits.slice();
    digits[index] = value;
    setCode(digits.join(""));
  };

  const handleCodeChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    updateCodeAtIndex(index, nextValue);

    if (nextValue && index < CODE_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      updateCodeAtIndex(index - 1, "");
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pasted) {
      return;
    }

    const digits = Array.from(
      { length: CODE_LENGTH },
      (_, index) => pasted[index] ?? "",
    );
    setCode(digits.join(""));
    codeInputRefs.current[Math.min(pasted.length, CODE_LENGTH) - 1]?.focus();
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!hasEmail) {
      setError(t("missingEmail"));
      return;
    }

    const sanitizedCode = code.trim();
    if (sanitizedCode.length !== CODE_LENGTH) {
      setError(t("codeRequired"));
      return;
    }

    setIsLoading(true);
    try {
      await activate({
        data: {
          email: sanitizedEmail,
          code: sanitizedCode,
        },
      });
      setIsSuccess(true);
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
        maybeMessage ?? (err instanceof Error ? err.message : t("error")),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>
          <span>{isSuccess ? t("success") : t("title")}</span>
        </CardTitle>
        <CardDescription>
          {isSuccess ? t("redirecting") : t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <InputField
              label={t("emailLabel")}
              type="email"
              name="email"
              id="email"
              placeholder={t("emailPlaceholder")}
              disabled={true}
              value={sanitizedEmail}
              onChange={() => undefined}
            />
            <div>
              <label
                htmlFor="code-0"
                className="block text-xs font-semibold leading-6 text-gray-900">
                {t("codeLabel")}
              </label>
              <div className="mt-2 flex items-center gap-2">
                {codeDigits.map((digit, index) => (
                  <input
                    key={`code-${index}`}
                    ref={(element) => {
                      codeInputRefs.current[index] = element;
                    }}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    className="h-12 w-12 rounded-md border border-gray-300 text-center text-lg font-semibold text-gray-900 outline-none shadow-sm focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                    placeholder=""
                    value={digit}
                    onChange={(event) =>
                      handleCodeChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleCodeKeyDown(index, event)}
                    onPaste={handleCodePaste}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <Button disabled={isLoading || !hasEmail} variant="default">
                {isLoading && <Loader2 className="size-4" />}
                {t("submit")}
              </Button>
              <Link
                href="/login"
                className="font-medium text-sm text-primary hover:underline underline-offset-4">
                {t("backToLogin")}
              </Link>
            </div>
            {displayError && (
              <Alert variant="destructive">
                <AlertTitle>{t("error")}</AlertTitle>
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}
          </form>
        )}
        {isSuccess && (
          <div className="flex space-x-4 items-center">
            <Link
              href="/login"
              className="font-medium text-sm text-primary hover:underline underline-offset-4">
              {t("backToLogin")}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
