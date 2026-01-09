"use client";

import React from "react";
import { Briefcase, BarChart3, FileText, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/hooks";
import { ViewType } from "@/types";

const navItems: { id: ViewType; icon: typeof BarChart3; label: string }[] = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard" },
  { id: "applications", icon: Briefcase, label: "Applications" },
  { id: "resumes", icon: FileText, label: "Resumes" },
  { id: "compare", icon: GitCompare, label: "Compare" },
];

export function Header() {
  const activeView = useAppStore((state) => state.activeView);
  const setActiveView = useAppStore((state) => state.setActiveView);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-slate-800">
                Co-op Application Tracker
              </h1>
              <p className="text-xs text-slate-500">
                Application Tracker + Resume Versioning
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeView === id
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
