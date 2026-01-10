"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { ResumeCard } from "../../components/resumes/ResumeCard";
import { ResumeEditor } from "../../components/resumes/ResumeEditor";
import { ResumeViewer } from "../../components/resumes/ResumeViewer";
import { useAppStore } from "@/hooks";
import { ResumeFormData } from "@/types";

export default function ResumesView() {
  const {
    resumeVersions,
    editingResumeId,
    isAddingResume,
    setEditingResume,
    setIsAddingResume,
    getResumeById,
    addResumeVersion,
    updateResumeVersion,
    deleteResumeVersion,
  } = useAppStore();

  const [viewingResumeId, setViewingResumeId] = React.useState<string | null>(
    null
  );

  const editingResume = editingResumeId ? getResumeById(editingResumeId) : null;
  const viewingResume = viewingResumeId ? getResumeById(viewingResumeId) : null;

  const handleCreate = async (data: ResumeFormData) => {
    try {
      await addResumeVersion(data);
      setIsAddingResume(false);
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  const handleUpdate = async (data: ResumeFormData) => {
    if (editingResumeId) {
      try {
        await updateResumeVersion(editingResumeId, data);
        setEditingResume(null);
      } catch (error) {
        console.error('Failed to update resume:', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume version?")) {
      try {
        await deleteResumeVersion(id);
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    }
  };

  // Show editor for new resume
  if (isAddingResume) {
    return (
      <ResumeEditor
        isNew
        onSave={handleCreate}
        onCancel={() => setIsAddingResume(false)}
      />
    );
  }

  // Show editor for existing resume
  if (editingResume) {
    return (
      <ResumeEditor
        resume={editingResume}
        onSave={handleUpdate}
        onCancel={() => setEditingResume(null)}
      />
    );
  }

  // Show viewer
  if (viewingResume) {
    return (
      <ResumeViewer
        resume={viewingResume}
        onBack={() => setViewingResumeId(null)}
        onEdit={() => {
          setViewingResumeId(null);
          setEditingResume(viewingResume.id);
        }}
      />
    );
  }

  // Show list
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Resume Versions</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage and track different versions of your resume
          </p>
        </div>
        <Button onClick={() => setIsAddingResume(true)}>
          <Plus className="w-4 h-4" />
          New Version
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumeVersions.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onView={() => setViewingResumeId(resume.id)}
            onEdit={() => setEditingResume(resume.id)}
            onDelete={() => handleDelete(resume.id)}
          />
        ))}
      </div>

      {resumeVersions.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No resume versions yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
