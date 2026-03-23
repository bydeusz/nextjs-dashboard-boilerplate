"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/providers/AuthProvider";

const STORAGE_KEY = "selectedOrganisationId";

type OrganisationContextValue = {
  selectedOrganisationId: string | null;
  setSelectedOrganisationId: (id: string | null) => void;
};

const OrganisationContext = createContext<OrganisationContextValue | null>(null);

function readStoredId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

function writeStoredId(id: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (id === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  } catch {
    // ignore quota / private mode
  }
}

export function OrganisationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedOrganisationId, setSelectedOrganisationIdState] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!user) {
      setSelectedOrganisationIdState(null);
      writeStoredId(null);
      return;
    }

    const stored = readStoredId();
    if (stored && !user.organisationIds.includes(stored)) {
      writeStoredId(null);
    }
    if (stored && user.organisationIds.includes(stored)) {
      setSelectedOrganisationIdState(stored);
      return;
    }

    setSelectedOrganisationIdState(null);
  }, [user]);

  const setSelectedOrganisationId = useCallback((id: string | null) => {
    setSelectedOrganisationIdState(id);
    writeStoredId(id);
  }, []);

  const value = useMemo<OrganisationContextValue>(
    () => ({
      selectedOrganisationId,
      setSelectedOrganisationId,
    }),
    [selectedOrganisationId, setSelectedOrganisationId],
  );

  return (
    <OrganisationContext.Provider value={value}>
      {children}
    </OrganisationContext.Provider>
  );
}

export function useOrganisation() {
  const context = useContext(OrganisationContext);

  if (!context) {
    throw new Error("useOrganisation must be used within OrganisationProvider");
  }

  return context;
}
