"use client";

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
import { ShieldCheck } from "lucide-react";

export default function RegisterConfirm({ email }: { email: string }) {
  const router = useRouter();
  const t = useTranslations("auth.register.confirm");

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <ShieldCheck className="size-6 mr-2 text-green-500" />{" "}
            <span className="text-green-500">{t("title")}</span>
          </div>
        </CardTitle>
        <CardDescription>{t("description", { email })}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="default" onClick={() => router.push("/login")}>
          {t("button")}
        </Button>
      </CardContent>
    </Card>
  );
}
