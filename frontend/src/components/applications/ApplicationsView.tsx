'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button, Input, Select, Modal } from '@/components/ui';
import { KanbanBoard } from './KanbanBoard';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationDetail } from './ApplicationDetail';
import { useAppStore } from '@/hooks';
import { STATUS_CONFIG } from '@/lib/constants';
import { ApplicationFormData } from '@/types';

export function ApplicationsView() {
  const {
    searchQuery,
    statusFilter,
    selectedApplicationId,
    isAddingApplication,
    editingApplicationId,
    setSearchQuery,
    setStatusFilter,
    setSelectedApplication,
    setIsAddingApplication,
    setEditingApplication,
    getApplicationById,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useAppStore();
  
  const selectedApp = selectedApplicationId ? getApplicationById(selectedApplicationId) : null;
  const editingApp = editingApplicationId ? getApplicationById(editingApplicationId) : null;
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    ...Object.entries(STATUS_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];
  
  const handleAddSubmit = (data: ApplicationFormData) => {
    addApplication({
      ...data,
      appliedDate: data.status !== 'saved' ? new Date().toISOString().split('T')[0] : null,
      deadline: data.deadline || null,
      resumeVersion: data.resumeVersion || null,
    });
  };
  
  const handleEditSubmit = (data: ApplicationFormData) => {
    if (editingApplicationId) {
      updateApplication(editingApplicationId, {
        ...data,
        deadline: data.deadline || null,
        resumeVersion: data.resumeVersion || null,
      });
    }
  };
  
  const handleDelete = () => {
    if (selectedApplicationId && confirm('Are you sure you want to delete this application?')) {
      deleteApplication(selectedApplicationId);
    }
  };
  
  // Show detail view if an application is selected
  if (selectedApp && !editingApplicationId) {
    return (
      <ApplicationDetail
        application={selectedApp}
        onBack={() => setSelectedApplication(null)}
        onEdit={() => setEditingApplication(selectedApp.id)}
        onDelete={handleDelete}
      />
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={statusOptions}
            className="w-40"
          />
        </div>
        <Button onClick={() => setIsAddingApplication(true)}>
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>
      
      {/* Kanban Board */}
      <KanbanBoard />
      
      {/* Add Application Modal */}
      <Modal
        isOpen={isAddingApplication}
        onClose={() => setIsAddingApplication(false)}
        title="Add New Application"
        size="lg"
      >
        <ApplicationForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddingApplication(false)}
        />
      </Modal>
      
      {/* Edit Application Modal */}
      <Modal
        isOpen={!!editingApplicationId}
        onClose={() => setEditingApplication(null)}
        title="Edit Application"
        size="lg"
      >
        {editingApp && (
          <ApplicationForm
            application={editingApp}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingApplication(null)}
          />
        )}
      </Modal>
    </div>
  );
}
