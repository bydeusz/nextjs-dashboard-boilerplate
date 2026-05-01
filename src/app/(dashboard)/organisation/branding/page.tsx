import type { Metadata } from "next";
import { Suspense } from "react";

import { UpdateOrganisationBranding } from "@/components/organisation/UpdateOrganisationBranding";

export const metadata: Metadata = {
  title: "Branding - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default function OrganisationBrandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={null}>
        <UpdateOrganisationBranding />
      </Suspense>
    </div>
  );
}
