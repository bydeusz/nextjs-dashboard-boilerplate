"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/providers/AuthProvider";
import { useOrganisation } from "@/providers/OrganisationProvider";
import { useOrganisationMemberGetList } from "@/generated/api/endpoints";
import type { OrganisationMemberGetListParams } from "@/generated/api/model/organisationMemberGetListParams";
import { OrganisationRole } from "@/generated/api/model/organisationRole";
import {
  extractMemberListFromResponse,
  extractMemberListMetaFromResponse,
} from "@/helpers/member-response";

import { SearchInput } from "@/components/ui/inputs/Search";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/labels/Avatar";
import { Badge } from "@/components/ui/labels/Badge";
import { Skeleton } from "@/components/ui/layout/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/layout/Table";
import { ChangeMemberRoleDialog } from "@/components/organisation/ChangeMemberRoleDialog";
import { InviteMemberDialog } from "@/components/organisation/InviteMemberDialog";
import { RemoveMemberDialog } from "@/components/organisation/RemoveMemberDialog";

// TODO: replace with proper pagination (useInfiniteQuery + load-more) once
// teams larger than this become a real use case. Until then we surface a
// truncation hint when meta.total exceeds what's rendered.
const MEMBER_PAGE_LIMIT = 100;
const LIST_PARAMS = {
  page: 1,
  limit: MEMBER_PAGE_LIMIT,
} as unknown as OrganisationMemberGetListParams;

export function TeamList() {
  const { user } = useAuth();
  const navT = useTranslations("navigation.navbar");
  const teamT = useTranslations("tables.team");

  const { selectedOrganisationId } = useOrganisation();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: rawList,
    isLoading,
    isError,
  } = useOrganisationMemberGetList(selectedOrganisationId ?? "", LIST_PARAMS, {
    query: { enabled: Boolean(selectedOrganisationId) },
  });

  const members = useMemo(
    () => extractMemberListFromResponse(rawList),
    [rawList],
  );
  const meta = useMemo(
    () => extractMemberListMetaFromResponse(rawList),
    [rawList],
  );
  const hiddenMemberCount =
    meta && meta.total > members.length ? meta.total - members.length : 0;

  const ownerCount = useMemo(
    () => members.filter((m) => m.role === OrganisationRole.OWNER).length,
    [members],
  );

  const currentMembership = useMemo(
    () => members.find((m) => m.userId === user?.id) ?? null,
    [members, user?.id],
  );
  const isOwner = currentMembership?.role === OrganisationRole.OWNER;

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return members;
    return members.filter((m) => {
      const fullName = `${m.user.name} ${m.user.surname}`.trim().toLowerCase();
      return fullName.includes(q) || m.user.email.toLowerCase().includes(q);
    });
  }, [members, searchQuery]);

  if (!selectedOrganisationId) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {teamT("selectOrgFirst")}
      </p>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between space-x-4">
        <div className="max-w-sm flex-1">
          <SearchInput
            name="search"
            id="search"
            placeholder={navT("search")}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-md border-0 bg-white py-1.5 px-8 sm:text-sm sm:leading-6 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-700"
          />
        </div>
        {isOwner && (
          <InviteMemberDialog organisationId={selectedOrganisationId} />
        )}
      </div>

      <div className="rounded-md border bg-white p-4">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-white">
              <TableHead className="border-b-0 bg-white">
                {teamT("name")}
              </TableHead>
              <TableHead className="border-b-0 bg-white">
                {teamT("email")}
              </TableHead>
              <TableHead className="border-b-0 bg-white">
                {teamT("role")}
              </TableHead>
              <TableHead className="border-b-0 bg-white">
                {teamT("status")}
              </TableHead>
              <TableHead className="border-b-0 bg-white text-right">
                {teamT("settings")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow
                  key={idx}
                  className="border-b border-gray-100 bg-white">
                  <TableCell className="border-0 bg-white py-3">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3">
                    <Skeleton className="h-3 w-[140px]" />
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3">
                    <Skeleton className="h-5 w-[60px]" />
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3">
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell className="border-0 bg-white py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="border-0 bg-white py-6 text-center text-sm text-red-600">
                  {teamT("loadError")}
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="border-0 bg-white py-6 text-center text-sm text-muted-foreground">
                  {teamT("empty")}
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => {
                const fullName =
                  `${member.user.name} ${member.user.surname}`.trim();
                const memberIsOwner = member.role === OrganisationRole.OWNER;
                const isLastOwner = memberIsOwner && ownerCount <= 1;
                return (
                  <TableRow
                    key={member.id}
                    className="border-b border-gray-100 bg-white">
                    <TableCell className="border-0 bg-white py-3">
                      <div className="flex items-center space-x-4">
                        <Avatar className="size-10">
                          <AvatarImage src={member.user.avatarUrl ?? ""} />
                          <AvatarFallback>
                            {member.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{fullName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="border-0 bg-white py-3">
                      <p className="truncate text-sm text-muted-foreground">
                        {member.user.email}
                      </p>
                    </TableCell>
                    <TableCell className="border-0 bg-white py-3">
                      <Badge variant={memberIsOwner ? "indigo" : "gray"}>
                        {memberIsOwner ? teamT("owner") : teamT("member")}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-0 bg-white py-3">
                      <Badge variant={member.user.isActive ? "green" : "yellow"}>
                        {member.user.isActive
                          ? teamT("active")
                          : teamT("pending")}
                      </Badge>
                    </TableCell>
                    <TableCell className="border-0 bg-white py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <ChangeMemberRoleDialog
                          member={member}
                          organisationId={selectedOrganisationId}
                          disabled={!isOwner || isLastOwner}
                        />
                        <RemoveMemberDialog
                          member={member}
                          organisationId={selectedOrganisationId}
                          disabled={!isOwner || isLastOwner}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {hiddenMemberCount > 0 && (
          <p
            className="mt-3 text-xs text-muted-foreground"
            aria-live="polite">
            {teamT("truncationHint", {
              shown: members.length,
              total: meta?.total ?? members.length,
            })}
          </p>
        )}
      </div>
    </>
  );
}
