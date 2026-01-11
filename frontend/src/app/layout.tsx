"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import { NavBar } from "../components/layout/NavBar";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useAppStore, useAuthStore } from "@/hooks";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const fetchApplications = useAppStore((state) => state.fetchApplications);
  const fetchResumes = useAppStore((state) => state.fetchResumes);
  const isLoadingApps = useAppStore((state) => state.isLoadingApplications);
  const isLoadingResumes = useAppStore((state) => state.isLoadingResumes);

  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    checkAuth,
  } = useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
      fetchResumes();
    }
  }, [isAuthenticated, fetchApplications, fetchResumes]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (
      !isAuthLoading &&
      !isAuthenticated &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, pathname, router]);

  // Show loading spinner while checking auth or loading data
  if (
    isAuthLoading ||
    (isAuthenticated &&
      pathname !== "/login" &&
      (isLoadingApps || isLoadingResumes))
  ) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated && pathname !== "/login" && pathname !== "/register") {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-gray-600">Redirecting to login...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="">
        {isAuthenticated && pathname !== "/login" && <NavBar />}
        {isAuthenticated && <ErrorBanner />}
        <main
          className={
            isAuthenticated && pathname !== "/login" ? "px-6 py-6" : ""
          }
        >
          {children}
        </main>
      </body>
    </html>
  );
}
