'use client';

import React from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  Edit3,
  Trash2,
  Clock,
} from 'lucide-react';
import { Button, Card, StatusBadge, Badge } from '@/components/ui';
import { Application } from '@/types';
import { formatDate, getRelativeTime } from '@/lib/utils';

interface ApplicationDetailProps {
  application: Application;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ApplicationDetail({
  application,
  onBack,
  onEdit,
  onDelete,
}: ApplicationDetailProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-bold">{application.company}</h2>
            <p className="text-slate-500">{application.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={application.status} />
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Edit3 className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Info */}
        <Card>
          <h3 className="font-semibold mb-4">Application Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-sm">{application.location || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Salary</p>
                <p className="text-sm">{application.salary || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Deadline</p>
                <p className="text-sm">{formatDate(application.deadline)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Source</p>
                <p className="text-sm">{application.source || 'Not specified'}</p>
              </div>
            </div>
            
            {application.url && (
              <a
                href={application.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-500 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Job Posting
              </a>
            )}
          </div>
        </Card>
        
        {/* Timeline & Resume */}
        <Card>
          <h3 className="font-semibold mb-4">Timeline & Resume</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Applied Date</p>
                <p className="text-sm">
                  {application.appliedDate
                    ? formatDate(application.appliedDate)
                    : 'Not yet applied'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Resume Version</p>
                {application.resumeVersion ? (
                  <Badge variant="info">{application.resumeVersion}</Badge>
                ) : (
                  <p className="text-sm text-slate-400">None selected</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Last Updated</p>
                <p className="text-sm">{getRelativeTime(application.updatedAt)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Notes */}
      <Card>
        <h3 className="font-semibold mb-4">Notes</h3>
        <div className="prose prose-invert prose-sm max-w-none">
          {application.notes ? (
            <p className="text-slate-600 whitespace-pre-wrap">{application.notes}</p>
          ) : (
            <p className="text-slate-400 italic">No notes added</p>
          )}
        </div>
      </Card>
    </div>
  );
}
