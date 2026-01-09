'use client';

import React from 'react';
import { Target, TrendingUp, Clock, Award } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { PipelineChart } from './PipelineChart';
import { RecentActivity } from './RecentActivity';
import { ResumeQuickAccess } from './ResumeQuickAccess';
import { useAnalytics } from '@/hooks';

export function DashboardView() {
  const analytics = useAnalytics();
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Applications"
          value={analytics.total}
          icon={Target}
          color="primary"
        />
        <StatsCard
          label="Interview Rate"
          value={`${analytics.interviewRate}%`}
          icon={TrendingUp}
          color="amber"
        />
        <StatsCard
          label="Pending Response"
          value={analytics.pending}
          icon={Clock}
          color="blue"
        />
        <StatsCard
          label="Offers Received"
          value={analytics.offers}
          icon={Award}
          color="emerald"
        />
      </div>
      
      {/* Pipeline + Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <PipelineChart />
        <RecentActivity />
      </div>
      
      {/* Resume Quick Access */}
      <ResumeQuickAccess />
    </div>
  );
}
