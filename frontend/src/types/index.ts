// Application Status Types
export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

// Application Interface
export interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string | null;
  deadline: string | null;
  notes: string;
  resumeVersion: {
    _id: string;
    name: string;
    versionNumber: string;
  } | null;
  salary: string;
  source: string;
  url?: string;
  contactName?: string;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

// Resume Version Interface
export interface ResumeVersion {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Diff Types
export type DiffType = 'added' | 'removed' | 'unchanged';

export interface DiffLine {
  type: DiffType;
  content: string;
  lineNumber?: number;
}

// Analytics Interface
export interface Analytics {
  total: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
  pending: number;
  responseRate: string;
  interviewRate: string;
  offerRate: string;
}

// Status Configuration
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

// View Types
export type ViewType = 'dashboard' | 'applications' | 'resumes' | 'compare';

// Form Types
export interface ApplicationFormData {
  company: string;
  position: string;
  location: string;
  status: ApplicationStatus;
  deadline: string;
  salary: string;
  source: string;
  url: string;
  notes: string;
  resumeVersion: string | null;
}

export interface ResumeFormData {
  name: string;
  description: string;
  content: string;
}
