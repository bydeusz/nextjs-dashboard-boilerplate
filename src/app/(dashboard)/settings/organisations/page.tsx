import type { Metadata } from "next";
import { Suspense } from "react";

import { UpdateOrganisation } from "@/components/organisation/UpdateOrganisation";

export const metadata: Metadata = {
  title: "Organisations - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function OrganisationsSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={null}>
        <UpdateOrganisation />
      </Suspense>
    </div>
  );
}
