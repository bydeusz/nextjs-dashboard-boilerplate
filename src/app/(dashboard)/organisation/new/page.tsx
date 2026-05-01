import type { Metadata } from "next";

import { CreateOrganisationPageClient } from "./ui";

export const metadata: Metadata = {
  title: "New organisation - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function NewOrganisationPage() {
  return <CreateOrganisationPageClient />;
}
