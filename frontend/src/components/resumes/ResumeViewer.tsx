'use client';

import React from 'react';
import { ArrowLeft, Edit3, Copy, Download, FileText } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { ResumeVersion } from '@/types';
import { parseMarkdown, formatDate } from '@/lib/utils';

interface ResumeViewerProps {
  resume: ResumeVersion;
  onBack: () => void;
  onEdit: () => void;
}

export function ResumeViewer({ resume, onBack, onEdit }: ResumeViewerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(resume.content);
    alert('Resume content copied to clipboard!');
  };
  
  const handleDownload = () => {
    const blob = new Blob([resume.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.name.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{resume.name}</h2>
              <p className="text-slate-500 text-sm">{resume.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="info">{resume.id}</Badge>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Edit3 className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>
      
      {/* Metadata */}
      <div className="flex items-center gap-6 text-sm text-slate-400">
        <span>Created: {formatDate(resume.createdAt)}</span>
        <span>Updated: {formatDate(resume.updatedAt)}</span>
        <span>{resume.content.split('\n').length} lines</span>
      </div>
      
      {/* Content */}
      <Card>
        <div
          className="prose  prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(resume.content) }}
        />
      </Card>
    </div>
  );
}
