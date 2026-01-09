'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Edit3 } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { ResumeVersion, ResumeFormData } from '@/types';
import { parseMarkdown } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ResumeEditorProps {
  resume?: ResumeVersion;
  isNew?: boolean;
  onSave: (data: ResumeFormData) => void;
  onCancel: () => void;
}

export function ResumeEditor({ resume, isNew, onSave, onCancel }: ResumeEditorProps) {
  const [formData, setFormData] = useState<ResumeFormData>({
    name: '',
    description: '',
    content: '',
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  useEffect(() => {
    if (resume) {
      setFormData({
        name: resume.name,
        description: resume.description,
        content: resume.content,
      });
    }
  }, [resume]);
  
  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name for this resume version');
      return;
    }
    onSave(formData);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Version Name (e.g., Tech-Focused)"
            className="bg-transparent text-xl font-display font-bold border-none px-0 focus:ring-0"
          />
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description (e.g., Emphasizes technical skills)"
            className="bg-transparent text-sm text-slate-400 border-none px-0 focus:ring-0 mt-1"
          />
        </div>
        <Button onClick={handleSubmit}>
          <Save className="w-4 h-4" />
          {isNew ? 'Create Version' : 'Save Changes'}
        </Button>
      </div>
      
      {/* Editor/Preview Toggle */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('edit')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors',
            activeTab === 'edit'
              ? 'bg-primary-100 text-primary-500'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          )}
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors',
            activeTab === 'preview'
              ? 'bg-primary-100 text-primary-500'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          )}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>
      
      {/* Content Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Markdown Editor */}
        <Card className={cn(activeTab === 'preview' && 'lg:block hidden')}>
          <div className="flex items-center gap-2 mb-4">
            <Edit3 className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">Markdown Editor</span>
          </div>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder={`# Your Name
email@example.com | (555) 123-4567 | linkedin.com/in/yourname

## Education
**University Name** — Degree
Expected Graduation: Year | GPA: X.X/4.0

## Experience
**Job Title** — Company Name
Date - Date
- Accomplishment 1
- Accomplishment 2

## Skills
Languages: ...
Frameworks: ...`}
            className="w-full h-[500px] p-4 bg-slate-50 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none scrollbar-thin"
            style={{ lineHeight: '1.6' }}
          />
        </Card>
        
        {/* Preview */}
        <Card className={cn(activeTab === 'edit' && 'hidden lg:block')}>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">Preview</span>
          </div>
          <div
            className="h-[500px] overflow-y-auto p-4 bg-slate-50 rounded-lg prose  prose-sm max-w-none scrollbar-thin"
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(formData.content) || '<p class="text-slate-400 italic">Start typing to see preview...</p>',
            }}
          />
        </Card>
      </div>
    </div>
  );
}
