import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, ResumeVersion, ViewType, ApplicationStatus } from '@/types';
import { sampleApplications, sampleResumeVersions } from '@/data/sample-data';
import { generateId } from '@/lib/utils';

interface AppState {
  // Data
  applications: Application[];
  resumeVersions: ResumeVersion[];
  
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
  
  // Actions - Applications
  addApplication: (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  
  // Actions - Resumes
  addResumeVersion: (resume: Omit<ResumeVersion, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => void;
  deleteResumeVersion: (id: string) => void;
  
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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Data
      applications: sampleApplications,
      resumeVersions: sampleResumeVersions,
      
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
      
      // Application Actions
      addApplication: (app) => {
        const now = new Date().toISOString();
        const newApp: Application = {
          ...app,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          applications: [...state.applications, newApp],
          isAddingApplication: false,
        }));
      },
      
      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...updates, updatedAt: new Date().toISOString() }
              : app
          ),
          editingApplicationId: null,
        }));
      },
      
      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          selectedApplicationId: state.selectedApplicationId === id ? null : state.selectedApplicationId,
        }));
      },
      
      // Resume Actions
      addResumeVersion: (resume) => {
        const now = new Date().toISOString();
        const existingIds = get().resumeVersions.map(r => r.id);
        let newId = `v${get().resumeVersions.length + 1}`;
        while (existingIds.includes(newId)) {
          newId = `v${parseInt(newId.slice(1)) + 1}`;
        }
        
        const newResume: ResumeVersion = {
          ...resume,
          id: newId,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          resumeVersions: [...state.resumeVersions, newResume],
          isAddingResume: false,
        }));
      },
      
      updateResumeVersion: (id, updates) => {
        set((state) => ({
          resumeVersions: state.resumeVersions.map((resume) =>
            resume.id === id
              ? { ...resume, ...updates, updatedAt: new Date().toISOString() }
              : resume
          ),
          editingResumeId: null,
        }));
      },
      
      deleteResumeVersion: (id) => {
        set((state) => ({
          resumeVersions: state.resumeVersions.filter((resume) => resume.id !== id),
          editingResumeId: state.editingResumeId === id ? null : state.editingResumeId,
        }));
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
    }),
    {
      name: 'coop-tracker-storage',
      partialize: (state) => ({
        applications: state.applications,
        resumeVersions: state.resumeVersions,
      }),
    }
  )
);
