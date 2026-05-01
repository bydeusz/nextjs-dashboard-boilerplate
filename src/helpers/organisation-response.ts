import type { OrganisationResponseDto } from "@/generated/api/model/organisationResponseDto";

/** Unwraps list payload from `organisationList` / `useOrganisationList` (customInstance + API envelope). */
export function extractOrganisationListFromResponse(
  payload: unknown,
): OrganisationResponseDto[] {
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
    return envelope.data as OrganisationResponseDto[];
  }
  return [];
}

/** Unwraps single org from `organisationGet` / `useOrganisationGet`. */
export function extractOrganisationFromResponse(
  payload: unknown,
): OrganisationResponseDto | null {
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
    "name" in data
  ) {
    return data as OrganisationResponseDto;
  }
  return null;
}
