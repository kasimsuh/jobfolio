'use client';

import React from 'react';
import { FileText, Edit3, Eye, Trash2, Calendar } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { ResumeVersion } from '@/types';
import { formatDate } from '@/lib/utils';

interface ResumeCardProps {
  resume: ResumeVersion;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ResumeCard({ resume, onView, onEdit, onDelete }: ResumeCardProps) {
  const lineCount = resume.content.split('\n').length;
  
  return (
    <Card hover className="animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 className="font-display font-semibold">{resume.name}</h3>
            <p className="text-xs text-slate-400">{resume.id}</p>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{resume.description}</p>
      
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(resume.createdAt)}</span>
        </div>
        <span>{lineCount} lines</span>
      </div>
      
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onView} className="flex-1">
          <Eye className="w-4 h-4" />
          View
        </Button>
        <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">
          <Edit3 className="w-4 h-4" />
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
