// API service connecting to backend on port 5024 (or relative path in production)

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:5024');

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

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  year: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  category?: string;
  description?: string;
  duration?: string;
  location?: string;
  featured?: boolean;
  createdAt?: string;
}

export const extractYouTubeId = (url = ''): string => {
  if (!url) return '';
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) return match[1];
  if (/^[\w-]{11}$/.test(clean)) return clean;
  return clean;
};

export const getYouTubeThumbnail = (videoId: string): string => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (videoId: string, autoplay = false): string => {
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
};

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Miyawaki Afforestation: 12,400 Native Trees Planted',
    youtubeUrl: 'https://www.youtube.com/watch?v=0h9VqFq5b5I',
    youtubeId: '0h9VqFq5b5I',
    category: 'Environment',
    description: 'Witness 450+ passionate youth volunteers transform dry wasteland into a lush biodiverse Miyawaki urban forest in Chennai.',
    duration: '04:12',
    location: 'Kattivakkam, Chennai',
    featured: true,
  },
  {
    id: 'vid-2',
    title: 'Vidhya Connect: Free STEM Labs & Weekend Mentorship',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    category: 'Education',
    description: 'Bringing high quality science experiments, math kits, and university mentors to 1,200+ rural government school students.',
    duration: '05:30',
    location: 'Tiruvallur District',
    featured: false,
  },
  {
    id: 'vid-3',
    title: 'Arogya Mega Blood Donation & Eye Screening Camp',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    youtubeId: 'L_LUpnjgPso',
    category: 'Healthcare',
    description: 'Over 680 emergency blood units mobilized for government hospitals, alongside free cataract surgeries and medicine kits.',
    duration: '03:45',
    location: 'Kanchipuram Outskirts',
    featured: false,
  },
  {
    id: 'vid-4',
    title: 'Annapoorna Relief: 45,000 Nutritious Meals Served',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    youtubeId: 'jNQXAC9IVRw',
    category: 'Relief & Hunger',
    description: 'Delivering freshly cooked hot meals every weekend to hospital attendants, elderly shelters, and migrant worker communities.',
    duration: '04:55',
    location: 'Central Chennai',
    featured: false,
  },
];

export interface PillarItem {
  id: string;
  title: string;
  description: string;
}

export interface BrandContent {
  name: string;
  subtitle: string;
  mission: string;
  trustReg: string;
  taxExemption80G: string;
  reg12A: string;
  pan: string;
}

export interface HeroContent {
  tag: string;
  titlePrefix: string;
  titleGradient: string;
  titleSuffix: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
  trustBadge1: string;
  trustBadge2: string;
  trustBadge3: string;
  imageUrl: string;
  badgeTagline: string;
  statTreesLabel?: string;
  statLivesLabel?: string;
}

export interface AboutContent {
  tag: string;
  title: string;
  titleGradient: string;
  subtitle: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  checklist1: string;
  checklist2: string;
  checklist3: string;
  yearsExperience: string;
  yearsExperienceLabel?: string;
  drivesExperience: string;
  imageUrl: string;
  pillarsTitle?: string;
  pillars: PillarItem[];
}

export interface ContactContent {
  tag?: string;
  title?: string;
  titleGradient?: string;
  subtitle?: string;
  officeAddress: string;
  phone: string;
  email: string;
  hours: string;
  emergencyHotline: string;
}

export interface SiteContent {
  brand: BrandContent;
  hero: HeroContent;
  about: AboutContent;
  contact: ContactContent;
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
  stories?: StoryItem[];
  gallery?: GalleryItem[];
  videos?: VideoItem[];
  siteContent?: SiteContent;
}

// Fallback Default Site Content (used when offline)
export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: 'RCE',
    subtitle: 'RIGHT CLUB FOR EDUCATION',
    mission: 'A people-driven social movement inspired by compassion and collective civic action. Bridging resources to the vulnerable and fostering responsible young leaders.',
    trustReg: 'TN/CH/2021/84920',
    taxExemption80G: 'CIT(E)/CHN/80G/2021-22/A-412',
    reg12A: 'AAATR8492GE20210',
    pan: 'AAATR8492G',
  },
  hero: {
    tag: 'A People-Driven Social Movement',
    titlePrefix: 'Dedicated to ',
    titleGradient: 'Culture, Service',
    titleSuffix: ' & Community Upliftment',
    description: 'RCE Social Service Club unites passionate youth, students, and mentors to bring tangible grassroots change. From educating underprivileged children and organizing mega medical camps, to restoring water bodies and planting native urban forests.',
    primaryCta: 'Join As Volunteer',
    secondaryCta: 'Support A Cause',
    tertiaryCta: 'Active Drives',
    trustBadge1: '80G Tax Exemption',
    trustBadge2: 'Govt. Registered NGO',
    trustBadge3: '100% Volunteer Driven',
    imageUrl: '/hero-banner.jpeg',
    badgeTagline: '✨ Service Above Self • RCE Chapter',
    statTreesLabel: 'Saplings Planted',
    statLivesLabel: 'Lives Impacted',
  },
  about: {
    tag: 'About RCE Movement',
    title: 'Empowering Youth to Serve with ',
    titleGradient: 'Heart & Integrity',
    subtitle: 'Just like Kutumb (Family), RCE is founded on the philosophy that true community development begins when we treat every citizen as family.',
    storyHeading: 'From a Small Campus Initiative to a Statewide Movement',
    storyParagraph1: 'RCE Social Service Club began with a handful of passionate students who believed that youth energy should not be confined within classrooms. We witnessed rural children struggling with textbooks, seniors suffering without basic eye care, and barren public plots longing for shade.',
    storyParagraph2: 'Today, RCE connects thousands of students, working professionals, doctors, and community elders. We do not just hand out charity; we build self-sustaining educational ecosystems, plant trees that live for decades, and empower families with dignity.',
    checklist1: '100% of public donations go directly into on-ground drive supplies',
    checklist2: 'Full financial transparency with publicly published expenditure audits',
    checklist3: 'Active chapters across universities, colleges, and residential welfare bodies',
    yearsExperience: '5+',
    yearsExperienceLabel: 'Years of Active Service',
    drivesExperience: '180+ Successful Drives',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    pillarsTitle: 'Our 4 Core Pillars of Service',
    pillars: [
      {
        id: 'pillar-1',
        title: 'Vidhya (Education)',
        description: 'Bridging the educational divide by supporting government schools, setting up smart digital labs, and conducting free weekend tutoring.',
      },
      {
        id: 'pillar-2',
        title: 'Prakriti (Environment)',
        description: 'Championing high-density Miyawaki urban forests, lake restoration, rainwater harvesting drives, and single-use plastic eradication.',
      },
      {
        id: 'pillar-3',
        title: 'Arogya (Healthcare)',
        description: 'Zero-cost screening camps for eyes, cardiac health, diabetes, and maintaining an emergency volunteer blood donation grid.',
      },
      {
        id: 'pillar-4',
        title: 'Seva (Relief & Nutrition)',
        description: 'Immediate flood and disaster relief packages, weekend nutritious meal distributions to attendants outside public hospitals.',
      },
    ],
  },
  contact: {
    tag: 'Connect With Us',
    title: 'Have Questions or a ',
    titleGradient: 'Cause to Champion?',
    subtitle: 'Every great initiative begins with a conversation. Let us know how we can collaborate.',
    officeAddress: 'RCE Youth Movement Hub, 42 Community Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040',
    phone: '+91 (044) 2894-8800 / +91 98401 22334',
    email: 'contact@rceclub.org / volunteer@rceclub.org',
    hours: 'Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: On-Ground Field Drives',
    emergencyHotline: '+91 99400 99999',
  },
};

// ==========================================
// PUBLIC API CALLS
// ==========================================

export const fetchSiteContent = async (): Promise<SiteContent> => {
  try {
    const res = await fetch(`${API_BASE}/api/content`);
    if (!res.ok) throw new Error('Failed to fetch site content');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using default site content:', error);
    return DEFAULT_SITE_CONTENT;
  }
};

export const updateSiteContentApi = async (payload: Partial<SiteContent>) => {
  const res = await fetch(`${API_BASE}/api/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update site content');
  return data;
};

export const fetchGallery = async (): Promise<GalleryItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock gallery:', error);
    return [];
  }
};

export const createGalleryItemApi = async (payload: Partial<GalleryItem>) => {
  const res = await fetch(`${API_BASE}/api/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add gallery photo');
  return data;
};

export const updateGalleryItemApi = async (id: string, payload: Partial<GalleryItem>) => {
  const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update photo');
  return data;
};

export const deleteGalleryItemApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete photo');
  return data;
};

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

export const createClubStoryApi = async (payload: Partial<StoryItem>) => {
  const res = await fetch(`${API_BASE}/api/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create story');
  return data;
};

export const updateClubStoryApi = async (id: string, payload: Partial<StoryItem>) => {
  const res = await fetch(`${API_BASE}/api/stories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update story');
  return data;
};

export const deleteClubStoryApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/stories/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete story');
  return data;
};

// ==========================================
// YOUTUBE VIDEOS API CALLS
// ==========================================

export const fetchClubVideos = async (): Promise<VideoItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/videos`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        localStorage.setItem('rce_club_videos', JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (error) {
    console.warn('Backend unavailable, using saved or default videos:', error);
  }

  const local = localStorage.getItem('rce_club_videos');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback to DEFAULT_VIDEOS
    }
  }
  return DEFAULT_VIDEOS;
};

export const createClubVideoApi = async (payload: Partial<VideoItem>) => {
  let createdVideo: VideoItem | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      createdVideo = data.data;
    }
  } catch (e) {
    console.warn('Backend offline, saving video to local state:', e);
  }

  const cleanId = payload.youtubeId || extractYouTubeId(payload.youtubeUrl || '');
  if (!createdVideo) {
    createdVideo = {
      id: `vid-${Date.now()}`,
      title: payload.title || 'Community Service Highlight',
      youtubeUrl: payload.youtubeUrl || `https://www.youtube.com/watch?v=${cleanId}`,
      youtubeId: cleanId,
      category: payload.category || 'General',
      description: payload.description || '',
      duration: payload.duration || '04:00',
      location: payload.location || 'Chennai',
      featured: Boolean(payload.featured),
      createdAt: new Date().toISOString(),
    };
  }

  const current = await fetchClubVideos();
  const updated = [createdVideo, ...current.filter((v) => v.id !== createdVideo?.id)];
  localStorage.setItem('rce_club_videos', JSON.stringify(updated));
  return { success: true, data: createdVideo };
};

export const updateClubVideoApi = async (id: string, payload: Partial<VideoItem>) => {
  let updatedVideo: VideoItem | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      updatedVideo = data.data;
    }
  } catch (e) {
    console.warn('Backend offline, updating video in local state:', e);
  }

  const current = await fetchClubVideos();
  const cleanId = payload.youtubeId || (payload.youtubeUrl ? extractYouTubeId(payload.youtubeUrl) : undefined);
  const updated = current.map((v) => {
    if (v.id === id) {
      const merged = { ...v, ...payload, ...(cleanId ? { youtubeId: cleanId } : {}) };
      if (!updatedVideo) updatedVideo = merged;
      return merged;
    }
    return v;
  });
  localStorage.setItem('rce_club_videos', JSON.stringify(updated));
  return { success: true, data: updatedVideo };
};

export const deleteClubVideoApi = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/videos/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      // deleted on backend
    }
  } catch (e) {
    console.warn('Backend offline, removing from local state:', e);
  }

  const current = await fetchClubVideos();
  const updated = current.filter((v) => v.id !== id);
  localStorage.setItem('rce_club_videos', JSON.stringify(updated));
  return { success: true };
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

export const updateClubEvent = async (id: string, payload: Partial<ClubEvent>) => {
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update event');
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

export const updateClubProject = async (id: string, payload: Partial<ProjectItem>) => {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update project');
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
