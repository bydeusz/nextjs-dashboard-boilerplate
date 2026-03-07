"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error"));
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

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
