import { createClient } from "@/lib/supabase/client";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (typeof payload !== "object" || payload === null) return fallback;

  const body = payload as {
    error?: unknown;
    message?: unknown;
    details?: unknown;
  };
  for (const value of [body.error, body.message, body.details]) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

function getApiUrl(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl || /^https?:\/\//i.test(endpoint)) return endpoint;
  return new URL(
    endpoint,
    baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
  ).toString();
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  mockResponse?: T,
): Promise<ApiResponse<T>> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    if (mockResponse === undefined) {
      return {
        data: null,
        error: "Mock API mode is enabled, but no mock response was provided.",
        status: 501,
      };
    }
    return { data: mockResponse, error: null, status: 200 };
  }

  const headers = new Headers(options.headers);
  if (
    options.body &&
    !(typeof FormData !== "undefined" && options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const {
      data: { session },
      error: sessionError,
    } = await createClient().auth.getSession();

    if (sessionError) {
      return {
        data: null,
        error: "Unable to restore your session. Please log in again.",
        status: 401,
      };
    }

    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }

    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers,
    });

    const text = await response.text();
    let payload: unknown = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      return {
        data: null,
        error: getErrorMessage(
          payload,
          `Request failed with status ${response.status}.`,
        ),
        status: response.status,
      };
    }

    return {
      data: payload as T | null,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while contacting the API.",
      status: 0,
    };
  }
}
