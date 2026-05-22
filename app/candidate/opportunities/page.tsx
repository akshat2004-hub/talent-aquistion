"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiError, listCandidateOpportunities } from "@/lib/candidateApi";
import type { CandidateOpportunitySummary } from "@/lib/types";

const STORAGE_KEY = "candidate_portal_token";

export default function CandidateOpportunitiesPage() {
  const router = useRouter();
  const [items, setItems] = useState<CandidateOpportunitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      router.replace("/candidate");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await listCandidateOpportunities(token);
      setItems(res.items);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        localStorage.removeItem(STORAGE_KEY);
        router.replace("/candidate?reason=expired");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    router.replace("/candidate");
  }

  if (loading) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your chats</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Open a conversation to view and send messages.
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="shrink-0 text-sm text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:hover:text-zinc-200"
        >
          Sign out
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-100/80 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
          No chats yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const title =
              item.requirement.role_title?.trim() || "Role discussion";
            return (
              <li key={item.conversation_id}>
                <Link
                  href={`/candidate/opportunities/${item.conversation_id}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {`Updated ${new Date(item.updated_at).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
