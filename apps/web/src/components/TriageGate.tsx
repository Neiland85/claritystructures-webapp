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

  if (submitted && token) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setToken("");
              setSubmitted(false);
            }}
            className="text-xs text-slate-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Lock Dashboard
          </button>
        </div>
        <TriageTable token={token} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-full max-w-md p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            Authentication Required
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Enter the admin access token to view the triage dashboard.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) {
              setSubmitted(true);
            }
          }}
        >
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Access token"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all mb-4"
            autoFocus
          />
          <button
            type="submit"
            disabled={!token.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
