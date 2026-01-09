'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { useAppStore } from '@/hooks';
import { STATUS_CONFIG, STATUS_ICONS, STATUS_ORDER } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function PipelineChart() {
  const applications = useAppStore((state) => state.applications);
  
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-primary-500" />
        <CardTitle>Application Pipeline</CardTitle>
      </div>
      
      <div className="space-y-3">
        {STATUS_ORDER.map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = STATUS_ICONS[status];
          const count = applications.filter((a) => a.status === status).length;
          const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0;
          
          return (
            <div key={status} className="flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', config.bgColor)}>
                <Icon className={cn('w-4 h-4', config.textColor)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{config.label}</span>
                  <span className="text-sm font-medium text-slate-800">{count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', config.color)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
