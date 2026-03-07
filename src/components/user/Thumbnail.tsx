import { prisma } from "@/config/prisma";
import { auth } from "@/config/auth";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/labels/Avatar";

export async function Thumbnail() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const data = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      firstname: true,
      surname: true,
      avatar: true,
    },
  });

  if (!data) {
    return null;
  }

  return (
    <Link href="/settings">
      <Avatar className="size-9 hover:ring-slate-300">
        {data.avatar ? (
          <AvatarImage
            src={data.avatar}
            alt={`avatar picture of ${data.firstname} ${data.surname}`}
          />
        ) : (
          <AvatarFallback>{data.firstname?.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}
