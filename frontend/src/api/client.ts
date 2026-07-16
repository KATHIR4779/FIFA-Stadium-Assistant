// ============================================================================
// API Client
// Typed HTTP client for backend communication with error handling
// ============================================================================

import type { ChatRequest, ChatResponse, VenueSummary, ApiErrorResponse } from "../types";

/** Base URL for API calls — in dev, Vite proxy handles this. In prod, VITE_API_URL is used. */
const API_BASE = (import.meta as any).env.VITE_API_URL || "/api";

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 35000;

/**
 * Custom error class for API failures with structured error data.
 */
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Make a fetch request with timeout and structured error handling.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "Request timed out. Please try again.",
        "TIMEOUT",
        408
      );
    }
    throw new ApiError(
      "Unable to reach the server. Please check your connection.",
      "NETWORK_ERROR",
      0
    );
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Send a chat message to the backend.
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetchWithTimeout(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = data as ApiErrorResponse;
    throw new ApiError(
      err.error || "An error occurred",
      err.code || "UNKNOWN",
      response.status
    );
  }

  return data as ChatResponse;
}

/**
 * Fetch the list of venues from the backend.
 */
export async function fetchVenues(): Promise<VenueSummary[]> {
  const response = await fetchWithTimeout(`${API_BASE}/venues`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError("Failed to load venues", "VENUES_ERROR", response.status);
  }

  return data.venues as VenueSummary[];
}

/**
 * Check backend health.
 */
export async function checkHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  const response = await fetchWithTimeout(`${API_BASE}/health`, {
    method: "GET",
  });

  return response.json();
}
