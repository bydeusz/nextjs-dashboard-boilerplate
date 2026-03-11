"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthActivate } from "@/generated/api/endpoints";

import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/actions/Button";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";

export default function VerifyEmail({ token }: { token: string }) {
  const router = useRouter();
  const t = useTranslations("auth.verify");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);
  const { mutateAsync: activate } = useAuthActivate();

  const extractActivationData = (rawToken: string) => {
    const decoded = decodeURIComponent(rawToken);

    if (decoded.includes(":")) {
      const [email, ...codeParts] = decoded.split(":");
      const code = codeParts.join(":");
      if (email && code) {
        return { email, code };
      }
    }

    if (decoded.includes("|")) {
      const [email, ...codeParts] = decoded.split("|");
      const code = codeParts.join("|");
      if (email && code) {
        return { email, code };
      }
    }

    if (decoded.split(".").length === 3) {
      try {
        const payloadPart = decoded.split(".")[1];
        const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const payloadJson = JSON.parse(atob(base64));
        const email =
          typeof payloadJson.email === "string"
            ? payloadJson.email
            : typeof payloadJson.sub === "string"
              ? payloadJson.sub
              : "";

        if (email) {
          return { email, code: decoded };
        }
      } catch {
        return null;
      }
    }

    return null;
  };

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const activationData = extractActivationData(token);

        if (!activationData) {
          throw new Error(t("error"));
        }

        await activate({ data: activationData });
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
        setIsVerifying(false);
      }
    };

    void verifyEmail();
  }, [activate, t, token]);

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="size-8" />
      </div>
    );
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            {error ? (
              <ShieldX className="size-6 mr-2 text-red-500" />
            ) : (
              <ShieldCheck className="size-6 mr-2 text-green-500" />
            )}
            <span className={error ? "text-red-500" : "text-green-500"}>
              {error || t("success")}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          {error ? t("error") : t("redirecting")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="default"
          onClick={() => router.push(`/login?verified=${!error}`)}>
          {t("backToLogin")}
        </Button>
      </CardContent>
    </Card>
  );
}
