"use client";

import React, { useState } from "react";
import TriageTable from "@/components/TriageTable";

/**
 * TriageGate — client-side authentication gate.
 * Prompts for a bearer token before rendering the TriageTable.
 * The token is held in memory only (never persisted to storage).
 */
export default function TriageGate() {
  const [token, setToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const hasToken = token.trim().length > 0;

  if (submitted && hasToken) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setToken("");
              setSubmitted(false);
            }}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            Lock Dashboard
          </button>
        </div>
        <TriageTable token={token} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-3 py-20 sm:py-24">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.18)]">
            <svg
              className="h-7 w-7 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-300/70">
            Restricted console
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Authentication Required
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            Enter the admin access token to view the triage dashboard.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            if (hasToken) {
              setSubmitted(true);
            }
          }}
        >
          <label className="block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Admin access token
            </span>

            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.currentTarget.value)}
              placeholder="Paste access token"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/30"
              autoFocus
              autoComplete="off"
            />
          </label>

          <p
            aria-live="polite"
            className={`text-xs ${
              hasToken ? "text-emerald-300/80" : "text-slate-500"
            }`}
          >
            {hasToken
              ? "Token detected — ready to unlock."
              : "Paste a non-empty admin token to enable access."}
          </p>

          <button
            type="submit"
            disabled={!hasToken}
            className={`w-full rounded-2xl py-3.5 text-sm font-bold transition-all duration-200 ${
              hasToken
                ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.16)] hover:bg-neutral-200"
                : "cursor-not-allowed border border-white/10 bg-white/[0.04] text-slate-600"
            }`}
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
