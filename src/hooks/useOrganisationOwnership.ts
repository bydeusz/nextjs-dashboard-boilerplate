"use client";

import { useMemo } from "react";

import { useOrganisationMemberList } from "@/generated/api/endpoints";
import type { OrganisationMemberListParams } from "@/generated/api/model/organisationMemberListParams";
import { OrganisationRole } from "@/generated/api/model/organisationRole";
import { extractMemberListFromResponse } from "@/helpers/member-response";
import { useAuth } from "@/providers/AuthProvider";

const LIST_PARAMS = {
  page: 1,
  limit: 100,
} as unknown as OrganisationMemberListParams;

type Result = {
  isOwner: boolean;
  isMember: boolean;
  isLoading: boolean;
};

/**
 * Returns whether the currently authenticated user is OWNER (or at least
 * a MEMBER) of the given organisation. Reads from the cached member list
 * so callers don't trigger a second roundtrip when TeamList is mounted.
 *
 * `isOwner` defaults to `false` while loading; gate destructive UI on
 * `!isLoading && isOwner` if you want to avoid a "disabled then enabled"
 * flash.
 */
export function useOrganisationOwnership(
  organisationId: string | null | undefined,
): Result {
  const { user } = useAuth();
  const enabled = Boolean(organisationId) && Boolean(user);

  const { data: rawList, isLoading } = useOrganisationMemberList(
    organisationId ?? "",
    LIST_PARAMS,
    { query: { enabled } },
  );

  const members = useMemo(
    () => extractMemberListFromResponse(rawList),
    [rawList],
  );

  const currentMembership = useMemo(
    () => members.find((m) => m.userId === user?.id) ?? null,
    [members, user?.id],
  );

  return {
    isOwner: currentMembership?.role === OrganisationRole.OWNER,
    isMember: currentMembership !== null,
    isLoading: enabled && isLoading,
  };
}
