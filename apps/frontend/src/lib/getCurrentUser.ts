import { cache } from "react";
import { cookies } from "next/headers";
import { ApiError, apiClient } from "@/lib/api/client";
import type { AppUser } from "@/features/user/types";

export const getCurrentUser = cache(async function getCurrentUser() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (!cookieHeader) return null;

  try {
    const { user } = await apiClient.get<{ user: AppUser | null }>("/auth/me", {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
      // Never let a slow/hung backend stall SSR of any page (including
      // not-found); a timed-out session just renders as anonymous.
      signal: AbortSignal.timeout(5000),
    })

    return user ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }

    return null;
  }
})
