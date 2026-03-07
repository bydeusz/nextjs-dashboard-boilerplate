/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/layout/Card";
import Admin from "@/components/modals/Admin";
import { DeleteUser } from "@/components/modals/Delete";
import { Badge } from "@/components/ui/labels/Badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/labels/Avatar";

interface UserItemProps {
  user: any;
  currentUser: any;
}

export const TeammateCard = ({ user, currentUser }: UserItemProps) => {
  const t = useTranslations("tables.team");

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center pt-6">
          <div className="flex space-x-4 items-center">
            <Avatar className="size-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex space-x-2 items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  {user.name}
                </h3>
                {user.isAdmin && <Badge variant="green">{t("admin")}</Badge>}
                {!user.emailVerified && (
                  <Badge variant="yellow">{t("pending")}</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 font-normal">{user.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Admin
              user={user}
              disabled={
                !currentUser?.isAdmin ||
                currentUser?.id === user.id ||
                !user.emailVerified
              }
            />
            <DeleteUser
              user={user}
              disabled={!currentUser?.isAdmin || currentUser?.id === user.id}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
