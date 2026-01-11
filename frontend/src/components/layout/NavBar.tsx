"use client";
import React from "react";
import {
  Briefcase,
  BarChart3,
  FileText,
  GitCompare,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/hooks";

const navItems = [
  { path: "/", icon: BarChart3, label: "Dashboard" },
  { path: "/applications", icon: Briefcase, label: "Applications" },
  { path: "/resumes", icon: FileText, label: "Resumes" },
  { path: "/compare", icon: GitCompare, label: "Compare" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
                JobFolio
              </h1>
              <p className="text-xs text-slate-500">
                Application Tracker + Resume Versioning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = pathname === path;

                return (
                  <Link key={path} href={path}>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              {user && (
                <span className="text-sm text-slate-600 hidden md:inline">
                  {user.name}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
