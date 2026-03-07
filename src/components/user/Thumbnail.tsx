"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/labels/Avatar";

export function Thumbnail() {
  const { user } = useAuth();

  if (!user?.id) {
    return null;
  }

  return (
    <Link href="/settings">
      <Avatar className="size-9 hover:ring-slate-300">
        {user.avatarUrl ? (
          <AvatarImage
            src={user.avatarUrl}
            alt={`avatar picture of ${user.name} ${user.surname}`}
          />
        ) : (
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}
