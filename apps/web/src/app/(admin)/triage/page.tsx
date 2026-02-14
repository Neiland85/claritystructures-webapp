import React from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import TriageTable from "@/components/TriageTable";

export const metadata = {
  title: "Triage Dashboard | Clarity Structures",
  description: "Internal intake triage and decision management system.",
};

export default function TriagePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="scale-75 origin-left">
            <AnimatedLogo />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl">
              Operational <span className="text-blue-500">Triage</span>
            </h1>
            <p className="mt-2 text-lg text-slate-400">
              Manage incoming forensic intakes and assess priority signals.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">
              System Status
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-white">
                Live Monitoring
              </span>
            </div>
          </div>
        </div>
      </div>

      <TriageTable />
    </main>
  );
}
