import type { OrganisationMemberResponseDto } from "@/generated/api/model/organisationMemberResponseDto";
import type { PaginationMetaDto } from "@/generated/api/model/paginationMetaDto";

/** Unwraps pagination meta from a paginated `organisationMemberGetList` response. */
export function extractMemberListMetaFromResponse(
  payload: unknown,
): PaginationMetaDto | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const outer = payload as { data?: unknown };
  const body = outer.data;
  if (!body || typeof body !== "object") {
    return null;
  }
  const envelope = body as { meta?: unknown };
  const meta = envelope.meta;
  if (
    meta &&
    typeof meta === "object" &&
    "total" in meta &&
    typeof (meta as { total: unknown }).total === "number"
  ) {
    return meta as PaginationMetaDto;
  }
  return null;
}

/** Unwraps list payload from `organisationMemberList` / `useOrganisationMemberList`. */
export function extractMemberListFromResponse(
  payload: unknown,
): OrganisationMemberResponseDto[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const outer = payload as { data?: unknown };
  const body = outer.data;
  if (!body || typeof body !== "object") {
    return [];
  }
  const envelope = body as { data?: unknown };
  if (Array.isArray(envelope.data)) {
    return envelope.data as OrganisationMemberResponseDto[];
  }
  return [];
}

/** Unwraps single member from invite/update/remove responses. */
export function extractMemberFromResponse(
  payload: unknown,
): OrganisationMemberResponseDto | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const outer = payload as { data?: unknown };
  const body = outer.data;
  if (!body || typeof body !== "object") {
    return null;
  }
  const envelope = body as { data?: unknown };
  const data = envelope.data;
  if (
    data &&
    typeof data === "object" &&
    "id" in data &&
    "userId" in data &&
    "role" in data
  ) {
    return data as OrganisationMemberResponseDto;
  }
  return null;
}
