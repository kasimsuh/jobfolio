'use client';

import React from 'react';
import { Header } from '@/components/layout';
import { DashboardView } from '@/components/dashboard';
import { ApplicationsView } from '@/components/applications';
import { ResumesView, CompareView } from '@/components/resumes';
import { useAppStore } from '@/hooks';

export default function Home() {
  const activeView = useAppStore((state) => state.activeView);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'applications' && <ApplicationsView />}
        {activeView === 'resumes' && <ResumesView />}
        {activeView === 'compare' && <CompareView />}
      </main>
    </div>
  );
}
