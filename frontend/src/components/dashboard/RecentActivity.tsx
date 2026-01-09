'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardTitle, StatusBadge } from '@/components/ui';
import { useAppStore } from '@/hooks';
import { STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function RecentActivity() {
  const applications = useAppStore((state) => state.applications);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const setSelectedApplication = useAppStore((state) => state.setSelectedApplication);
  
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  const handleClick = (id: string) => {
    setSelectedApplication(id);
    setActiveView('applications');
  };
  
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary-500" />
        <CardTitle>Recent Activity</CardTitle>
      </div>
      
      <div className="space-y-3">
        {recentApps.map((app) => {
          const config = STATUS_CONFIG[app.status];
          
          return (
            <div
              key={app.id}
              onClick={() => handleClick(app.id)}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all"
            >
              <div className={cn('w-2 h-2 rounded-full', config.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{app.company}</p>
                <p className="text-xs text-slate-500 truncate">{app.position}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          );
        })}
        
        {recentApps.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            No applications yet
          </p>
        )}
      </div>
    </Card>
  );
}
