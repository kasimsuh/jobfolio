'use client';

import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { useAppStore } from '@/hooks';

export function ResumeQuickAccess() {
  const resumeVersions = useAppStore((state) => state.resumeVersions);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const setEditingResume = useAppStore((state) => state.setEditingResume);
  
  const handleResumeClick = (id: string) => {
    setEditingResume(id);
    setActiveView('resumes');
  };
  
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-500" />
          <CardTitle>Resume Versions</CardTitle>
        </div>
        <button
          onClick={() => setActiveView('resumes')}
          className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors font-medium"
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid sm:grid-cols-3 gap-4">
        {resumeVersions.slice(0, 3).map((version) => (
          <div
            key={version.id}
            onClick={() => handleResumeClick(version.id)}
            className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all border border-slate-100 hover:border-primary-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary-500" />
              <span className="font-medium text-sm text-slate-800">{version.name}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{version.description}</p>
            <p className="text-xs text-slate-400 mt-2">{version.createdAt}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
