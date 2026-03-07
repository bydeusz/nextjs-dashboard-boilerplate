import type { Metadata } from "next";
import { auth } from "@/config/auth";
import { TeamList } from "@/components/Lists/TeamList";

export const metadata: Metadata = {
  title: "Team - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return <TeamList currentUser={session.user.id} />;
}