"use client";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { User } from "@/types/User";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/Card";
import { DeleteUser as Delete } from "@/components/modals/Delete";
import { Skeleton } from "@/components/ui/layout/Skeleton";

export function DeleteUser() {
  const t = useTranslations("forms.user-delete");
  const { data: session, status } = useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <Skeleton className="h-[36px] w-[190px]" />
        ) : session?.user ? (
          <Delete user={session.user as User} buttonText={t("deleteButton")} />
        ) : null}
      </CardContent>
    </Card>
  );
}
