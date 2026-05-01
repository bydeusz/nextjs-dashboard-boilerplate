import type { Metadata } from "next";
import { TeamList } from "@/components/Lists/TeamList";

export const metadata: Metadata = {
  title: "Team - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function Page() {
  return <TeamList />;
}
