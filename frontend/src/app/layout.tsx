'use client';

import { useEffect } from 'react';
import "./globals.css";
import { NavBar } from "../components/layout/NavBar";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useAppStore } from "@/hooks";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchApplications = useAppStore((state) => state.fetchApplications);
  const fetchResumes = useAppStore((state) => state.fetchResumes);
  const isLoadingApps = useAppStore((state) => state.isLoadingApplications);
  const isLoadingResumes = useAppStore((state) => state.isLoadingResumes);

  useEffect(() => {
    fetchApplications();
    fetchResumes();
  }, [fetchApplications, fetchResumes]);

  if (isLoadingApps || isLoadingResumes) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="">
        <NavBar />
        <ErrorBanner />
        <main className="px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
