// API Client for CoopTrack Backend

const API_BASE_URL = "http://localhost:8000/api";

// Helper to get auth token
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper to set auth token
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

// Helper to remove auth token
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    console.log("Token Removed");
  }
};

// Base fetch wrapper with auth
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ============ AUTH API ============

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  university?: string;
  major?: string;
  graduationYear?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  token?: string;
}

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await fetchAPI<{ success: boolean; data: User }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await fetchAPI<{ success: boolean; data: User }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },

  logout: () => {
    removeToken();
  },

  getMe: async () => {
    return fetchAPI<{ success: boolean; data: User }>("/auth/me");
  },

  updateProfile: async (data: Partial<User>) => {
    return fetchAPI<{ success: boolean; data: User }>("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    return fetchAPI<{ success: boolean; data: { token: string } }>(
      "/auth/password",
      {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      }
    );
  },
};

// ============ APPLICATIONS API ============

export interface Application {
  _id: string;
  company: string;
  position: string;
  location: string;
  status: "saved" | "applied" | "interview" | "offer" | "rejected";
  appliedDate: string | null;
  deadline: string | null;
  salary: string;
  source: string;
  url?: string;
  notes: string;
  resumeVersion?: {
    _id: string;
    name: string;
    versionNumber: string;
  } | null;
  contactName?: string;
  contactEmail?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationsQuery {
  status?: string;
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

export interface ApplicationsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Application[];
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  applied: number;
  responseRate: string;
  interviewRate: string;
  offerRate: string;
}

export const applicationsAPI = {
  getAll: async (query: ApplicationsQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return fetchAPI<ApplicationsResponse>(
      `/applications${queryString ? `?${queryString}` : ""}`
    );
  },

  getOne: async (id: string) => {
    return fetchAPI<{ success: boolean; data: Application }>(
      `/applications/${id}`
    );
  },

  create: async (data: Partial<Application>) => {
    return fetchAPI<{ success: boolean; data: Application }>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Application>) => {
    return fetchAPI<{ success: boolean; data: Application }>(
      `/applications/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/applications/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    return fetchAPI<{ success: boolean; data: ApplicationStats }>(
      "/applications/stats"
    );
  },

  bulkUpdateStatus: async (ids: string[], status: string) => {
    return fetchAPI<{ success: boolean; data: { modifiedCount: number } }>(
      "/applications/bulk-status",
      {
        method: "PUT",
        body: JSON.stringify({ ids, status }),
      }
    );
  },
};

// ============ RESUMES API ============

export interface ResumeVersion {
  _id: string;
  name: string;
  description: string;
  content: string;
  versionNumber: string;
  isDefault: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface CompareResult {
  version1: {
    id: string;
    name: string;
    versionNumber: string;
    lineCount: number;
  };
  version2: {
    id: string;
    name: string;
    versionNumber: string;
    lineCount: number;
  };
  diff: DiffLine[];
  stats: {
    added: number;
    removed: number;
    unchanged: number;
  };
}

export const resumesAPI = {
  getAll: async () => {
    return fetchAPI<{ success: boolean; count: number; data: ResumeVersion[] }>(
      "/resumes"
    );
  },

  getOne: async (id: string) => {
    return fetchAPI<{ success: boolean; data: ResumeVersion }>(
      `/resumes/${id}`
    );
  },

  create: async (data: Partial<ResumeVersion>) => {
    return fetchAPI<{ success: boolean; data: ResumeVersion }>("/resumes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<ResumeVersion>) => {
    return fetchAPI<{ success: boolean; data: ResumeVersion }>(
      `/resumes/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/resumes/${id}`, {
      method: "DELETE",
    });
  },

  compare: async (id1: string, id2: string) => {
    return fetchAPI<{ success: boolean; data: CompareResult }>(
      `/resumes/compare/${id1}/${id2}`
    );
  },

  duplicate: async (id: string) => {
    return fetchAPI<{ success: boolean; data: ResumeVersion }>(
      `/resumes/${id}/duplicate`,
      {
        method: "POST",
      }
    );
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  applications: applicationsAPI,
  resumes: resumesAPI,
};

export default api;
