'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { Application, ApplicationStatus, ApplicationFormData } from '@/types';
import { STATUS_CONFIG, APPLICATION_SOURCES } from '@/lib/constants';
import { useAppStore } from '@/hooks';

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (data: ApplicationFormData) => void;
  onCancel: () => void;
}

const initialFormData: ApplicationFormData = {
  company: '',
  position: '',
  location: '',
  status: 'saved',
  deadline: '',
  salary: '',
  source: '',
  url: '',
  notes: '',
  resumeVersion: null,
};

export function ApplicationForm({ application, onSubmit, onCancel }: ApplicationFormProps) {
  const resumeVersions = useAppStore((state) => state.resumeVersions);
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  
  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company,
        position: application.position,
        location: application.location,
        status: application.status,
        deadline: application.deadline || '',
        salary: application.salary,
        source: application.source,
        url: application.url || '',
        notes: application.notes,
        resumeVersion: application.resumeVersion?._id || null,
      });
    }
  }, [application]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Convert empty string to null for resumeVersion
    const finalValue = name === 'resumeVersion' && value === '' ? null : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const statusOptions = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));
  
  const sourceOptions = [
    { value: '', label: 'Select source...' },
    ...APPLICATION_SOURCES.map((source) => ({ value: source, label: source })),
  ];
  
  const resumeOptions = [
    { value: '', label: 'No resume selected' },
    ...resumeVersions.map((v) => ({ value: v.id, label: v.name })),
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Company *"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Google"
          required
        />
        <Input
          label="Position *"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Software Engineering Intern"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Mountain View, CA"
        />
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
        />
        <Input
          label="Salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="$8,000/mo"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          options={sourceOptions}
        />
        <Select
          label="Resume Version"
          name="resumeVersion"
          value={formData.resumeVersion || ''}
          onChange={handleChange}
          options={resumeOptions}
        />
      </div>
      
      <Input
        label="Job URL"
        name="url"
        type="url"
        value={formData.url}
        onChange={handleChange}
        placeholder="https://careers.google.com/..."
      />
      
      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Add any notes about this application..."
        rows={4}
      />
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {application ? 'Update Application' : 'Add Application'}
        </Button>
      </div>
    </form>
  );
}
