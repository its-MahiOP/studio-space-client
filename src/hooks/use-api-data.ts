"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getStudio,
  listBookings,
  listReviews,
  listStudios,
  listWishlist,
} from "@/lib/api";
import type { Booking, Review, Studio, WishlistItem } from "@/types/studio";

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong while loading data.";
}

interface AsyncDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Small client-side fetch helper. Requests run after mount and again whenever
 * `reload()` is called, which keeps the static shell prerenderable.
 *
 * Pass an `initialData` value (for example `[]`) when the UI can render a safe
 * placeholder before the request resolves; the result is then non-nullable.
 */
export function useAsyncData<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  initialData: T,
): AsyncDataResult<T>;
export function useAsyncData<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
): AsyncDataResult<T | null>;
export function useAsyncData<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  initialData?: T,
): AsyncDataResult<T | null> {
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const depKey = JSON.stringify(deps);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    loader(controller.signal)
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(errorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
    // The loader reads the values represented by depKey; adding it would
    // refetch on every render because the function is re-created inline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey, version]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setVersion((current) => current + 1);
  }, []);

  return { data, loading, error, reload };
}

export function useStudios(
  params: {
    ownerEmail?: string;
    category?: string;
    search?: string;
    limit?: number;
    sort?: string;
  } = {},
) {
  const ownerEmail = params.ownerEmail ?? "";
  const category = params.category ?? "";
  const search = params.search ?? "";
  const limit = params.limit ?? 0;
  const sort = params.sort ?? "";

  return useAsyncData<Studio[]>(
    (signal) => listStudios({ ownerEmail, category, search, limit, sort }, signal),
    [ownerEmail, category, search, limit, sort],
    [],
  );
}

export function useStudio(id: string) {
  return useAsyncData<Studio>(
    (signal) => getStudio(id, signal),
    [id],
  );
}

export function useBookings(email: string) {
  return useAsyncData<Booking[]>(
    (signal) => listBookings(email, signal),
    [email],
    [],
  );
}

export function useReviews(studioId: string) {
  return useAsyncData<Review[]>(
    (signal) => listReviews(studioId, signal),
    [studioId],
    [],
  );
}

export function useWishlist(email: string) {
  return useAsyncData<WishlistItem[]>(
    (signal) => listWishlist(email, signal),
    [email],
    [],
  );
}
