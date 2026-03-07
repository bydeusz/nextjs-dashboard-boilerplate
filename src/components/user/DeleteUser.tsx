"use client";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";

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
  const { user, isLoading } = useAuth();

  const modalUser: User | null = user
    ? {
        id: user.id,
        email: user.email,
        firstname: user.name,
        surname: user.surname,
        isAdmin: user.isAdmin,
        role: null,
        password: null,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        emailVerified: null,
        avatar: user.avatarUrl,
      }
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[36px] w-[190px]" />
        ) : modalUser ? (
          <Delete user={modalUser} buttonText={t("deleteButton")} />
        ) : null}
      </CardContent>
    </Card>
  );
}
