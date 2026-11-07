import type {
  Booking,
  BookingInput,
  BookingStatus,
  Studio,
  StudioInput,
} from "@/types/studio";

/**
 * All API traffic goes through the same-origin `/api/backend` proxy (see
 * src/app/api/backend/[...path]/route.ts), which forwards requests to the
 * Express data API using the server-side `SERVER_BASE_URL` env var. Keeping
 * the browser on one origin means the HTTPOnly JWT cookie is always sent,
 * even when both apps live on different deployment domains.
 */
export const API_BASE_URL = "/api/backend";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = RequestInit & { signal?: AbortSignal };

/**
 * Re-issues the HTTPOnly API JWT cookie. Called once after a 401 so a stale
 * token never blocks a request the user is clearly allowed to make.
 */
async function refreshApiToken() {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/auth-token", { credentials: "same-origin" });
  } catch {
    // The retry below surfaces the real error if the refresh fails.
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  allowRetry = true,
): Promise<T> {
  const { headers, body, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      cache: "no-store",
      // Attach the HTTPOnly JWT cookie so server-side mutations can authorize
      // the caller (Challenge 1). The request stays same-origin and the proxy
      // forwards the Cookie header to the data API server-side.
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(
      `Could not reach the StudioSpace API at ${API_BASE_URL}. Is the server running?`,
      0,
    );
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (response.status === 401 && allowRetry) {
    // The API cookie may be missing or expired — mint a fresh one, retry once.
    await refreshApiToken();
    return request<T>(path, options, false);
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message)
        : `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStudio(raw: Partial<Studio> & { _id: string }): Studio {
  return {
    ...raw,
    _id: String(raw._id),
    title: raw.title ?? "Untitled studio",
    category: raw.category ?? "Workshop",
    hourlyRate: toNumber(raw.hourlyRate),
    securityDeposit: toNumber(raw.securityDeposit),
    maxCapacity: toNumber(raw.maxCapacity),
    location: raw.location ?? "",
    imageUrl: raw.imageUrl ?? "",
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    overview: raw.overview ?? "",
    ownerEmail: raw.ownerEmail ?? "",
    ownerName: raw.ownerName ?? "",
    rating: toNumber(raw.rating),
  };
}

function normalizeBooking(raw: Partial<Booking> & { _id: string }): Booking {
  return {
    ...raw,
    _id: String(raw._id),
    studioId: String(raw.studioId ?? ""),
    studioTitle: raw.studioTitle ?? "Studio",
    imageUrl: raw.imageUrl ?? "",
    userEmail: raw.userEmail ?? "",
    userName: raw.userName ?? "",
    hostEmail: raw.hostEmail ?? "",
    bookingDate: raw.bookingDate ?? "",
    totalPrice: toNumber(raw.totalPrice),
    status: (raw.status ?? "Pending") as BookingStatus,
  };
}

export async function listStudios(
  params: { ownerEmail?: string; category?: string } = {},
  signal?: AbortSignal,
): Promise<Studio[]> {
  const query = new URLSearchParams();
  if (params.ownerEmail) query.set("ownerEmail", params.ownerEmail);
  if (params.category) query.set("category", params.category);
  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : "";
  const data = await request<Studio[]>(`/studios${suffix}`, { signal });
  return Array.isArray(data) ? data.map(normalizeStudio) : [];
}

export async function getStudio(
  id: string,
  signal?: AbortSignal,
): Promise<Studio> {
  const data = await request<Studio>(`/studios/${encodeURIComponent(id)}`, {
    signal,
  });
  return normalizeStudio(data);
}

export async function createStudio(input: StudioInput) {
  return request<{ success: boolean; insertedId: string }>("/studios", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateStudio(id: string, input: StudioInput) {
  return request<{ success: boolean; modifiedCount: number }>(
    `/studios/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(input) },
  );
}

export async function deleteStudio(id: string) {
  return request<{ success: boolean; deletedCount: number }>(
    `/studios/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}

export async function createBooking(input: BookingInput) {
  return request<{ success: boolean; insertedId: string }>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listBookings(
  email: string,
  signal?: AbortSignal,
): Promise<Booking[]> {
  const data = await request<Booking[]>(
    `/bookings?email=${encodeURIComponent(email)}`,
    { signal },
  );
  return Array.isArray(data) ? data.map(normalizeBooking) : [];
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return request<{ success: boolean; modifiedCount: number }>(
    `/bookings/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
}

/**
 * Uploads an image to ImgBB and returns the hosted URL.
 * Requires NEXT_PUBLIC_IMGBB_API_KEY in .env.local.
 */
export async function uploadImageToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim();

  if (!key) {
    throw new Error(
      "Image uploads need NEXT_PUBLIC_IMGBB_API_KEY in your .env file. Add the key, rebuild, or paste an image URL instead.",
    );
  }

  const body = new FormData();
  body.append("image", file);
  body.append("name", file.name.replace(/\.[^.]+$/, ""));

  let response: Response;
  try {
    response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
      { method: "POST", body },
    );
  } catch {
    throw new Error("Could not reach ImgBB. Check your connection and try again.");
  }

  const data = (await response.json().catch(() => null)) as
    | {
        success?: boolean;
        error?: { message?: string };
        data?: { display_url?: string; url?: string };
      }
    | null;

  if (!response.ok || !data?.success || !data.data) {
    throw new Error(
      data?.error?.message ??
        "ImgBB rejected the upload. Check that the key is valid and the file is under 32 MB.",
    );
  }

  return data.data.display_url ?? data.data.url ?? "";
}
