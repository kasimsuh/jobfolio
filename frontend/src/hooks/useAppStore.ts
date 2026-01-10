import { create } from 'zustand';
import { Application, ResumeVersion, ViewType, ApplicationStatus } from '@/types';
import { applicationsAPI, resumesAPI } from '@/lib/api';
import type { Application as APIApplication, ResumeVersion as APIResumeVersion } from '@/lib/api';

// Transform backend data to frontend format
const transformApplication = (apiApp: APIApplication): Application => (
  {
    ...apiApp,
    id: apiApp._id,
    resumeVersion: apiApp.resumeVersion || null,
    createdAt: apiApp.createdAt || new Date().toISOString(),
    updatedAt: apiApp.updatedAt || new Date().toISOString(),
  }
);

const transformResume = (apiResume: APIResumeVersion): ResumeVersion => ({
  ...apiResume,
  id: apiResume._id,
  createdAt: apiResume.createdAt || new Date().toISOString(),
  updatedAt: apiResume.updatedAt || new Date().toISOString(),
});

interface AppState {
  // Data
  applications: Application[];
  resumeVersions: ResumeVersion[];

  // Loading states
  isLoadingApplications: boolean;
  isLoadingResumes: boolean;

  // Error states
  applicationsError: string | null;
  resumesError: string | null;

  // UI State
  activeView: ViewType;
  selectedApplicationId: string | null;
  editingApplicationId: string | null;
  editingResumeId: string | null;
  isAddingApplication: boolean;
  isAddingResume: boolean;

  // Filters
  searchQuery: string;
  statusFilter: ApplicationStatus | 'all';

  // Compare View
  compareVersionIds: { v1: string | null; v2: string | null };

  // Actions - Data Fetching
  fetchApplications: () => Promise<void>;
  fetchResumes: () => Promise<void>;

  // Actions - Applications
  addApplication: (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;

  // Actions - Resumes
  addResumeVersion: (resume: Omit<ResumeVersion, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => Promise<void>;
  deleteResumeVersion: (id: string) => Promise<void>;

  // Actions - UI
  setActiveView: (view: ViewType) => void;
  setSelectedApplication: (id: string | null) => void;
  setEditingApplication: (id: string | null) => void;
  setEditingResume: (id: string | null) => void;
  setIsAddingApplication: (isAdding: boolean) => void;
  setIsAddingResume: (isAdding: boolean) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: ApplicationStatus | 'all') => void;
  setCompareVersions: (versions: { v1: string | null; v2: string | null }) => void;
  clearErrors: () => void;

  // Computed
  getApplicationById: (id: string) => Application | undefined;
  getResumeById: (id: string) => ResumeVersion | undefined;
  getFilteredApplications: () => Application[];
  getApplicationsByStatus: () => Record<ApplicationStatus, Application[]>;
  getAnalytics: () => {
    total: number;
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
    pending: number;
    responseRate: string;
    interviewRate: string;
    offerRate: string;
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial Data
  applications: [],
  resumeVersions: [],

  // Initial Loading States
  isLoadingApplications: false,
  isLoadingResumes: false,

  // Initial Error States
  applicationsError: null,
  resumesError: null,

  // Initial UI State
  activeView: 'dashboard',
  selectedApplicationId: null,
  editingApplicationId: null,
  editingResumeId: null,
  isAddingApplication: false,
  isAddingResume: false,

  // Initial Filters
  searchQuery: '',
  statusFilter: 'all',

  // Initial Compare State
  compareVersionIds: { v1: null, v2: null },

  // Data Fetching Actions
  fetchApplications: async () => {
    set({ isLoadingApplications: true, applicationsError: null });
    try {
      const response = await applicationsAPI.getAll();
      const apps = response.data.map(transformApplication);
      set({ applications: apps, isLoadingApplications: false });
    } catch (error) {
      set({
        applicationsError: 'Failed to load applications. Is the backend running on port 8000?',
        isLoadingApplications: false,
      });
      console.error('Failed to fetch applications:', error);
    }
  },

  fetchResumes: async () => {
    set({ isLoadingResumes: true, resumesError: null });
    try {
      const response = await resumesAPI.getAll();
      const resumes = response.data.map(transformResume);
      set({ resumeVersions: resumes, isLoadingResumes: false });
    } catch (error) {
      set({
        resumesError: 'Failed to load resume versions. Is the backend running on port 8000?',
        isLoadingResumes: false,
      });
      console.error('Failed to fetch resumes:', error);
    }
  },

  // Application Actions
  addApplication: async (app) => {
    try {
      // Transform frontend data to API format (resumeVersion is string ID)
      const apiData: any = { ...app };
      const response = await applicationsAPI.create(apiData);
      const newApp = transformApplication(response.data);
      set((state) => ({
        applications: [...state.applications, newApp],
        isAddingApplication: false,
      }));
    } catch (error) {
      set({ applicationsError: 'Failed to create application.' });
      console.error('Failed to add application:', error);
      throw error; // Re-throw for component to handle
    }
  },

  updateApplication: async (id, updates) => {
    try {
      // Transform frontend data to API format
      const apiData: any = { ...updates };
      const response = await applicationsAPI.update(id, apiData);
      const updatedApp = transformApplication(response.data);
      set((state) => ({
        applications: state.applications.map((app) =>
          app.id === id ? updatedApp : app
        ),
        editingApplicationId: null,
      }));
    } catch (error) {
      set({ applicationsError: 'Failed to update application.' });
      console.error('Failed to update application:', error);
      throw error;
    }
  },

  deleteApplication: async (id) => {
    try {
      await applicationsAPI.delete(id);
      set((state) => ({
        applications: state.applications.filter((app) => app.id !== id),
        selectedApplicationId: state.selectedApplicationId === id ? null : state.selectedApplicationId,
      }));
    } catch (error) {
      set({ applicationsError: 'Failed to delete application.' });
      console.error('Failed to delete application:', error);
      throw error;
    }
  },

  // Resume Actions
  addResumeVersion: async (resume) => {
    try {
      const response = await resumesAPI.create(resume);
      const newResume = transformResume(response.data);
      set((state) => ({
        resumeVersions: [...state.resumeVersions, newResume],
        isAddingResume: false,
      }));
    } catch (error) {
      set({ resumesError: 'Failed to create resume version.' });
      console.error('Failed to add resume:', error);
      throw error;
    }
  },

  updateResumeVersion: async (id, updates) => {
    try {
      const response = await resumesAPI.update(id, updates);
      const updatedResume = transformResume(response.data);
      set((state) => ({
        resumeVersions: state.resumeVersions.map((resume) =>
          resume.id === id ? updatedResume : resume
        ),
        editingResumeId: null,
      }));
    } catch (error) {
      set({ resumesError: 'Failed to update resume version.' });
      console.error('Failed to update resume:', error);
      throw error;
    }
  },

  deleteResumeVersion: async (id) => {
    try {
      await resumesAPI.delete(id);
      set((state) => ({
        resumeVersions: state.resumeVersions.filter((resume) => resume.id !== id),
        editingResumeId: state.editingResumeId === id ? null : state.editingResumeId,
      }));
    } catch (error) {
      set({ resumesError: 'Failed to delete resume version.' });
      console.error('Failed to delete resume:', error);
      throw error;
    }
  },

  // UI Actions
  setActiveView: (view) => set({ activeView: view }),
  setSelectedApplication: (id) => set({ selectedApplicationId: id }),
  setEditingApplication: (id) => set({ editingApplicationId: id }),
  setEditingResume: (id) => set({ editingResumeId: id }),
  setIsAddingApplication: (isAdding) => set({ isAddingApplication: isAdding }),
  setIsAddingResume: (isAdding) => set({ isAddingResume: isAdding }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setCompareVersions: (versions) => set({ compareVersionIds: versions }),
  clearErrors: () => set({ applicationsError: null, resumesError: null }),

  // Computed Getters
  getApplicationById: (id) => {
    return get().applications.find((app) => app.id === id);
  },

  getResumeById: (id) => {
    return get().resumeVersions.find((resume) => resume.id === id);
  },

  getFilteredApplications: () => {
    const { applications, searchQuery, statusFilter } = get();
    return applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  },

  getApplicationsByStatus: () => {
    const filtered = get().getFilteredApplications();
    return {
      saved: filtered.filter((app) => app.status === 'saved'),
      applied: filtered.filter((app) => app.status === 'applied'),
      interview: filtered.filter((app) => app.status === 'interview'),
      offer: filtered.filter((app) => app.status === 'offer'),
      rejected: filtered.filter((app) => app.status === 'rejected'),
    };
  },

  getAnalytics: () => {
    const { applications } = get();
    const total = applications.length;
    const applied = applications.filter((a) => a.status !== 'saved').length;
    const interviews = applications.filter((a) => a.status === 'interview').length;
    const offers = applications.filter((a) => a.status === 'offer').length;
    const rejected = applications.filter((a) => a.status === 'rejected').length;
    const pending = applications.filter((a) => a.status === 'applied').length;

    const responseRate = applied > 0
      ? ((interviews + offers + rejected) / applied * 100).toFixed(1)
      : '0';
    const interviewRate = applied > 0
      ? ((interviews + offers) / applied * 100).toFixed(1)
      : '0';
    const offerRate = (interviews + offers) > 0
      ? (offers / (interviews + offers) * 100).toFixed(1)
      : '0';

    return {
      total,
      applied,
      interviews,
      offers,
      rejected,
      pending,
      responseRate,
      interviewRate,
      offerRate,
    };
  },
}));
