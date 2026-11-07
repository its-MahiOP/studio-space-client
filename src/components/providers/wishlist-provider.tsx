"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { addWishlist, listWishlist, removeWishlist } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "@/components/ui/toast";

interface WishlistContextValue {
  /** Studio ids the signed-in creator has saved, newest first. */
  savedIds: string[];
  /** False until the initial wishlist fetch settles. */
  ready: boolean;
  isSaved: (studioId: string) => boolean;
  /** Saves/removes a studio, with optimistic state and toast feedback. */
  toggle: (studioId: string, studioTitle: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/**
 * Shared saved-studios state so every heart on every card reads from a single
 * request instead of one fetch per card. Data lives in MongoDB's wishlists
 * collection, keyed by the signed-in account (see the Express API).
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const [savedIds, setSavedIds] = useState<string[]>([]);
  /** Email whose wishlist has been fetched; null while a fetch is pending. */
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Adjusting state during render (React's documented pattern) so switching
  // accounts never briefly shows the previous user's saved ids.
  const [prevEmail, setPrevEmail] = useState(email);
  if (prevEmail !== email) {
    setPrevEmail(email);
    setLoadedFor(null);
    setSavedIds([]);
  }

  useEffect(() => {
    if (!email) return;

    let active = true;
    listWishlist(email)
      .then((items) => {
        if (active) setSavedIds(items.map((item) => item.studioId));
      })
      .catch(() => {
        if (active) setSavedIds([]);
      })
      .finally(() => {
        if (active) setLoadedFor(email);
      });

    return () => {
      active = false;
    };
  }, [email]);

  const ready = !email || loadedFor === email;

  const isSaved = useCallback(
    (studioId: string) => savedIds.includes(studioId),
    [savedIds],
  );

  const toggle = useCallback(
    async (studioId: string, studioTitle: string) => {
      if (!email) {
        toast.add({
          type: "info",
          title: "Sign in to save studios",
          description:
            "Create an account to keep your favourite rooms in one place.",
        });
        return;
      }

      const saved = savedIds.includes(studioId);
      setSavedIds((current) =>
        saved
          ? current.filter((id) => id !== studioId)
          : [...current, studioId],
      );

      try {
        if (saved) {
          await removeWishlist(studioId);
          toast.add({
            type: "success",
            title: "Removed from saved",
            description: `${studioTitle} is no longer on your list.`,
          });
        } else {
          await addWishlist(studioId);
          toast.add({
            type: "success",
            title: "Saved to your list",
            description: `${studioTitle} joined your saved studios.`,
          });
        }
      } catch (cause) {
        // Roll the optimistic change back so the heart never lies.
        setSavedIds((current) =>
          saved
            ? current.includes(studioId)
              ? current
              : [...current, studioId]
            : current.filter((id) => id !== studioId),
        );
        toast.add({
          type: "error",
          title: "Could not update saved studios",
          description:
            cause instanceof Error ? cause.message : "Try again in a moment.",
        });
      }
    },
    [email, savedIds],
  );

  return (
    <WishlistContext.Provider value={{ savedIds, ready, isSaved, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistStore() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlistStore must be used within a WishlistProvider");
  }
  return context;
}
