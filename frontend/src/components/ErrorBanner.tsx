'use client';

import { useAppStore } from '@/hooks';
import { AlertCircle, X } from 'lucide-react';

export function ErrorBanner() {
  const appsError = useAppStore((state) => state.applicationsError);
  const resumesError = useAppStore((state) => state.resumesError);
  const fetchApps = useAppStore((state) => state.fetchApplications);
  const fetchResumes = useAppStore((state) => state.fetchResumes);
  const clearError = useAppStore((state) => state.clearErrors);

  const error = appsError || resumesError;
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-6 rounded">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <p className="text-xs text-red-600 mt-2">
            Make sure the backend server is running on port 8000.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => {
              if (appsError) fetchApps();
              if (resumesError) fetchResumes();
            }}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
