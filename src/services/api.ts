// API service connecting to backend on port 5000 (or via Vite proxy)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface ClubStats {
  livesImpacted: number;
  activeVolunteers: number;
  projectsCompleted: number;
  treesPlanted: number;
  mealsServed: number;
  medicalCamps: number;
  citiesCovered: number;
  satisfactionRate: number;
  recentDonationsCount?: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  goal: number;
  raised: number;
  volunteersEnrolled: number;
  beneficiaries: string;
  badge: string;
  featured: boolean;
  image: string;
  highlights: string[];
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
  slotsTotal: number;
  slotsBooked: number;
  description: string;
  leader: string;
}

export interface StoryItem {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatar: string;
  impactTag: string;
}

export interface JoinPayload {
  fullName: string;
  email: string;
  phone: string;
  roleType: string;
  department?: string;
  collegeId?: string;
  yearOfStudy?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  city: string;
  occupation: string;
  skills: string;
  availability: string;
  preferredDomain?: string;
  message?: string;
}

export interface VolunteerApplicationRecord extends JoinPayload {
  id: string;
  status: string;
  joinedAt: string;
}

export interface DonatePayload {
  donorName: string;
  email: string;
  phone: string;
  pan?: string;
  city?: string;
  amount: number;
  cause: string;
  paymentMethod: string;
}

export interface DonationRecord {
  receiptNo: string;
  donorName: string;
  email: string;
  phone: string;
  pan: string;
  city?: string;
  amount: number;
  cause: string;
  paymentMethod: string;
  transactionId?: string;
  taxBenefit: string;
  timestamp: string;
  status: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category?: string;
  priority?: string;
  message: string;
}

export interface ContactMessageRecord extends ContactPayload {
  id: string;
  status: string;
  receivedAt?: string;
  date?: string;
}

export interface AdminData {
  stats: ClubStats;
  volunteerApplications: VolunteerApplicationRecord[];
  donationRecords: DonationRecord[];
  contactMessages: ContactMessageRecord[];
  newsletterSubscribers: string[];
  projects: ProjectItem[];
  events: ClubEvent[];
}

// Public API Calls
export const fetchClubStats = async (): Promise<ClubStats> => {
  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using fallback stats:', error);
    return {
      livesImpacted: 28450,
      activeVolunteers: 1420,
      projectsCompleted: 185,
      treesPlanted: 12400,
      mealsServed: 45200,
      medicalCamps: 68,
      citiesCovered: 14,
      satisfactionRate: 98,
    };
  }
};

export const fetchClubProjects = async (category = 'All'): Promise<ProjectItem[]> => {
  try {
    const url = category === 'All' ? `${API_BASE}/api/projects` : `${API_BASE}/api/projects?category=${encodeURIComponent(category)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock projects:', error);
    return [];
  }
};

export const fetchClubEvents = async (): Promise<ClubEvent[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock events:', error);
    return [];
  }
};

export const fetchClubStories = async (): Promise<StoryItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/stories`);
    if (!res.ok) throw new Error('Failed to fetch stories');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock stories:', error);
    return [];
  }
};

export const submitJoinApplication = async (payload: JoinPayload) => {
  const res = await fetch(`${API_BASE}/api/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Submission failed');
  return data;
};

export const submitDonation = async (payload: DonatePayload) => {
  const res = await fetch(`${API_BASE}/api/donate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Donation submission failed');
  return data;
};

export const submitContactForm = async (payload: ContactPayload) => {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Message failed to send');
  return data;
};

export const submitNewsletter = async (email: string) => {
  const res = await fetch(`${API_BASE}/api/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Subscription failed');
  return data;
};

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
};

// ==========================================
// ADMIN DASHBOARD API CALLS
// ==========================================

export const fetchAdminData = async (): Promise<AdminData> => {
  const res = await fetch(`${API_BASE}/api/admin/submissions`);
  if (!res.ok) throw new Error('Failed to fetch admin submissions data');
  const json = await res.json();
  return json.data;
};

export const createClubEvent = async (payload: Partial<ClubEvent>) => {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create event');
  return data;
};

export const deleteClubEvent = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete event');
  return data;
};

export const createClubProject = async (payload: Partial<ProjectItem>) => {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create project');
  return data;
};

export const deleteClubProject = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete project');
  return data;
};

export const updateClubStats = async (payload: Partial<ClubStats>) => {
  const res = await fetch(`${API_BASE}/api/stats/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update stats');
  return data;
};

export const updateVolunteerStatusApi = async (id: string, status: string) => {
  const res = await fetch(`${API_BASE}/api/admin/volunteers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update volunteer status');
  return data;
};

export const deleteVolunteerApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/admin/volunteers/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete volunteer');
  return data;
};

export const updateInquiryStatusApi = async (id: string, status: string) => {
  const res = await fetch(`${API_BASE}/api/admin/inquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update inquiry status');
  return data;
};

export const deleteInquiryApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/admin/inquiries/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete inquiry');
  return data;
};

export const deleteDonationApi = async (receiptNo: string) => {
  const res = await fetch(`${API_BASE}/api/admin/donations/${receiptNo}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete donation');
  return data;
};

export const adminLoginApi = async (passcode: string, username = 'RCE Admin') => {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode, username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Authentication failed');
  return data;
};

