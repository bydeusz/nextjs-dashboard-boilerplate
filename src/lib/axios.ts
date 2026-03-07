import Axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth-tokens";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const AXIOS_INSTANCE = Axios.create();

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { access_token?: string };

        if (!data.access_token) {
          return null;
        }

        setAccessToken(data.access_token);
        return data.access_token;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const token = await refreshAccessToken();

    if (!token) {
      clearAccessToken();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return AXIOS_INSTANCE(originalRequest);
  },
);

export const customInstance = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const normalizedHeaders = options?.headers
    ? Object.fromEntries(new Headers(options.headers).entries())
    : undefined;

  const response = await AXIOS_INSTANCE.request({
    url,
    method: options?.method,
    headers: normalizedHeaders,
    data: options?.body,
    signal: options?.signal ?? undefined,
  });

  return {
    data: response.data,
    status: response.status,
    headers: new Headers(response.headers as Record<string, string>),
  } as T;
};
