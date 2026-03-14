"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/actions/Button";

export default function RegisterConfirm() {
  const router = useRouter();
  const t = useTranslations("auth.register.confirm");
  const [email] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (sessionStorage.getItem("registerEmail") ?? ""),
  );

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description", { email: email || t("emailFallback") })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="default" onClick={() => router.push("/login")}>
          {t("button")}
        </Button>
      </CardContent>
    </Card>
  );
}
