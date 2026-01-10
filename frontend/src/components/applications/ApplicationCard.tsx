'use client';

import React from 'react';
import { Building2, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { Application } from '@/types';
import { STATUS_CONFIG } from '@/lib/constants';
import { formatDate, getDeadlineStatus } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
  onClick: () => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const config = STATUS_CONFIG[application.status];
  const deadlineStatus = getDeadlineStatus(application.deadline);
  
  return (
    <Card hover onClick={onClick} className="animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <h4 className="font-medium text-sm">{application.company}</h4>
        </div>
        {application.resumeVersion && (
          <Badge variant="info">{application.resumeVersion.name}</Badge>
        )}
      </div>
      
      <p className="text-xs text-slate-500 mb-3">{application.position}</p>
      
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="w-3 h-3" />
          <span>{application.location}</span>
        </div>
        
        {application.salary && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <DollarSign className="w-3 h-3" />
            <span>{application.salary}</span>
          </div>
        )}
        
        {application.deadline && (
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span
              className={cn(
                deadlineStatus === 'overdue' && 'text-red-400',
                deadlineStatus === 'urgent' && 'text-amber-400',
                deadlineStatus === 'upcoming' && 'text-blue-400',
                deadlineStatus === 'safe' && 'text-slate-400'
              )}
            >
              {formatDate(application.deadline)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
