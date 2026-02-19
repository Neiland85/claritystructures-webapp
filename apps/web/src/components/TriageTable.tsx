"use client";

import React, { useState, useEffect } from "react";
import type { IntakeRecord, IntakeStatus } from "@claritystructures/domain";
import { getCsrfToken } from "@/lib/csrf/get-csrf-token";

const STATUS_COLORS: Record<IntakeStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  accepted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  rejected: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-slate-400",
  medium: "text-blue-400 font-medium",
  high: "text-amber-400 font-semibold",
  critical: "text-red-500 font-bold animate-pulse",
};

interface TriageTableProps {
  /** Bearer token for authenticated API calls */
  token: string;
}

export default function TriageTable({ token }: TriageTableProps) {
  const [intakes, setIntakes] = useState<IntakeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntake, setSelectedIntake] = useState<IntakeRecord | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  /** Build headers with bearer auth + optional CSRF token */
  const authHeaders = (
    extra: Record<string, string> = {},
  ): Record<string, string> => {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      ...extra,
    };
    const csrf = getCsrfToken();
    if (csrf) {
      headers["x-csrf-token"] = csrf;
    }
    return headers;
  };

  useEffect(() => {
    fetchIntakes();
  }, []);

  const filteredIntakes = intakes.filter((i) => {
    const query = searchQuery.toLowerCase();
    return (
      (i.name?.toLowerCase() || "").includes(query) ||
      i.email.toLowerCase().includes(query) ||
      i.message.toLowerCase().includes(query)
    );
  });

  const fetchIntakes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/triage", {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        setError("Unauthorized — invalid token");
        return;
      }
      const data = await res.json();
      if (data.intakes) {
        setIntakes(data.intakes);
      } else {
        setError(data.error || "Failed to load");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: IntakeStatus) => {
    try {
      const res = await fetch("/api/triage", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
        headers: authHeaders({ "Content-Type": "application/json" }),
      });
      if (res.ok) {
        setIntakes((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i)),
        );
        if (selectedIntake?.id === id) {
          setSelectedIntake({ ...selectedIntake, status });
        }
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            aria-label="Buscar intakes por nombre, email o mensaje"
            placeholder="Search by name, email or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <div aria-live="polite" className="text-xs text-slate-500 font-medium">
          Showing {filteredIntakes.length} of {intakes.length} intakes
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2 overflow-hidden bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300 hover:border-white/20 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredIntakes.map((intake) => (
                <tr
                  key={intake.id}
                  onClick={() => setSelectedIntake(intake)}
                  className={`group cursor-pointer transition-colors hover:bg-white/5 ${
                    selectedIntake?.id === intake.id ? "bg-white/10" : ""
                  } ${
                    intake.priority === "critical"
                      ? "border-l-2 border-red-500/50"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(intake.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">
                      {intake.name || "Anonymous"}
                    </div>
                    <div className="text-xs text-slate-500">{intake.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${
                        PRIORITY_COLORS[intake.priority] || "text-slate-300"
                      }`}
                    >
                      {intake.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded-full border ${STATUS_COLORS[intake.status]}`}
                    >
                      {intake.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredIntakes.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              {intakes.length === 0
                ? "No intake records found."
                : "No matching records found."}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedIntake ? (
            <div className="sticky top-6 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Intake Detail
                  </h3>
                  <div className="text-xs text-slate-500 font-mono tracking-tighter">
                    {selectedIntake.id}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIntake(null)}
                  aria-label="Cerrar panel de detalle"
                  className="p-1 text-slate-500 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                    Message
                  </label>
                  <div className="p-3 bg-white/5 rounded-lg text-sm text-slate-300 italic">
                    &quot;{selectedIntake.message}&quot;
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                      Tone
                    </label>
                    <div className="text-sm text-slate-300 capitalize">
                      {selectedIntake.tone}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                      Route
                    </label>
                    <div className="text-sm text-slate-300 capitalize">
                      {selectedIntake.route}
                    </div>
                  </div>
                </div>

                {selectedIntake.meta && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                      Decision Metadata
                    </label>
                    <div className="text-[10px] font-mono p-3 bg-black/40 rounded-lg text-emerald-400 overflow-x-auto max-h-48">
                      {JSON.stringify(selectedIntake.meta, null, 2)}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-3 block">
                    Update Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["pending", "accepted", "rejected"] as IntakeStatus[]
                    ).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedIntake.id, s)}
                        disabled={selectedIntake.status === s}
                        aria-pressed={selectedIntake.status === s}
                        aria-label={`Cambiar estado a ${s}`}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedIntake.status === s
                            ? STATUS_COLORS[s] +
                              " opacity-100 ring-2 ring-white/10"
                            : "bg-transparent border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-6 h-64 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-600">
              <svg
                className="w-12 h-12 mb-3 opacity-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <div className="text-sm">Select an intake to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
