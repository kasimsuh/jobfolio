"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Button, Input, Select, Modal } from "@/components/ui";
import { KanbanBoard } from "../../components/applications/KanbanBoard";
import { ApplicationForm } from "../../components/applications/ApplicationForm";
import { ApplicationDetail } from "../../components/applications/ApplicationDetail";
import { useAppStore } from "@/hooks";
import { STATUS_CONFIG } from "@/lib/constants";
import { ApplicationFormData } from "@/types";

export default function ApplicationsView() {
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

  const selectedApp = selectedApplicationId
    ? getApplicationById(selectedApplicationId)
    : null;
  const editingApp = editingApplicationId
    ? getApplicationById(editingApplicationId)
    : null;

  const statusOptions = [
    { value: "all", label: "All Status" },
    ...Object.entries(STATUS_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  const handleAddSubmit = async (data: ApplicationFormData) => {
    try {
      await addApplication({
        ...data,
        appliedDate:
          data.status !== "saved" ? new Date().toISOString().split("T")[0] : null,
        deadline: data.deadline || null,
        resumeVersion: data.resumeVersion || null,
      });
    } catch (error) {
      console.error('Failed to add application:', error);
    }
  };

  const handleEditSubmit = async (data: ApplicationFormData) => {
    if (editingApplicationId) {
      try {
        await updateApplication(editingApplicationId, {
          ...data,
          deadline: data.deadline || null,
          resumeVersion: data.resumeVersion || null,
        });
      } catch (error) {
        console.error('Failed to update application:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (
      selectedApplicationId &&
      confirm("Are you sure you want to delete this application?")
    ) {
      try {
        await deleteApplication(selectedApplicationId);
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
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
