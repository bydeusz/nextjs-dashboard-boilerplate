"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { clearAccessToken, setAccessToken } from "@/lib/auth-tokens";
import { useAuthMeGet } from "@/generated/api/endpoints";

type AuthUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  organisationIds: string[];
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as AuthUser).id === "string";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refetch: refetchMe } = useAuthMeGet({
    query: {
      enabled: false,
      retry: false,
    },
  });

  const syncCurrentUser = useCallback(async () => {
    const result = await refetchMe();
    const payload = result.data?.data;
    const nestedPayload =
      payload && typeof payload === "object" && "data" in payload
        ? (payload as { data?: unknown }).data
        : null;
    const me = isAuthUser(payload)
      ? payload
      : isAuthUser(nestedPayload)
        ? nestedPayload
        : null;

    if (!me) {
      throw new Error("Failed to fetch current user");
    }

    setUser(me);
  }, [refetchMe]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        clearAccessToken();
        setUser(null);
        return false;
      }

      const data = (await response.json()) as { access_token?: string };

      if (!data.access_token) {
        clearAccessToken();
        setUser(null);
        return false;
      }

      setAccessToken(data.access_token);
      await syncCurrentUser();
      return true;
    } catch {
      clearAccessToken();
      setUser(null);
      return false;
    }
  }, [syncCurrentUser]);

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      throw new Error(data.message ?? "Login failed");
    }

    const data = (await response.json()) as { access_token?: string };

    if (!data.access_token) {
      throw new Error("Missing access token");
    }

    setAccessToken(data.access_token);
    await syncCurrentUser();
  }, [syncCurrentUser]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      clearAccessToken();
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      setIsLoading(true);
      await refreshSession();
      if (active) {
        setIsLoading(false);
      }
    };

    void initialize();

    return () => {
      active = false;
    };
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [isLoading, login, logout, refreshSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
