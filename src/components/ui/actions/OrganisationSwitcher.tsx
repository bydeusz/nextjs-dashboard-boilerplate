"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Plus } from "lucide-react";

import { useOrganisationGetList } from "@/generated/api/endpoints";
import type { OrganisationGetListParams } from "@/generated/api/model/organisationGetListParams";
import { extractOrganisationListFromResponse } from "@/helpers/organisation-response";
import { useAuth } from "@/providers/AuthProvider";
import { useOrganisation } from "@/providers/OrganisationProvider";

const LIST_PARAMS = {
  page: 1,
  limit: 100,
} as unknown as OrganisationGetListParams;

function OrgThumb({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (logoUrl) {
    return (
      <span className="relative size-6 rounded-sm shrink-0 overflow-hidden bg-gray-100 ring-1 ring-gray-200 mr-1">
        {/* eslint-disable-next-line @next/next/no-img-element -- presigned URLs from arbitrary storage hosts */}
        <img
          src={logoUrl}
          alt=""
          width={32}
          height={32}
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-gray-200 text-[10px] font-semibold text-gray-700 ring-1 ring-gray-300 mr-1"
      aria-hidden>
      {initial}
    </span>
  );
}

export default function OrganisationSwitcher() {
  const t = useTranslations("navigation.organisation");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { selectedOrganisationId, setSelectedOrganisationId, selectionSynced } =
    useOrganisation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: listResponse, isLoading: listLoading } = useOrganisationGetList(
    LIST_PARAMS,
    {
      query: {
        enabled: isAuthenticated && !authLoading,
      },
    },
  );

  const organisations = useMemo(
    () => extractOrganisationListFromResponse(listResponse),
    [listResponse],
  );

  const selected = useMemo(
    () =>
      organisations.find((o) => o.id === selectedOrganisationId) ?? null,
    [organisations, selectedOrganisationId],
  );

  useEffect(() => {
    if (!selectionSynced) {
      return;
    }
    if (!isAuthenticated || authLoading || listLoading) {
      return;
    }
    if (organisations.length === 0) {
      return;
    }

    if (
      selectedOrganisationId &&
      organisations.some((o) => o.id === selectedOrganisationId)
    ) {
      return;
    }

    if (selectedOrganisationId && user?.organisationIds.length) {
      const stillMember = user.organisationIds.includes(selectedOrganisationId);
      if (!stillMember) {
        setSelectedOrganisationId(organisations[0]?.id ?? null);
        return;
      }
    }

    if (!selectedOrganisationId) {
      setSelectedOrganisationId(organisations[0]?.id ?? null);
    }
  }, [
    authLoading,
    isAuthenticated,
    listLoading,
    organisations,
    selectedOrganisationId,
    selectionSynced,
    setSelectedOrganisationId,
    user?.organisationIds,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated || authLoading) {
    return null;
  }

  const showPlaceholder = listLoading && organisations.length === 0;

  if (!listLoading && organisations.length === 0) {
    return (
      <div className="text-xs">
        <Link
          href="/organisation/new"
          className="flex w-full min-w-0 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-center text-white hover:opacity-90">
          <Plus className="size-4 shrink-0" />
          <span className="truncate">{t("addOrganisation")}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative text-xs" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={listLoading && organisations.length === 0}
        className="cursor-pointer flex w-full min-w-0 items-center gap-2 rounded-md border-0 py-2.5 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-primary disabled:cursor-wait disabled:opacity-70">
        {showPlaceholder ? (
          <span className="truncate text-gray-500">{t("loading")}</span>
        ) : selected ? (
          <>
            <OrgThumb name={selected.name} logoUrl={selected.logoUrl} />
            <span className="min-w-0 flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="truncate text-gray-500">{t("placeholder")}</span>
        )}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {isOpen && organisations.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          {organisations.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => {
                setSelectedOrganisationId(org.id);
                setIsOpen(false);
              }}
              className={`cursor-pointer flex w-full min-w-0 items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 ${
                org.id === selectedOrganisationId ? "bg-gray-50" : ""
              }`}>
              <OrgThumb name={org.name} logoUrl={org.logoUrl} />
              <span className="min-w-0 flex-1 truncate">{org.name}</span>
            </button>
          ))}
          <div className="border-t border-gray-100 p-2">
            <Link
              href="/organisation/new"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-center text-white hover:opacity-90"
              onClick={() => setIsOpen(false)}>
              <Plus className="size-4 shrink-0" />
              {t("addOrganisation")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
