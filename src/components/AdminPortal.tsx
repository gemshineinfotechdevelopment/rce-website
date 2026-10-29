import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Calendar,
  Layers,
  Mail,
  BarChart3,
  RefreshCw,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Printer,
  ShieldCheck,
  Lock,
  LogOut,
  ArrowLeft,
  Phone,
  Eye,
  Sliders,
  Edit3,
  Image as ImageIcon,
  Quote,
  Globe,
  ExternalLink,
  Save,
  RotateCcw,
  Menu,
  X,
  FileSpreadsheet,
  ChevronUp,
  TreePine,
  Building2,
  Award,
  Tv,
  Play
} from 'lucide-react';
import {
  fetchAdminData,
  createClubEvent,
  updateClubEvent,
  deleteClubEvent,
  createClubProject,
  updateClubProject,
  deleteClubProject,
  updateClubStats,
  updateVolunteerStatusApi,
  deleteVolunteerApi,
  updateInquiryStatusApi,
  deleteInquiryApi,
  deleteDonationApi,
  adminLoginApi,
  updateSiteContentApi,
  createGalleryItemApi,
  updateGalleryItemApi,
  deleteGalleryItemApi,
  createClubStoryApi,
  updateClubStoryApi,
  deleteClubStoryApi,
  fetchClubVideos,
  createClubVideoApi,
  updateClubVideoApi,
  deleteClubVideoApi,
  extractYouTubeId,
  getYouTubeThumbnail,
  DEFAULT_SITE_CONTENT
} from '../services/api';
import type {
  AdminData,
  VolunteerApplicationRecord,
  DonationRecord,
  ProjectItem,
  ClubEvent,
  StoryItem,
  GalleryItem,
  VideoItem,
  PillarItem,
  SiteContent
} from '../services/api';
import { ImageUploadInput } from './ImageUploadInput';

interface AdminPortalProps {
  onBackToWebsite: () => void;
  onDataUpdated?: () => void;
}

type AdminTab =
  | 'overview'
  | 'volunteers'
  | 'donations'
  | 'events'
  | 'projects'
  | 'inquiries'
  | 'cms'
  | 'counters'
  | 'videos'
  | 'gallery'
  | 'stories'
  | 'newsletters';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite, onDataUpdated }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('rce_admin_session') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sub-navigation for Website CMS
  const [cmsSubTab, setCmsSubTab] = useState<'hero' | 'about' | 'pillars' | 'contact' | 'brand'>('hero');

  // Core Data
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSavingCms, setIsSavingCms] = useState(false);

  // Section Create Form Toggles
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);

  // Videos List
  const [videosList, setVideosList] = useState<VideoItem[]>([]);

  // Filter & Search states
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerDeptFilter, setVolunteerDeptFilter] = useState('All');
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState('All');
  const [donationSearch, setDonationSearch] = useState('');

  // Selected Detail Modals
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerApplicationRecord | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);

  // Editing Modals State
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // New Video Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoDuration, setVideoDuration] = useState('04:15');
  const [videoLocation, setVideoLocation] = useState('Chennai');
  const [videoFeatured, setVideoFeatured] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM - 01:00 PM');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('₹5 Paadasaalai');
  const [eventStudentsImpacted, setEventStudentsImpacted] = useState('1,200+ Students Benefited');
  const [eventImage, setEventImage] = useState('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80');
  const [eventStatus, setEventStatus] = useState('Conducted');
  const [eventLeader, setEventLeader] = useState('RCE Educational Team');
  const [eventChiefGuest, setEventChiefGuest] = useState('');
  const [eventHighlights, setEventHighlights] = useState('Daily evening tutoring, Spoken English, Free stationery');
  const [eventDesc, setEventDesc] = useState('');

  // New Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Education');
  const [projTagline, setProjTagline] = useState('');
  const [projGoal, setProjGoal] = useState('300000');
  const [projRaised, setProjRaised] = useState('0');
  const [projBeneficiaries, setProjBeneficiaries] = useState('1,200+ Students');
  const [projImage, setProjImage] = useState('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80');
  const [projDesc, setProjDesc] = useState('');
  const [projHighlights, setProjHighlights] = useState('Free STEM kits, Weekend coaching, Mentorship');

  // New Gallery Photo State
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState('Environment');
  const [newGalImage, setNewGalImage] = useState('');
  const [newGalLocation, setNewGalLocation] = useState('Chennai');
  const [newGalYear, setNewGalYear] = useState('2026');

  // New Story State
  const [newStoryName, setNewStoryName] = useState('');
  const [newStoryRole, setNewStoryRole] = useState('Beneficiary / Parent');
  const [newStoryLocation, setNewStoryLocation] = useState('Chennai');
  const [newStoryQuote, setNewStoryQuote] = useState('');
  const [newStoryAvatar, setNewStoryAvatar] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80');
  const [newStoryImpactTag, setNewStoryImpactTag] = useState('Education Beneficiary');

  // Counter Ribbon Edit State
  const [counterLives, setCounterLives] = useState('28450');
  const [counterVolunteers, setCounterVolunteers] = useState('1420');
  const [counterProjects, setCounterProjects] = useState('185');
  const [counterTrees, setCounterTrees] = useState('12400');
  const [counterMeals, setCounterMeals] = useState('45200');
  const [counterCamps, setCounterCamps] = useState('68');
  const [counterCities, setCounterCities] = useState('14');
  const [counterSatisfaction, setCounterSatisfaction] = useState('98');

  // CMS Form States
  const [heroTag, setHeroTag] = useState(DEFAULT_SITE_CONTENT.hero.tag);
  const [heroTitlePrefix, setHeroTitlePrefix] = useState(DEFAULT_SITE_CONTENT.hero.titlePrefix);
  const [heroTitleGradient, setHeroTitleGradient] = useState(DEFAULT_SITE_CONTENT.hero.titleGradient);
  const [heroTitleSuffix, setHeroTitleSuffix] = useState(DEFAULT_SITE_CONTENT.hero.titleSuffix);
  const [heroDesc, setHeroDesc] = useState(DEFAULT_SITE_CONTENT.hero.description);
  const [heroPrimaryCta, setHeroPrimaryCta] = useState(DEFAULT_SITE_CONTENT.hero.primaryCta);
  const [heroSecondaryCta, setHeroSecondaryCta] = useState(DEFAULT_SITE_CONTENT.hero.secondaryCta);
  const [heroTertiaryCta, setHeroTertiaryCta] = useState(DEFAULT_SITE_CONTENT.hero.tertiaryCta);
  const [heroImage, setHeroImage] = useState(DEFAULT_SITE_CONTENT.hero.imageUrl);
  const [heroTagline, setHeroTagline] = useState(DEFAULT_SITE_CONTENT.hero.badgeTagline);

  // About CMS
  const [aboutTag, setAboutTag] = useState(DEFAULT_SITE_CONTENT.about.tag);
  const [aboutTitle, setAboutTitle] = useState(DEFAULT_SITE_CONTENT.about.title);
  const [aboutTitleGradient, setAboutTitleGradient] = useState(DEFAULT_SITE_CONTENT.about.titleGradient);
  const [aboutSubtitle, setAboutSubtitle] = useState(DEFAULT_SITE_CONTENT.about.subtitle);
  const [aboutStoryHeading, setAboutStoryHeading] = useState(DEFAULT_SITE_CONTENT.about.storyHeading);
  const [aboutStoryPara1, setAboutStoryPara1] = useState(DEFAULT_SITE_CONTENT.about.storyParagraph1);
  const [aboutStoryPara2, setAboutStoryPara2] = useState(DEFAULT_SITE_CONTENT.about.storyParagraph2);
  const [aboutChecklist1, setAboutChecklist1] = useState(DEFAULT_SITE_CONTENT.about.checklist1);
  const [aboutChecklist2, setAboutChecklist2] = useState(DEFAULT_SITE_CONTENT.about.checklist2);
  const [aboutChecklist3, setAboutChecklist3] = useState(DEFAULT_SITE_CONTENT.about.checklist3);
  const [aboutYears, setAboutYears] = useState(DEFAULT_SITE_CONTENT.about.yearsExperience);
  const [aboutDrives, setAboutDrives] = useState(DEFAULT_SITE_CONTENT.about.drivesExperience);
  const [aboutImage, setAboutImage] = useState(DEFAULT_SITE_CONTENT.about.imageUrl);
  const [aboutPillarsTitle, setAboutPillarsTitle] = useState(DEFAULT_SITE_CONTENT.about.pillarsTitle || 'Our 4 Core Pillars of Service');

  // Pillars CMS
  const [pillarsList, setPillarsList] = useState<PillarItem[]>(DEFAULT_SITE_CONTENT.about.pillars);

  // Contact CMS
  const [contactTag, setContactTag] = useState(DEFAULT_SITE_CONTENT.contact.tag || 'Connect With Us');
  const [contactTitle, setContactTitle] = useState(DEFAULT_SITE_CONTENT.contact.title || 'Have Questions or a ');
  const [contactTitleGradient, setContactTitleGradient] = useState(DEFAULT_SITE_CONTENT.contact.titleGradient || 'Cause to Champion?');
  const [contactSubtitle, setContactSubtitle] = useState(DEFAULT_SITE_CONTENT.contact.subtitle || '');
  const [contactAddress, setContactAddress] = useState(DEFAULT_SITE_CONTENT.contact.officeAddress);
  const [contactPhone, setContactPhone] = useState(DEFAULT_SITE_CONTENT.contact.phone);
  const [contactEmail, setContactEmail] = useState(DEFAULT_SITE_CONTENT.contact.email);
  const [contactHours, setContactHours] = useState(DEFAULT_SITE_CONTENT.contact.hours);
  const [contactEmergency, setContactEmergency] = useState(DEFAULT_SITE_CONTENT.contact.emergencyHotline);

  // Brand CMS
  const [brandName, setBrandName] = useState(DEFAULT_SITE_CONTENT.brand.name);
  const [brandSubtitle, setBrandSubtitle] = useState(DEFAULT_SITE_CONTENT.brand.subtitle);
  const [brandMission, setBrandMission] = useState(DEFAULT_SITE_CONTENT.brand.mission);
  const [brandTrustReg, setBrandTrustReg] = useState(DEFAULT_SITE_CONTENT.brand.trustReg);
  const [brand80G, setBrand80G] = useState(DEFAULT_SITE_CONTENT.brand.taxExemption80G);
  const [brand12A, setBrand12A] = useState(DEFAULT_SITE_CONTENT.brand.reg12A);
  const [brandPAN, setBrandPAN] = useState(DEFAULT_SITE_CONTENT.brand.pan);

  // Load Admin Data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData();
      setAdminData(data);

      if (data?.stats) {
        setCounterLives(String(data.stats.livesImpacted ?? '28450'));
        setCounterVolunteers(String(data.stats.activeVolunteers ?? '1420'));
        setCounterProjects(String(data.stats.projectsCompleted ?? '185'));
        setCounterTrees(String(data.stats.treesPlanted ?? '12400'));
        setCounterMeals(String(data.stats.mealsServed ?? '45200'));
        setCounterCamps(String(data.stats.medicalCamps ?? '68'));
        setCounterCities(String(data.stats.citiesCovered ?? '14'));
        setCounterSatisfaction(String(data.stats.satisfactionRate ?? '98'));
      }

      if (data?.siteContent) {
        populateCmsFields(data.siteContent);
      }

      if (data?.videos && data.videos.length > 0) {
        setVideosList(data.videos);
      } else {
        const vList = await fetchClubVideos();
        setVideosList(vList);
      }
    } catch (err) {
      console.warn('Could not connect to backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateCmsFields = (content: SiteContent) => {
    if (content.hero) {
      setHeroTag(content.hero.tag || '');
      setHeroTitlePrefix(content.hero.titlePrefix || '');
      setHeroTitleGradient(content.hero.titleGradient || '');
      setHeroTitleSuffix(content.hero.titleSuffix || '');
      setHeroDesc(content.hero.description || '');
      setHeroPrimaryCta(content.hero.primaryCta || '');
      setHeroSecondaryCta(content.hero.secondaryCta || '');
      setHeroTertiaryCta(content.hero.tertiaryCta || '');
      setHeroImage(content.hero.imageUrl || '');
      setHeroTagline(content.hero.badgeTagline || '');
    }
    if (content.about) {
      setAboutTag(content.about.tag || '');
      setAboutTitle(content.about.title || '');
      setAboutTitleGradient(content.about.titleGradient || '');
      setAboutSubtitle(content.about.subtitle || '');
      setAboutStoryHeading(content.about.storyHeading || '');
      setAboutStoryPara1(content.about.storyParagraph1 || '');
      setAboutStoryPara2(content.about.storyParagraph2 || '');
      setAboutChecklist1(content.about.checklist1 || '');
      setAboutChecklist2(content.about.checklist2 || '');
      setAboutChecklist3(content.about.checklist3 || '');
      setAboutYears(content.about.yearsExperience || '');
      setAboutDrives(content.about.drivesExperience || '');
      setAboutImage(content.about.imageUrl || '');
      setAboutPillarsTitle(content.about.pillarsTitle || 'Our 4 Core Pillars of Service');
      if (content.about.pillars?.length) {
        setPillarsList(content.about.pillars);
      }
    }
    if (content.contact) {
      setContactTag(content.contact.tag || 'Connect With Us');
      setContactTitle(content.contact.title || 'Have Questions or a ');
      setContactTitleGradient(content.contact.titleGradient || 'Cause to Champion?');
      setContactSubtitle(content.contact.subtitle || '');
      setContactAddress(content.contact.officeAddress || '');
      setContactPhone(content.contact.phone || '');
      setContactEmail(content.contact.email || '');
      setContactHours(content.contact.hours || '');
      setContactEmergency(content.contact.emergencyHotline || '');
    }
    if (content.brand) {
      setBrandName(content.brand.name || '');
      setBrandSubtitle(content.brand.subtitle || '');
      setBrandMission(content.brand.mission || '');
      setBrandTrustReg(content.brand.trustReg || '');
      setBrand80G(content.brand.taxExemption80G || '');
      setBrand12A(content.brand.reg12A || '');
      setBrandPAN(content.brand.pan || '');
    }
  };

  const showNotice = (text: string, isError = false) => {
    setActionNotice({ text, isError });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await adminLoginApi(passcode);
      sessionStorage.setItem('rce_admin_session', 'true');
      setIsAuthenticated(true);
      showNotice('Welcome to RCE Club Admin Portal!');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid passcode. Default key is: rce@admin');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    sessionStorage.setItem('rce_admin_session', 'true');
    setIsAuthenticated(true);
    showNotice('Demo login active. Welcome, Administrator!');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rce_admin_session');
    setIsAuthenticated(false);
    setPasscode('');
  };

  // Save Website CMS Content
  const handleSaveCmsContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingCms(true);
    try {
      const payload: SiteContent = {
        brand: {
          name: brandName,
          subtitle: brandSubtitle,
          mission: brandMission,
          trustReg: brandTrustReg,
          taxExemption80G: brand80G,
          reg12A: brand12A,
          pan: brandPAN,
        },
        hero: {
          tag: heroTag,
          titlePrefix: heroTitlePrefix,
          titleGradient: heroTitleGradient,
          titleSuffix: heroTitleSuffix,
          description: heroDesc,
          primaryCta: heroPrimaryCta,
          secondaryCta: heroSecondaryCta,
          tertiaryCta: heroTertiaryCta,
          trustBadge1: DEFAULT_SITE_CONTENT.hero.trustBadge1,
          trustBadge2: DEFAULT_SITE_CONTENT.hero.trustBadge2,
          trustBadge3: DEFAULT_SITE_CONTENT.hero.trustBadge3,
          imageUrl: heroImage,
          badgeTagline: heroTagline,
        },
        about: {
          tag: aboutTag,
          title: aboutTitle,
          titleGradient: aboutTitleGradient,
          subtitle: aboutSubtitle,
          storyHeading: aboutStoryHeading,
          storyParagraph1: aboutStoryPara1,
          storyParagraph2: aboutStoryPara2,
          checklist1: aboutChecklist1,
          checklist2: aboutChecklist2,
          checklist3: aboutChecklist3,
          yearsExperience: aboutYears,
          drivesExperience: aboutDrives,
          imageUrl: aboutImage,
          pillarsTitle: aboutPillarsTitle,
          pillars: pillarsList,
        },
        contact: {
          tag: contactTag,
          title: contactTitle,
          titleGradient: contactTitleGradient,
          subtitle: contactSubtitle,
          officeAddress: contactAddress,
          phone: contactPhone,
          email: contactEmail,
          hours: contactHours,
          emergencyHotline: contactEmergency,
        },
      };

      await updateSiteContentApi(payload);
      showNotice('Website details updated successfully! Live page reflects changes.');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update website content', true);
    } finally {
      setIsSavingCms(false);
    }
  };

  const handleResetCmsToDefaults = () => {
    if (!window.confirm('Reset all website content fields to template defaults?')) return;
    populateCmsFields(DEFAULT_SITE_CONTENT);
    showNotice('Loaded default template values. Click "Save Website Details" to apply.');
  };

  const handlePillarChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...pillarsList];
    updated[index] = { ...updated[index], [field]: value };
    setPillarsList(updated);
  };

  // Gallery Handlers
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle.trim() || !newGalImage.trim()) {
      showNotice('Please provide photo title and image URL', true);
      return;
    }
    try {
      await createGalleryItemApi({
        title: newGalTitle,
        category: newGalCategory,
        image: newGalImage,
        location: newGalLocation,
        year: newGalYear,
      });
      showNotice('Photo added to public gallery!');
      setNewGalTitle('');
      setNewGalImage('');
      setShowAddGallery(false);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to add photo', true);
    }
  };

  const handleUpdateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;
    try {
      await updateGalleryItemApi(editingGallery.id, editingGallery);
      showNotice('Photo details updated!');
      setEditingGallery(null);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update photo', true);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!window.confirm('Remove this photo from public gallery?')) return;
    try {
      await deleteGalleryItemApi(id);
      showNotice('Photo deleted from gallery');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to delete photo', true);
    }
  };

  // Stories Handlers
  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryName.trim() || !newStoryQuote.trim()) {
      showNotice('Please provide person name and quote', true);
      return;
    }
    try {
      await createClubStoryApi({
        name: newStoryName,
        role: newStoryRole,
        location: newStoryLocation,
        quote: newStoryQuote,
        avatar: newStoryAvatar,
        impactTag: newStoryImpactTag,
      });
      showNotice('Testimonial story published to website!');
      setNewStoryName('');
      setNewStoryQuote('');
      setShowAddStory(false);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to create story', true);
    }
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    try {
      await updateClubStoryApi(editingStory.id, editingStory);
      showNotice('Story updated successfully!');
      setEditingStory(null);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update story', true);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!window.confirm('Delete this testimonial story?')) return;
    try {
      await deleteClubStoryApi(id);
      showNotice('Story removed from website');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to delete story', true);
    }
  };

  // YouTube Video Handlers
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) {
      showNotice('Please provide video title and YouTube link or ID', true);
      return;
    }
    const extractedId = extractYouTubeId(videoUrl.trim());
    if (!extractedId) {
      showNotice('Invalid YouTube link or ID. Please enter a valid URL (e.g. youtu.be/... or watch?v=...)', true);
      return;
    }
    try {
      await createClubVideoApi({
        title: videoTitle.trim(),
        youtubeUrl: videoUrl.trim(),
        youtubeId: extractedId,
        description: videoDesc.trim() || 'RCE social service impact video.',
        duration: videoDuration.trim() || '04:00',
        location: videoLocation.trim() || 'Chennai',
        featured: videoFeatured,
      });
      showNotice('YouTube video successfully added to website showcase!');
      setVideoTitle('');
      setVideoUrl('');
      setVideoDesc('');
      setVideoDuration('04:15');
      setVideoLocation('Chennai');
      setVideoFeatured(false);
      setShowAddVideo(false);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to add video', true);
    }
  };

  const handleSaveEditedVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    const extractedId = extractYouTubeId(editingVideo.youtubeUrl || editingVideo.youtubeId);
    if (!extractedId) {
      showNotice('Invalid YouTube URL or ID', true);
      return;
    }
    try {
      await updateClubVideoApi(editingVideo.id, {
        ...editingVideo,
        youtubeId: extractedId,
      });
      showNotice(`Video "${editingVideo.title}" updated successfully!`);
      setEditingVideo(null);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update video', true);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Remove this YouTube video from the website showcase?')) return;
    try {
      await deleteClubVideoApi(id);
      showNotice('Video removed from showcase');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to delete video', true);
    }
  };

  // Projects Handlers
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      showNotice('Please enter a project title', true);
      return;
    }
    try {
      await createClubProject({
        title: projTitle,
        category: projCategory,
        tagline: projTagline || 'Grassroots civic and social empowerment project',
        goal: Number(projGoal) || 100000,
        raised: Number(projRaised) || 0,
        beneficiaries: projBeneficiaries,
        image: projImage,
        description: projDesc || 'Social welfare project organized by RCE Club.',
        highlights: projHighlights.split(',').map((s) => s.trim()),
      });
      showNotice('Project launched and added to the website!');
      setProjTitle('');
      setProjDesc('');
      setShowAddProject(false);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to launch project', true);
    }
  };

  const handleSaveEditedProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await updateClubProject(editingProject.id, editingProject);
      showNotice(`Project "${editingProject.title}" updated successfully!`);
      setEditingProject(null);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update project', true);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteClubProject(id);
      showNotice('Project removed from website');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Delete failed', true);
    }
  };

  // Events Handlers
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showNotice('Please enter an event title', true);
      return;
    }
    try {
      await createClubEvent({
        title: eventTitle.trim(),
        date: eventDate || new Date().toISOString().slice(0, 10),
        time: eventTime,
        location: eventLocation || 'Sivakasi & Rural Hubs, Tamil Nadu',
        category: eventCategory,
        status: eventStatus || 'Conducted',
        studentsImpacted: eventStudentsImpacted || '1,000+ Students Benefited',
        image:
          eventImage ||
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        highlights: eventHighlights
          ? eventHighlights.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Educational initiative', 'Volunteer led'],
        leader: eventLeader || 'RCE Educational Team',
        chiefGuest: eventChiefGuest,
        slotsTotal: 100,
        description: eventDesc || 'Educational program conducted by Right Club for Education.',
      });
      showNotice('Event uploaded and published to the live website!');
      setEventTitle('');
      setEventDesc('');
      setEventChiefGuest('');
      setShowAddEvent(false);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to create event', true);
    }
  };

  const handleSaveEditedEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await updateClubEvent(editingEvent.id, editingEvent);
      showNotice(`Drive "${editingEvent.title}" updated successfully!`);
      setEditingEvent(null);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update event', true);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this drive?')) return;
    try {
      await deleteClubEvent(id);
      showNotice('Drive removed from live site');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Delete failed', true);
    }
  };

  // Stats Counters Update
  const handleSaveCounters = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClubStats({
        livesImpacted: Number(counterLives),
        activeVolunteers: Number(counterVolunteers),
        projectsCompleted: Number(counterProjects),
        treesPlanted: Number(counterTrees),
        mealsServed: Number(counterMeals),
        medicalCamps: Number(counterCamps),
        citiesCovered: Number(counterCities),
        satisfactionRate: Number(counterSatisfaction),
      });
      showNotice('Live website counters updated successfully!');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update stats', true);
    }
  };

  // Volunteer Actions
  const handleUpdateVolunteerStatus = async (id: string, status: string) => {
    try {
      await updateVolunteerStatusApi(id, status);
      showNotice(`Volunteer ${id} status updated to ${status}`);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Status update failed', true);
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (!window.confirm(`Permanently remove volunteer record ${id}?`)) return;
    try {
      await deleteVolunteerApi(id);
      showNotice('Volunteer record deleted');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Delete failed', true);
    }
  };

  // Inquiry Actions
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await updateInquiryStatusApi(id, status);
      showNotice(`Inquiry marked as ${status}`);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Update failed', true);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await deleteInquiryApi(id);
      showNotice('Inquiry removed');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Delete failed', true);
    }
  };

  // Donation Actions
  const handleDeleteDonation = async (receiptNo: string) => {
    if (!window.confirm(`Void / delete donation record ${receiptNo}?`)) return;
    try {
      await deleteDonationApi(receiptNo);
      showNotice('Donation record deleted');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Delete failed', true);
    }
  };

  // CSV Exporters
  const exportVolunteersCSV = () => {
    if (!adminData?.volunteerApplications?.length) return;
    const headers = ['ID', 'Full Name', 'Department', 'Student ID', 'Year', 'Blood Group', 'Email', 'Phone', 'Role', 'Skills', 'Availability', 'Domain', 'Status', 'Joined Date'];
    const rows = adminData.volunteerApplications.map((v) => [
      v.id,
      `"${v.fullName}"`,
      `"${v.department || ''}"`,
      v.collegeId || '',
      v.yearOfStudy || '',
      v.bloodGroup || '',
      v.email,
      v.phone,
      v.roleType,
      `"${(v.skills || '').replace(/"/g, '""')}"`,
      `"${v.availability || ''}"`,
      `"${v.preferredDomain || ''}"`,
      v.status,
      new Date(v.joinedAt || Date.now()).toLocaleDateString('en-IN')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RCE_Volunteers_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDonationsCSV = () => {
    if (!adminData?.donationRecords?.length) return;
    const headers = ['Receipt No', 'Donor Name', 'Amount (INR)', 'PAN', 'City', 'Cause', 'Payment Mode', 'Txn ID', 'Status', 'Date'];
    const rows = adminData.donationRecords.map((d) => [
      d.receiptNo,
      `"${d.donorName}"`,
      d.amount,
      d.pan,
      `"${d.city || ''}"`,
      `"${d.cause}"`,
      d.paymentMethod,
      d.transactionId || '',
      d.status,
      new Date(d.timestamp).toLocaleDateString('en-IN')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RCE_Donations_Ledger_80G_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for KPI Cards
  const totalDonationSum = adminData?.donationRecords?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
  const pendingVolunteersCount = adminData?.volunteerApplications?.filter((v) => v.status.toLowerCase().includes('pending')).length || 0;
  const newInquiriesCount = adminData?.contactMessages?.filter((m) => m.status.toLowerCase() === 'new').length || 0;

  // Filtered Volunteers List
  const filteredVolunteers = (adminData?.volunteerApplications || []).filter((v) => {
    const matchSearch =
      v.fullName.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.email.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.phone.includes(volunteerSearch) ||
      (v.collegeId && v.collegeId.toLowerCase().includes(volunteerSearch.toLowerCase())) ||
      (v.bloodGroup && v.bloodGroup.toLowerCase().includes(volunteerSearch.toLowerCase()));

    const matchDept = volunteerDeptFilter === 'All' || (v.department && v.department.toLowerCase().includes(volunteerDeptFilter.toLowerCase()));
    const matchStatus = volunteerStatusFilter === 'All' || v.status.toLowerCase().includes(volunteerStatusFilter.toLowerCase());

    return matchSearch && matchDept && matchStatus;
  });

  // Filtered Donations List
  const filteredDonations = (adminData?.donationRecords || []).filter((d) => {
    return (
      d.donorName.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.receiptNo.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.pan.toLowerCase().includes(donationSearch.toLowerCase()) ||
      d.cause.toLowerCase().includes(donationSearch.toLowerCase())
    );
  });

  // Counters configuration for clean grid
  const counterFields = [
    { label: 'Active Volunteers', val: counterVolunteers, setVal: setCounterVolunteers, icon: <Users size={20} className="text-blue-600" /> },
    { label: 'Completed Drives', val: counterProjects, setVal: setCounterProjects, icon: <Layers size={20} className="text-emerald-600" /> },
    { label: 'Saplings Planted', val: counterTrees, setVal: setCounterTrees, icon: <TreePine size={20} className="text-green-700" /> },
    { label: 'Cities & Regions Covered', val: counterCities, setVal: setCounterCities, icon: <Building2 size={20} className="text-purple-600" /> },
    { label: 'Satisfaction Rate (%)', val: counterSatisfaction, setVal: setCounterSatisfaction, icon: <Award size={20} className="text-yellow-600" /> },
  ];

  // ==============================================================
  // 1. SECURE LOGIN SCREEN
  // ==============================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-brand-lockup">
              <div className="admin-login-logo-wrap">
                <img src="/Rce.logo.png" alt="RCE Logo" className="admin-login-logo-img" />
              </div>
              <div className="admin-login-brand-text">
                <span className="admin-login-brand-title">{brandName || 'RCE'}</span>
                <span className="admin-login-brand-subtitle">ADMIN CONSOLE</span>
              </div>
            </div>
            <p className="admin-login-subtext">Sign in to manage club operations, drives, and content</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label className="input-sublabel">Security Passcode</label>
              <div className="admin-input-icon-box">
                <Lock size={18} className="text-amber-600" />
                <input
                  type="password"
                  required
                  placeholder="Enter administrator passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="form-input flex-1"
                />
              </div>
              <p className="admin-pass-hint">
                Default Access Key: <code>rce@admin</code>
              </p>
            </div>

            {loginError && (
              <div className="status-alert-banner error mb-4">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="btn-primary w-full btn-large"
            >
              <ShieldCheck size={18} />
              <span>{loginLoading ? 'Verifying...' : 'Sign In to Admin Portal'}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn-outline w-full text-xs mt-2"
            >
              <span>⚡ One-Click Demo Access</span>
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onBackToWebsite}
                className="text-xs text-amber-800 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft size={13} />
                <span>Return to Public Website</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 2. MAIN LOGGED-IN ADMIN CONSOLE
  // ==============================================================
  return (
    <div className="admin-standalone-wrapper">
      {/* Toast Notification */}
      {actionNotice && (
        <div className={`admin-toast-banner ${actionNotice.isError ? 'error' : 'success'}`}>
          {actionNotice.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{actionNotice.text}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo-wrap">
            <img src="/Rce.logo.png" alt="RCE Logo" className="admin-sidebar-logo-img" />
          </div>
          <div className="admin-sidebar-text">
            <h3>{brandName || 'RCE'}</h3>
            <span>ADMIN PORTAL</span>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Grouped Sidebar Nav */}
        <nav className="admin-sidebar-nav">
          <div className="admin-nav-group-label">MAIN</div>
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={18} />
              <span>Overview</span>
            </div>
          </button>

          <div className="admin-nav-group-label">OPERATIONS</div>
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('volunteers'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Users size={18} />
              <span>Volunteers</span>
            </div>
            {pendingVolunteersCount > 0 ? (
              <span className="admin-badge-count urgent">{pendingVolunteersCount}</span>
            ) : (
              <span className="admin-badge-count">{adminData?.volunteerApplications?.length || 0}</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => { setActiveTab('donations'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Heart size={18} />
              <span>Donations & 80G</span>
            </div>
            <span className="admin-badge-count">{adminData?.donationRecords?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Calendar size={18} />
              <span>Events</span>
            </div>
            <span className="admin-badge-count">{adminData?.events?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => { setActiveTab('projects'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span>Projects</span>
            </div>
            <span className="admin-badge-count">{adminData?.projects?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inquiries'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>Inquiries</span>
            </div>
            {newInquiriesCount > 0 && (
              <span className="admin-badge-count urgent">{newInquiriesCount} New</span>
            )}
          </button>

          <div className="admin-nav-group-label">SITE & CONTENT</div>
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'cms' ? 'active' : ''}`}
            onClick={() => { setActiveTab('cms'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Globe size={18} />
              <span>Website Content</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'counters' ? 'active' : ''}`}
            onClick={() => { setActiveTab('counters'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Sliders size={18} />
              <span>Live Counters</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('videos'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Tv size={18} className="text-red-500" />
              <span>YouTube Videos</span>
            </div>
            <span className="admin-badge-count">{videosList.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <ImageIcon size={18} />
              <span>Photo Gallery</span>
            </div>
            <span className="admin-badge-count">{adminData?.gallery?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('stories'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Quote size={18} />
              <span>Testimonials</span>
            </div>
            <span className="admin-badge-count">{adminData?.stories?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'newsletters' ? 'active' : ''}`}
            onClick={() => { setActiveTab('newsletters'); setMobileSidebarOpen(false); }}
          >
            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>Subscribers</span>
            </div>
            <span className="admin-badge-count">{adminData?.newsletterSubscribers?.length || 0}</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            onClick={() => { setMobileSidebarOpen(false); onBackToWebsite(); }}
            className="btn-outline w-full mb-2 admin-switch-website-btn"
          >
            <ArrowLeft size={16} />
            <span>View Live Website</span>
          </button>

          <button
            type="button"
            onClick={() => { setMobileSidebarOpen(false); handleLogout(); }}
            className="admin-logout-btn w-full"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="admin-main-viewport">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-brand-group">
            <button
              type="button"
              className="admin-mobile-menu-toggle"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
            <div className="admin-topbar-title">
              <h2>
                {activeTab === 'overview' && 'Executive Performance Overview'}
                {activeTab === 'cms' && 'Website Content & CMS'}
                {activeTab === 'counters' && 'Home Page Live Counters'}
                {activeTab === 'videos' && 'YouTube Videos & Impact Media Showcase'}
                {activeTab === 'gallery' && 'Public Photo Gallery'}
                {activeTab === 'stories' && 'Voices of Change & Stories'}
                {activeTab === 'events' && 'Events'}
                {activeTab === 'projects' && 'Flagship Causes & Projects'}
                {activeTab === 'counters' && 'Home Page Live Counters'}
                {activeTab === 'volunteers' && 'Volunteer & Member Registry'}
                {activeTab === 'donations' && 'Donations & 80G Receipts'}
                {activeTab === 'inquiries' && 'Helpline & Citizen Messages'}
                {activeTab === 'newsletters' && 'Newsletter Audience'}
              </h2>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="btn-outline btn-admin-top"
              title="Refresh all data"
            >
              <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
              <span className="admin-btn-text">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={onBackToWebsite}
              className="btn-primary btn-admin-top"
              title="Open public website"
            >
              <ExternalLink size={15} />
              <span className="admin-btn-text">Live Site ↗</span>
            </button>
          </div>
        </header>

        {/* ==============================================================
            TAB: OVERVIEW
           ============================================================== */}
        {activeTab === 'overview' && (
          <div className="admin-content-view">
            {/* KPI Cards Grid */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card gold-border">
                <div className="kpi-icon-wrap gold">
                  <Users size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Volunteers</span>
                  <h3 className="kpi-value">{adminData?.volunteerApplications?.length || 0}</h3>
                  <span className="kpi-subtext text-emerald-600 font-semibold">
                    +{pendingVolunteersCount} Pending Review
                  </span>
                </div>
              </div>

              <div className="admin-kpi-card emerald-border">
                <div className="kpi-icon-wrap green">
                  <Heart size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Donations Raised</span>
                  <h3 className="kpi-value">₹{totalDonationSum.toLocaleString('en-IN')}</h3>
                  <span className="kpi-subtext">Across {adminData?.donationRecords?.length || 0} Donors</span>
                </div>
              </div>

              <div className="admin-kpi-card blue-border">
                <div className="kpi-icon-wrap blue">
                  <Calendar size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Active Drives</span>
                  <h3 className="kpi-value">{adminData?.events?.length || 0}</h3>
                  <span className="kpi-subtext">{adminData?.projects?.length || 0} Flagship Causes</span>
                </div>
              </div>

              <div className="admin-kpi-card purple-border">
                <div className="kpi-icon-wrap purple">
                  <Mail size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Inquiries</span>
                  <h3 className="kpi-value">{adminData?.contactMessages?.length || 0}</h3>
                  <span className="kpi-subtext text-amber-700 font-semibold">
                    {newInquiriesCount} Require Action
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Feed */}
            <div className="admin-overview-grid mt-4">
              {/* Quick Actions */}
              <div className="admin-box">
                <h3 className="admin-box-title">⚡ Quick Management Actions</h3>
                <div className="admin-quick-actions-list">
                  <button
                    type="button"
                    onClick={() => setActiveTab('volunteers')}
                    className="admin-action-tile"
                  >
                    <Users size={20} className="text-amber-700" />
                    <div>
                      <strong>Manage Volunteers</strong>
                      <p>Review new student registrations and assign domains</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('events')}
                    className="admin-action-tile"
                  >
                    <PlusCircle size={20} className="text-emerald-700" />
                    <div>
                      <strong>Schedule a Drive</strong>
                      <p>Publish upcoming community, health, or clean-up drives</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('cms')}
                    className="admin-action-tile"
                  >
                    <Globe size={20} className="text-blue-700" />
                    <div>
                      <strong>Update Website CMS</strong>
                      <p>Edit hero texts, about story, contact helpline, and pillars</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={exportVolunteersCSV}
                    className="admin-action-tile"
                  >
                    <FileSpreadsheet size={20} className="text-emerald-600" />
                    <div>
                      <strong>Export Volunteer CSV</strong>
                      <p>Download full roster for NAAC/College accreditation</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="admin-box">
                <h3 className="admin-box-title">🕒 Recent Submissions Feed</h3>
                <div className="admin-activity-stream">
                  {(adminData?.volunteerApplications || []).slice(0, 3).map((v) => (
                    <div key={v.id} className="activity-item">
                      <div className="activity-icon-badge">
                        <Users size={16} />
                      </div>
                      <div className="activity-body">
                        <div className="activity-header">
                          <strong>{v.fullName}</strong>
                          <span className="activity-time">{v.department || v.roleType}</span>
                        </div>
                        <p>{v.roleType} • Blood Group: {v.bloodGroup || 'O+'}</p>
                        <span className={`status-chip ${v.status.toLowerCase().includes('approved') ? 'green' : 'amber'}`}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {(adminData?.donationRecords || []).slice(0, 2).map((d) => (
                    <div key={d.receiptNo} className="activity-item">
                      <div className="activity-icon-badge green">
                        <Heart size={16} />
                      </div>
                      <div className="activity-body">
                        <div className="activity-header">
                          <strong>{d.donorName}</strong>
                          <span className="activity-time">₹{d.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <p>Contributed to <i>{d.cause}</i> • 80G #{d.receiptNo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: VOLUNTEERS
           ============================================================== */}
        {activeTab === 'volunteers' && (
          <div className="admin-content-view">
            <div className="admin-toolbar">
              <div className="admin-search-wrapper">
                <Search size={18} className="text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Name, Dept, Blood Group, Phone..."
                  value={volunteerSearch}
                  onChange={(e) => setVolunteerSearch(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="admin-filter-group">
                <select
                  value={volunteerDeptFilter}
                  onChange={(e) => setVolunteerDeptFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="AI & Data">AI & Data Science</option>
                  <option value="Electronics">Electronics (ECE)</option>
                  <option value="Electrical">Electrical (EEE)</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Biotech">Biotechnology</option>
                </select>

                <select
                  value={volunteerStatusFilter}
                  onChange={(e) => setVolunteerStatusFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending Review</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  type="button"
                  onClick={exportVolunteersCSV}
                  className="btn-outline btn-admin-top"
                  title="Export to CSV"
                >
                  <Download size={15} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="admin-card-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Volunteer Name</th>
                    <th>Profile & Dept</th>
                    <th>Blood</th>
                    <th>Contact</th>
                    <th>Domain</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-stone-500">
                        No volunteer records matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredVolunteers.map((vol) => (
                      <tr key={vol.id}>
                        <td>
                          <span className="admin-code-badge">{vol.id}</span>
                        </td>
                        <td>
                          <div className="font-bold text-stone-900">{vol.fullName}</div>
                          <div className="text-xs text-stone-500">{vol.email}</div>
                          <span className="text-xs text-amber-800 font-semibold">{vol.roleType}</span>
                        </td>
                        <td>
                          <div className="text-xs font-bold text-stone-800">{vol.occupation || 'Student'}</div>
                          <div className="text-xs text-stone-500">{vol.department || vol.city || 'General Citizen'}</div>
                        </td>
                        <td>
                          <span className="blood-group-chip">{vol.bloodGroup || 'O+'}</span>
                        </td>
                        <td>
                          <div className="text-xs font-mono">{vol.phone}</div>
                          <a
                            href={`https://wa.me/${vol.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-1 font-semibold"
                          >
                            <Phone size={11} /> WhatsApp
                          </a>
                        </td>
                        <td>
                          <div className="text-xs font-semibold text-amber-800">{vol.preferredDomain || 'Field Drives'}</div>
                          <div className="text-xs text-stone-500 truncate max-w-xs">{vol.skills}</div>
                        </td>
                        <td>
                          <span
                            className={`status-chip ${
                              vol.status.toLowerCase().includes('approved')
                                ? 'green'
                                : vol.status.toLowerCase().includes('pending')
                                ? 'amber'
                                : 'red'
                            }`}
                          >
                            {vol.status}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-row justify-center">
                            <button
                              type="button"
                              onClick={() => setSelectedVolunteer(vol)}
                              className="admin-icon-btn blue"
                              title="View Dossier"
                            >
                              <Eye size={15} />
                            </button>
                            {vol.status !== 'Approved' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateVolunteerStatus(vol.id, 'Approved')}
                                className="admin-icon-btn green"
                                title="Approve"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                            )}
                            {vol.status !== 'Rejected' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateVolunteerStatus(vol.id, 'Rejected')}
                                className="admin-icon-btn amber"
                                title="Reject"
                              >
                                <XCircle size={15} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteVolunteer(vol.id)}
                              className="admin-icon-btn red"
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: DONATIONS & 80G
           ============================================================== */}
        {activeTab === 'donations' && (
          <div className="admin-content-view">
            <div className="admin-toolbar">
              <div className="admin-search-wrapper">
                <Search size={18} className="text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Donor, Receipt No, PAN, Cause..."
                  value={donationSearch}
                  onChange={(e) => setDonationSearch(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="admin-filter-group">
                <div className="admin-stat-pill">
                  <span>Total Collected:</span>
                  <strong>₹{totalDonationSum.toLocaleString('en-IN')}</strong>
                </div>

                <button
                  type="button"
                  onClick={exportDonationsCSV}
                  className="btn-outline btn-admin-top"
                >
                  <Download size={15} />
                  <span>Export 80G CSV</span>
                </button>
              </div>
            </div>

            <div className="admin-card-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>Donor Name</th>
                    <th>Amount</th>
                    <th>PAN Card</th>
                    <th>Allocated Cause</th>
                    <th>Payment Mode</th>
                    <th>Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-stone-500">
                        No donation records found.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.receiptNo}>
                        <td>
                          <span className="admin-code-badge">{d.receiptNo}</span>
                          <div className="text-xs text-emerald-700 font-semibold mt-1">80G Eligible</div>
                        </td>
                        <td>
                          <div className="font-bold text-stone-900">{d.donorName}</div>
                          <div className="text-xs text-stone-500">{d.email}</div>
                          <div className="text-xs text-stone-500">{d.city || 'Chennai'} • {d.phone}</div>
                        </td>
                        <td>
                          <div className="text-base font-extrabold text-amber-900">
                            ₹{d.amount.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td>
                          <span className="admin-pan-chip">{d.pan || 'N/A'}</span>
                        </td>
                        <td>
                          <span className="text-xs font-semibold text-stone-800">{d.cause}</span>
                        </td>
                        <td>
                          <div className="text-xs font-semibold text-stone-700">{d.paymentMethod}</div>
                          <div className="text-xs font-mono text-stone-400 truncate max-w-xs">{d.transactionId || 'UPI Verified'}</div>
                        </td>
                        <td>
                          <span className="text-xs text-stone-500">
                            {new Date(d.timestamp).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-row justify-center">
                            <button
                              type="button"
                              onClick={() => setSelectedDonation(d)}
                              className="admin-icon-btn blue"
                              title="Print 80G Certificate"
                            >
                              <Printer size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDonation(d.receiptNo)}
                              className="admin-icon-btn red"
                              title="Void Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: EVENTS & INITIATIVES
           ============================================================== */}
        {activeTab === 'events' && (
          <div className="admin-content-view">
            {/* Header + Add Toggle Button */}
            <div className="admin-section-header-bar">
              <div>
                <h3 className="admin-section-title">Events ({adminData?.events?.length || 0})</h3>
                <p className="admin-section-subtitle">Upload and showcase completed education programs, ₹5 Paadasaalai centers, Kalvi Melas, and honors</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="btn-primary"
              >
                {showAddEvent ? <ChevronUp size={16} /> : <PlusCircle size={16} />}
                <span>{showAddEvent ? 'Close Form' : '+ Upload Event'}</span>
              </button>
            </div>

            {/* Expandable Add Event Form */}
            {showAddEvent && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-amber-700" />
                  <span>Upload New Event</span>
                </h4>
                <form onSubmit={handleAddEvent}>
                  <div className="form-group mb-3">
                    <label className="input-sublabel">Event / Program Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. மாநில அளவிலான கல்வி மேளா (State-Level Kalvi Mela 2025)"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-3 mb-3">
                    <div>
                      <label className="input-sublabel">Program Category</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className="form-input"
                      >
                        <option value="₹5 Paadasaalai">₹5 Paadasaalai (Evening Centers)</option>
                        <option value="Kalvi Mela">Kalvi Mela & Science Expo</option>
                        <option value="Teachers Award">Best Good Teacher Award</option>
                        <option value="Kit Distribution">School Kit & Study Aid Distribution</option>
                        <option value="Education Awareness">Education Awareness Marathon</option>
                        <option value="Career Guidance">Higher Education & NEET/JEE Guidance</option>
                        <option value="General Education">General Education Program</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-sublabel">Conducted Date *</label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Timing / Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 05:30 PM - 07:30 PM Daily or 09:30 AM - 04:30 PM"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-3 mb-3">
                    <div>
                      <label className="input-sublabel">Location / School / Venue *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sivakasi & Surrounding Villages, Tamil Nadu"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Students / Beneficiaries Impacted *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1,200+ Students Learning Daily"
                        value={eventStudentsImpacted}
                        onChange={(e) => setEventStudentsImpacted(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Status</label>
                      <select
                        value={eventStatus}
                        onChange={(e) => setEventStatus(e.target.value)}
                        className="form-input"
                      >
                        <option value="Conducted">Conducted / Completed</option>
                        <option value="Ongoing Flagship">Ongoing Flagship Movement</option>
                        <option value="Annual Program">Annual Flagship Program</option>
                        <option value="Upcoming">Upcoming Program</option>
                      </select>
                    </div>
                  </div>

                  <ImageUploadInput
                    label="Event Photograph"
                    value={eventImage}
                    onChange={setEventImage}
                    helpText="Upload an event photo from your computer or phone (JPG, PNG, WEBP)"
                    previewHeight="160px"
                  />

                  <div className="form-row-2 mb-3">
                    <div>
                      <label className="input-sublabel">Lead Coordinator / Team</label>
                      <input
                        type="text"
                        placeholder="e.g. RCE Paadasaalai Mentors Wing"
                        value={eventLeader}
                        onChange={(e) => setEventLeader(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Chief Guest / Special Dignitaries</label>
                      <input
                        type="text"
                        placeholder="e.g. District Educational Officer (DEO) & Village Leaders"
                        value={eventChiefGuest}
                        onChange={(e) => setEventChiefGuest(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="input-sublabel">Key Highlights / Milestones (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Schools Reached, Free Notebook Bundles, Spoken English Coaching"
                      value={eventHighlights}
                      onChange={(e) => setEventHighlights(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="input-sublabel">Event Summary & Educational Impact Description *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the initiative, student participation, outcomes, and community response..."
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEvent(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} />
                      <span>Publish Event</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Events Cards Grid */}
            <div className="admin-cards-grid">
              {(adminData?.events || []).map((ev) => (
                <div key={ev.id} className="admin-event-card">
                  {ev.image && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-stone-200 h-36 w-full">
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'; }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="event-cat-chip">{ev.category}</span>
                    <span className={`status-chip ${ev.status === 'Completed' || ev.status === 'Conducted' ? 'green' : 'amber'}`}>
                      {ev.status || 'Conducted'}
                    </span>
                  </div>

                  <h4 className="admin-event-card-title">{ev.title}</h4>

                  <div className="admin-event-meta-grid">
                    <span className="meta-pill">📅 {ev.date}</span>
                    <span className="meta-pill">📍 {ev.location}</span>
                    <span className="meta-pill text-amber-900 font-bold bg-amber-50">
                      🎓 {ev.studentsImpacted || ev.beneficiaries || 'Students Benefited'}
                    </span>
                  </div>

                  <p className="admin-event-desc line-clamp-2">{ev.description}</p>

                  {ev.highlights && ev.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 my-2">
                      {ev.highlights.slice(0, 2).map((hl, i) => (
                        <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full line-clamp-1">
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-200">
                    <span className="text-xs text-stone-500">Lead: {ev.leader || 'RCE Team'}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingEvent(ev)}
                        className="admin-icon-btn blue"
                        title="Edit Event"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="admin-icon-btn red"
                        title="Delete Event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: PROJECTS & CAUSES
           ============================================================== */}
        {activeTab === 'projects' && (
          <div className="admin-content-view">
            {/* Header + Add Toggle Button */}
            <div className="admin-section-header-bar">
              <div>
                <h3 className="admin-section-title">Flagship Initiatives ({adminData?.projects?.length || 0})</h3>
                <p className="admin-section-subtitle">Long-term social causes and community development projects</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className="btn-primary"
              >
                {showAddProject ? <ChevronUp size={16} /> : <PlusCircle size={16} />}
                <span>{showAddProject ? 'Close Form' : '+ Launch New Project'}</span>
              </button>
            </div>

            {/* Expandable Add Project Form */}
            {showAddProject && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-amber-700" />
                  <span>Launch New Flagship Social Project</span>
                </h4>
                <form onSubmit={handleAddProject}>
                  <div className="form-group mb-3">
                    <label className="input-sublabel">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vidhya Connect: Rural School Mentorship"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-3 mb-3">
                    <div>
                      <label className="input-sublabel">Category</label>
                      <select
                        value={projCategory}
                        onChange={(e) => setProjCategory(e.target.value)}
                        className="form-input"
                      >
                        <option value="Education">Education</option>
                        <option value="Environment">Environment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Relief">Relief & Hunger</option>
                        <option value="Culture & Youth">Culture & Youth</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-sublabel">Funding Goal (₹)</label>
                      <input
                        type="number"
                        placeholder="300000"
                        value={projGoal}
                        onChange={(e) => setProjGoal(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Funds Raised So Far (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={projRaised}
                        onChange={(e) => setProjRaised(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2 mb-3">
                    <div>
                      <label className="input-sublabel">Beneficiaries Tag</label>
                      <input
                        type="text"
                        placeholder="1,200+ Students"
                        value={projBeneficiaries}
                        onChange={(e) => setProjBeneficiaries(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Short Tagline</label>
                      <input
                        type="text"
                        placeholder="Empowering rural children through weekly tutoring & kits"
                        value={projTagline}
                        onChange={(e) => setProjTagline(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <ImageUploadInput
                    label="Project Banner Image"
                    value={projImage}
                    onChange={setProjImage}
                    helpText="Choose cover photo for this cause (JPG, PNG, WEBP)"
                    previewHeight="160px"
                  />

                  <div className="form-group mb-3">
                    <label className="input-sublabel">Highlights (comma separated)</label>
                    <input
                      type="text"
                      placeholder="STEM kits, Weekend classes, Mentorship"
                      value={projHighlights}
                      onChange={(e) => setProjHighlights(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="input-sublabel">Full Description</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed mission, community impact, and volunteer role..."
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProject(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} />
                      <span>Launch Project</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Projects Grid */}
            <div className="admin-cards-grid">
              {(adminData?.projects || []).map((proj) => {
                const percent = Math.min(100, Math.round(((proj.raised || 0) / (proj.goal || 1)) * 100));
                return (
                  <div key={proj.id} className="admin-project-card">
                    <img src={proj.image} alt={proj.title} className="admin-project-thumb" />
                    <div className="admin-project-body">
                      <div className="flex items-center justify-between mb-1">
                        <span className="event-cat-chip">{proj.category}</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingProject(proj)}
                            className="admin-icon-btn blue"
                            title="Edit Project"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="admin-icon-btn red"
                            title="Delete Project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <h4 className="admin-project-title">{proj.title}</h4>
                      <p className="admin-project-tagline">{proj.tagline}</p>

                      <div className="admin-project-fund-bar">
                        <div className="fund-bar-fill" style={{ width: `${percent}%` }}></div>
                      </div>

                      <div className="admin-project-stats-row">
                        <span>₹{(proj.raised || 0).toLocaleString('en-IN')} ({percent}%)</span>
                        <span>Goal: ₹{(proj.goal || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: INQUIRIES & HELPLINE
           ============================================================== */}
        {activeTab === 'inquiries' && (
          <div className="admin-content-view">
            <div className="admin-card-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Sender Info</th>
                    <th>Subject & Purpose</th>
                    <th>Message Details</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminData?.contactMessages || []).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-stone-500">
                        No inquiries or helpline messages.
                      </td>
                    </tr>
                  ) : (
                    (adminData?.contactMessages || []).map((msg) => (
                      <tr key={msg.id}>
                        <td>
                          <span className="admin-code-badge">{msg.id}</span>
                        </td>
                        <td>
                          <div className="font-bold text-stone-900">{msg.name}</div>
                          <div className="text-xs text-stone-500">{msg.email}</div>
                          <div className="text-xs text-stone-500">{msg.phone || 'Phone not given'}</div>
                        </td>
                        <td>
                          <div className="font-semibold text-stone-800 text-sm">{msg.subject}</div>
                          <span className="text-xs text-amber-800">{msg.category || 'General'}</span>
                        </td>
                        <td>
                          <p className="text-xs text-stone-600 line-clamp-2 max-w-sm">{msg.message}</p>
                        </td>
                        <td>
                          <span className={`priority-chip ${msg.priority?.toLowerCase() === 'high' ? 'high' : 'normal'}`}>
                            {msg.priority || 'Normal'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-chip ${msg.status?.toLowerCase() === 'resolved' ? 'green' : msg.status?.toLowerCase() === 'in progress' ? 'blue' : 'amber'}`}>
                            {msg.status || 'New'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-row justify-center">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="admin-icon-btn blue"
                              title="Email Reply"
                            >
                              <Mail size={15} />
                            </a>
                            {msg.status !== 'Resolved' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateInquiryStatus(msg.id, 'Resolved')}
                                className="admin-icon-btn green"
                                title="Mark Resolved"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(msg.id)}
                              className="admin-icon-btn red"
                              title="Delete Message"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: WEBSITE CONTENT (CMS)
           ============================================================== */}
        {activeTab === 'cms' && (
          <div className="admin-content-view">
            {/* Sub-Nav Pills */}
            <div className="admin-cms-subnav">
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'hero' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('hero')}
              >
                <span>🏷️ Hero Banner</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'about' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('about')}
              >
                <span>📖 About Story</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'pillars' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('pillars')}
              >
                <span>🏛️ 4 Pillars</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'contact' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('contact')}
              >
                <span>📞 Contact & Helpline</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'brand' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('brand')}
              >
                <span>🛡️ Brand & Legal</span>
              </button>
            </div>

            {/* CMS Form Card */}
            <div className="admin-cms-card">
              <form onSubmit={handleSaveCmsContent}>
                {/* 1. HERO SUBTAB */}
                {cmsSubTab === 'hero' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>Hero Section Banner</h3>
                        <p>Change main headline, tagline, description, and hero background</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleResetCmsToDefaults}
                          className="btn-outline text-xs"
                        >
                          <RotateCcw size={14} /> Reset
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingCms}
                          className="btn-primary text-xs"
                        >
                          <Save size={14} /> {isSavingCms ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <label className="input-sublabel">Top Pill Tag Text</label>
                      <input
                        type="text"
                        value={heroTag}
                        onChange={(e) => setHeroTag(e.target.value)}
                        className="form-input"
                        placeholder="A People-Driven Social Movement"
                      />
                    </div>

                    <div className="form-row-3 mb-3">
                      <div>
                        <label className="input-sublabel">Headline Prefix</label>
                        <input
                          type="text"
                          value={heroTitlePrefix}
                          onChange={(e) => setHeroTitlePrefix(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Headline Gradient Text</label>
                        <input
                          type="text"
                          value={heroTitleGradient}
                          onChange={(e) => setHeroTitleGradient(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Headline Suffix</label>
                        <input
                          type="text"
                          value={heroTitleSuffix}
                          onChange={(e) => setHeroTitleSuffix(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <label className="input-sublabel">Mission Description</label>
                      <textarea
                        rows={3}
                        value={heroDesc}
                        onChange={(e) => setHeroDesc(e.target.value)}
                        className="form-input textarea"
                      ></textarea>
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">Primary CTA Button Label</label>
                        <input
                          type="text"
                          value={heroPrimaryCta}
                          onChange={(e) => setHeroPrimaryCta(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Secondary CTA Button Label</label>
                        <input
                          type="text"
                          value={heroSecondaryCta}
                          onChange={(e) => setHeroSecondaryCta(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <ImageUploadInput
                          label="Hero Banner Image"
                          value={heroImage}
                          onChange={setHeroImage}
                          helpText="Upload banner image for website hero section"
                          previewHeight="120px"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Trust Badge Tagline</label>
                        <input
                          type="text"
                          value={heroTagline}
                          onChange={(e) => setHeroTagline(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ABOUT US SUBTAB */}
                {cmsSubTab === 'about' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>About Us & Movement Story</h3>
                        <p>Customize the narrative, checklist, and experience counters</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary text-xs"
                      >
                        <Save size={14} /> {isSavingCms ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">Section Tag</label>
                        <input
                          type="text"
                          value={aboutTag}
                          onChange={(e) => setAboutTag(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Main Heading</label>
                        <input
                          type="text"
                          value={aboutTitle}
                          onChange={(e) => setAboutTitle(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <label className="input-sublabel">Section Subtitle</label>
                      <input
                        type="text"
                        value={aboutSubtitle}
                        onChange={(e) => setAboutSubtitle(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label className="input-sublabel">Story Heading</label>
                      <input
                        type="text"
                        value={aboutStoryHeading}
                        onChange={(e) => setAboutStoryHeading(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">Story Paragraph 1</label>
                        <textarea
                          rows={3}
                          value={aboutStoryPara1}
                          onChange={(e) => setAboutStoryPara1(e.target.value)}
                          className="form-input textarea"
                        ></textarea>
                      </div>
                      <div>
                        <label className="input-sublabel">Story Paragraph 2</label>
                        <textarea
                          rows={3}
                          value={aboutStoryPara2}
                          onChange={(e) => setAboutStoryPara2(e.target.value)}
                          className="form-input textarea"
                        ></textarea>
                      </div>
                    </div>

                    <div className="form-row-3 mb-3">
                      <div>
                        <label className="input-sublabel">Checklist Point 1</label>
                        <input
                          type="text"
                          value={aboutChecklist1}
                          onChange={(e) => setAboutChecklist1(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Checklist Point 2</label>
                        <input
                          type="text"
                          value={aboutChecklist2}
                          onChange={(e) => setAboutChecklist2(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Checklist Point 3</label>
                        <input
                          type="text"
                          value={aboutChecklist3}
                          onChange={(e) => setAboutChecklist3(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-3 mb-3">
                      <div>
                        <label className="input-sublabel">Years Active</label>
                        <input
                          type="text"
                          value={aboutYears}
                          onChange={(e) => setAboutYears(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Drives Experience Text</label>
                        <input
                          type="text"
                          value={aboutDrives}
                          onChange={(e) => setAboutDrives(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <ImageUploadInput
                          label="About Section Photograph"
                          value={aboutImage}
                          onChange={setAboutImage}
                          helpText="Upload photo for the About story section"
                          previewHeight="120px"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PILLARS SUBTAB */}
                {cmsSubTab === 'pillars' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>4 Core Pillars of Service</h3>
                        <p>Adjust titles and descriptions for RCE Club's 4 cornerstone domains</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary text-xs"
                      >
                        <Save size={14} /> {isSavingCms ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>

                    <div className="form-group mb-4">
                      <label className="input-sublabel">Section Title</label>
                      <input
                        type="text"
                        value={aboutPillarsTitle}
                        onChange={(e) => setAboutPillarsTitle(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pillarsList.map((pillar, idx) => (
                        <div key={pillar.id || idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pillar #{idx + 1}</span>
                          <div className="form-group mt-2">
                            <label className="input-sublabel">Title</label>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                              className="form-input"
                            />
                          </div>
                          <div className="form-group mt-2">
                            <label className="input-sublabel">Description</label>
                            <textarea
                              rows={2}
                              value={pillar.description}
                              onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                              className="form-input textarea"
                            ></textarea>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. CONTACT SUBTAB */}
                {cmsSubTab === 'contact' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>Contact Desk & Helpline</h3>
                        <p>Edit office location, phones, emails, working hours, and emergency helpline</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary text-xs"
                      >
                        <Save size={14} /> {isSavingCms ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>

                    <div className="form-group mb-3">
                      <label className="input-sublabel">Office Address</label>
                      <input
                        type="text"
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">Helpline Phone(s)</label>
                        <input
                          type="text"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Official Email</label>
                        <input
                          type="text"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">Operating Hours</label>
                        <input
                          type="text"
                          value={contactHours}
                          onChange={(e) => setContactHours(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">24/7 Emergency Helpline</label>
                        <input
                          type="text"
                          value={contactEmergency}
                          onChange={(e) => setContactEmergency(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. BRAND SUBTAB */}
                {cmsSubTab === 'brand' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>Brand & Legal Charter</h3>
                        <p>Change organization name, motto, mission statement, and trust registrations</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary text-xs"
                      >
                        <Save size={14} /> {isSavingCms ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">Organization Name</label>
                        <input
                          type="text"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Motto / Subtitle</label>
                        <input
                          type="text"
                          value={brandSubtitle}
                          onChange={(e) => setBrandSubtitle(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group mb-3">
                      <label className="input-sublabel">Footer Mission Statement</label>
                      <textarea
                        rows={2}
                        value={brandMission}
                        onChange={(e) => setBrandMission(e.target.value)}
                        className="form-input textarea"
                      ></textarea>
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">Trust Registration No</label>
                        <input
                          type="text"
                          value={brandTrustReg}
                          onChange={(e) => setBrandTrustReg(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">80G Income Tax Order</label>
                        <input
                          type="text"
                          value={brand80G}
                          onChange={(e) => setBrand80G(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2 mb-3">
                      <div>
                        <label className="input-sublabel">12A Registration</label>
                        <input
                          type="text"
                          value={brand12A}
                          onChange={(e) => setBrand12A(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Trust PAN</label>
                        <input
                          type="text"
                          value={brandPAN}
                          onChange={(e) => setBrandPAN(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingCms}
                    className="btn-primary"
                  >
                    <CheckCircle2 size={16} />
                    <span>{isSavingCms ? 'Saving Changes...' : 'Save & Publish All CMS Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: LIVE COUNTERS
           ============================================================== */}
        {activeTab === 'counters' && (
          <div className="admin-content-view">
            <div className="admin-section-header-bar mb-4">
              <div>
                <h3 className="admin-section-title">Home Page Live Counters</h3>
                <p className="admin-section-subtitle">Real-time stats displayed on the public landing page ribbon</p>
              </div>
            </div>

            <form onSubmit={handleSaveCounters} className="admin-box">
              <div className="admin-counters-grid">
                {counterFields.map((field, idx) => (
                  <div key={idx} className="admin-counter-tile">
                    <div className="counter-tile-header">
                      {field.icon}
                      <span className="counter-tile-label">{field.label}</span>
                    </div>
                    <input
                      type="number"
                      required
                      value={field.val}
                      onChange={(e) => field.setVal(e.target.value)}
                      className="form-input counter-tile-input"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
                <button type="submit" className="btn-primary btn-large">
                  <CheckCircle2 size={18} />
                  <span>Update Live Counters On Website</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==============================================================
            TAB: YOUTUBE VIDEOS SHOWCASE
           ============================================================== */}
        {activeTab === 'videos' && (
          <div className="admin-content-view">
            <div className="admin-section-header-bar">
              <div>
                <h3 className="admin-section-title">YouTube Videos Showcase ({videosList.length})</h3>
                <p className="admin-section-subtitle">
                  Manage YouTube impact videos displayed on the home page cinema theater and side playlist
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVideo(!showAddVideo)}
                className="btn-primary"
              >
                {showAddVideo ? <ChevronUp size={16} /> : <PlusCircle size={16} />}
                <span>{showAddVideo ? 'Close Form' : '+ Add YouTube Video'}</span>
              </button>
            </div>

            {showAddVideo && (
              <div className="admin-box mb-6 border-red-300 bg-red-50/20">
                <h4 className="font-bold text-red-950 mb-4 flex items-center gap-2">
                  <Tv size={18} className="text-red-600" />
                  <span>Add New YouTube Video to Public Showcase</span>
                </h4>
                <form onSubmit={handleAddVideo}>
                  <div className="form-group mb-3">
                    <label className="input-sublabel">YouTube Video Link or ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="form-input"
                    />
                    <span className="text-xs text-stone-500 mt-1 block">
                      Supports full YouTube URLs, short links (youtu.be), embed URLs, or direct 11-character video IDs.
                    </span>

                    {/* Live Preview Card */}
                    {videoUrl.trim() && (
                      <div className="admin-video-preview-banner">
                        {extractYouTubeId(videoUrl) ? (
                          <>
                            <img
                              src={getYouTubeThumbnail(extractYouTubeId(videoUrl)!)}
                              alt="YouTube Preview"
                              className="admin-video-preview-thumb"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div className="flex-1">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
                                <CheckCircle2 size={13} /> Valid YouTube Video (ID: {extractYouTubeId(videoUrl)})
                              </span>
                              <div className="text-xs text-stone-600">
                                This thumbnail and video stream will be featured on the live website cinema screen.
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-amber-700 flex items-center gap-2">
                            <AlertCircle size={15} />
                            <span>Unable to detect video ID. Please check the YouTube link format.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="input-sublabel">Video Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mega Beach Cleanup & Turtle Conservation Drive"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-2 mb-3">
                    <div>
                      <label className="input-sublabel">Duration</label>
                      <input
                        type="text"
                        placeholder="04:15"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="input-sublabel">Location</label>
                      <input
                        type="text"
                        placeholder="Chennai"
                        value={videoLocation}
                        onChange={(e) => setVideoLocation(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={videoFeatured}
                        onChange={(e) => setVideoFeatured(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>Featured Video (Spotlight on Main Cinema Screen)</span>
                    </label>
                  </div>

                  <div className="form-group mb-4">
                    <label className="input-sublabel">Description / Drive Summary</label>
                    <textarea
                      rows={3}
                      placeholder="Brief description of the activity and community impact captured in this video..."
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddVideo(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} />
                      <span>Add to Cinema Showcase</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Video Cards Grid */}
            {videosList.length === 0 ? (
              <div className="admin-box text-center py-12">
                <Tv size={42} className="mx-auto text-stone-400 mb-3" />
                <h4 className="font-bold text-stone-700 text-lg">No YouTube Videos Added Yet</h4>
                <p className="text-sm text-stone-500 mb-4">
                  Add YouTube video links above to feature them on the website's theater showcase.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddVideo(true)}
                  className="btn-primary"
                >
                  <PlusCircle size={16} />
                  <span>Add First YouTube Video</span>
                </button>
              </div>
            ) : (
              <div className="admin-video-grid">
                {videosList.map((v) => (
                  <div key={v.id} className="admin-video-card">
                    <div className="admin-video-thumb-wrap">
                      <img
                        src={getYouTubeThumbnail(v.youtubeId)}
                        alt={v.title}
                        className="admin-video-thumb-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="admin-video-play-watermark">
                        <div className="admin-play-circle-red">
                          <Play size={18} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                      <span className="admin-video-duration-badge">{v.duration || 'Video'}</span>
                      {v.featured && (
                        <span className="admin-video-featured-badge">
                          ★ Main Stage
                        </span>
                      )}
                    </div>

                    <div className="admin-video-info">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-stone-600 font-medium">📍 {v.location || 'Chennai'}</span>
                        {v.duration && <span className="text-xs text-stone-500 font-mono">{v.duration}</span>}
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm mb-1 leading-snug line-clamp-2">
                        {v.title}
                      </h4>

                      <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                        {v.description}
                      </p>

                      <div className="mt-auto pt-3 border-t border-stone-200 flex items-center justify-between">
                        <a
                          href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                        >
                          <ExternalLink size={13} />
                          <span>YouTube</span>
                        </a>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingVideo(v)}
                            className="admin-icon-btn blue"
                            title="Edit Video"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(v.id)}
                            className="admin-icon-btn red"
                            title="Delete Video"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==============================================================
            TAB: PHOTO GALLERY
           ============================================================== */}
        {activeTab === 'gallery' && (
          <div className="admin-content-view">
            <div className="admin-section-header-bar">
              <div>
                <h3 className="admin-section-title">Photo Gallery ({adminData?.gallery?.length || 0})</h3>
                <p className="admin-section-subtitle">Impact drive photographs showcase on the website</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGallery(!showAddGallery)}
                className="btn-primary"
              >
                {showAddGallery ? <ChevronUp size={16} /> : <PlusCircle size={16} />}
                <span>{showAddGallery ? 'Close Form' : '+ Add New Photo'}</span>
              </button>
            </div>

            {showAddGallery && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-amber-700" />
                  <span>Add Photo to Public Impact Gallery</span>
                </h4>
                <form onSubmit={handleAddGalleryItem}>
                  <div className="form-group mb-3">
                    <label className="input-sublabel">Photo Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Miyawaki Urban Forest Drive"
                      value={newGalTitle}
                      onChange={(e) => setNewGalTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-3 mb-3">
                    <div>
                      <label className="input-sublabel">Category</label>
                      <select
                        value={newGalCategory}
                        onChange={(e) => setNewGalCategory(e.target.value)}
                        className="form-input"
                      >
                        <option value="Environment">Environment</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Relief">Relief</option>
                        <option value="Youth">Youth</option>
                        <option value="Empowerment">Empowerment</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-sublabel">Year</label>
                      <input
                        type="text"
                        value={newGalYear}
                        onChange={(e) => setNewGalYear(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Location</label>
                      <input
                        type="text"
                        placeholder="Chennai"
                        value={newGalLocation}
                        onChange={(e) => setNewGalLocation(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <ImageUploadInput
                    label="Gallery Photograph"
                    required
                    value={newGalImage}
                    onChange={setNewGalImage}
                    helpText="Choose image file from your computer (JPG, PNG, WEBP)"
                    previewHeight="180px"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGallery(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-gallery-grid">
              {(adminData?.gallery || []).map((item) => (
                <div key={item.id} className="admin-gallery-card">
                  <img src={item.image} alt={item.title} className="admin-gallery-thumb" />
                  <div className="admin-gallery-info">
                    <div className="flex items-center justify-between mb-1">
                      <span className="event-cat-chip">{item.category}</span>
                      <span className="text-xs text-stone-500">{item.year}</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                    <span className="text-xs text-stone-500 mb-3">{item.location}</span>

                    <div className="mt-auto pt-2 border-t border-stone-200 flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingGallery(item)}
                        className="admin-icon-btn blue"
                        title="Edit Photo"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="admin-icon-btn red"
                        title="Delete Photo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: TESTIMONIAL STORIES
           ============================================================== */}
        {activeTab === 'stories' && (
          <div className="admin-content-view">
            <div className="admin-section-header-bar">
              <div>
                <h3 className="admin-section-title">Voices of Change ({adminData?.stories?.length || 0})</h3>
                <p className="admin-section-subtitle">Beneficiary quotes and volunteer stories featured on the website</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStory(!showAddStory)}
                className="btn-primary"
              >
                {showAddStory ? <ChevronUp size={16} /> : <PlusCircle size={16} />}
                <span>{showAddStory ? 'Close Form' : '+ Add Testimonial'}</span>
              </button>
            </div>

            {showAddStory && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-amber-700" />
                  <span>Publish Beneficiary / Volunteer Testimonial</span>
                </h4>
                <form onSubmit={handleAddStory}>
                  <div className="form-group mb-3">
                    <label className="input-sublabel">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kavitha M."
                      value={newStoryName}
                      onChange={(e) => setNewStoryName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-3 mb-3">
                    <div>
                      <label className="input-sublabel">Role / Association</label>
                      <input
                        type="text"
                        placeholder="Mother of Student"
                        value={newStoryRole}
                        onChange={(e) => setNewStoryRole(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Location</label>
                      <input
                        type="text"
                        placeholder="Tiruvallur"
                        value={newStoryLocation}
                        onChange={(e) => setNewStoryLocation(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Impact Tag</label>
                      <input
                        type="text"
                        placeholder="Education Beneficiary"
                        value={newStoryImpactTag}
                        onChange={(e) => setNewStoryImpactTag(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <ImageUploadInput
                    label="Person / Beneficiary Photo"
                    value={newStoryAvatar}
                    onChange={setNewStoryAvatar}
                    helpText="Upload a photo or avatar from your device"
                    previewHeight="120px"
                  />

                  <div className="form-group mb-4">
                    <label className="input-sublabel">Quote / Experience Statement *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="What impact did RCE bring to this person or community?"
                      value={newStoryQuote}
                      onChange={(e) => setNewStoryQuote(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStory(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} />
                      <span>Publish Story</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-stories-grid">
              {(adminData?.stories || []).map((story) => (
                <div key={story.id} className="admin-story-card">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-12 h-12 rounded-full object-cover border border-amber-300"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm leading-tight">{story.name}</h4>
                        <span className="text-xs text-stone-500 block">{story.role}</span>
                        <span className="text-xs text-amber-800 font-semibold">{story.location}</span>
                      </div>
                    </div>
                    <span className="event-cat-chip mb-2">{story.impactTag}</span>
                    <p className="text-xs text-stone-700 italic mt-2">"{story.quote}"</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-stone-200 flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingStory(story)}
                      className="admin-icon-btn blue"
                      title="Edit Story"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      className="admin-icon-btn red"
                      title="Delete Story"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: NEWSLETTERS
           ============================================================== */}
        {activeTab === 'newsletters' && (
          <div className="admin-content-view">
            <div className="admin-box max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="admin-box-title">Newsletter Email Audience</h3>
                  <p className="text-xs text-stone-500">Subscribers receiving monthly newsletters and campaign notices</p>
                </div>
                <div className="text-sm font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {adminData?.newsletterSubscribers?.length || 0} Subscribers
                </div>
              </div>

              <div className="admin-newsletter-list-box">
                {(adminData?.newsletterSubscribers || []).length === 0 ? (
                  <p className="text-sm text-stone-500 py-4 text-center">No email subscribers yet.</p>
                ) : (
                  (adminData?.newsletterSubscribers || []).map((email, idx) => (
                    <div key={idx} className="admin-newsletter-row">
                      <span className="font-mono text-sm text-stone-800">{email}</span>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Active Subscriber
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==============================================================
          MODAL: EDIT PROJECT
         ============================================================== */}
      {editingProject && (
        <div className="modal-overlay" onClick={() => setEditingProject(null)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="admin-edit-badge"><Edit3 size={12} /> EDIT PROJECT</span>
                <h2 className="modal-title">{editingProject.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingProject(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedProject} className="modal-body p-6">
              <div className="form-group mb-3">
                <label className="input-sublabel">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Relief">Relief & Hunger</option>
                    <option value="Culture & Youth">Culture & Youth</option>
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Goal (₹)</label>
                  <input
                    type="number"
                    value={editingProject.goal}
                    onChange={(e) => setEditingProject({ ...editingProject, goal: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Raised (₹)</label>
                  <input
                    type="number"
                    value={editingProject.raised}
                    onChange={(e) => setEditingProject({ ...editingProject, raised: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Beneficiaries Tag</label>
                  <input
                    type="text"
                    value={editingProject.beneficiaries || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, beneficiaries: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-sublabel">Tagline</label>
                <input
                  type="text"
                  value={editingProject.tagline}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  className="form-input"
                />
              </div>

              <ImageUploadInput
                label="Project Banner Image"
                value={editingProject.image || ''}
                onChange={(url) => setEditingProject({ ...editingProject, image: url })}
                helpText="Upload new banner photo to replace current project image"
                previewHeight="150px"
              />

              <div className="form-group mb-3">
                <label className="input-sublabel">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="form-input textarea"
                ></textarea>
              </div>

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: EDIT EVENT / INITIATIVE
         ============================================================== */}
      {editingEvent && (
        <div className="modal-overlay" onClick={() => setEditingEvent(null)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="admin-edit-badge"><Edit3 size={12} /> EDIT EVENT</span>
                <h2 className="modal-title">{editingEvent.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingEvent(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedEvent} className="modal-body p-6">
              <div className="form-group mb-3">
                <label className="input-sublabel">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Category</label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="₹5 Paadasaalai">₹5 Paadasaalai (Evening Centers)</option>
                    <option value="Kalvi Mela">Kalvi Mela & Science Expo</option>
                    <option value="Teachers Award">Best Good Teacher Award</option>
                    <option value="Kit Distribution">School Kit & Study Aid Distribution</option>
                    <option value="Education Awareness">Education Awareness Marathon</option>
                    <option value="Career Guidance">Higher Education & NEET/JEE Guidance</option>
                    <option value="General Education">General Education Program</option>
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Status</label>
                  <select
                    value={editingEvent.status || 'Conducted'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="Conducted">Conducted / Completed</option>
                    <option value="Ongoing Flagship">Ongoing Flagship Movement</option>
                    <option value="Annual Program">Annual Flagship Program</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Date *</label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Timing / Duration</label>
                  <input
                    type="text"
                    value={editingEvent.time || ''}
                    placeholder="e.g. 05:30 PM - 07:30 PM Daily"
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Students / Beneficiaries Impacted</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,200+ Students Daily"
                    value={editingEvent.studentsImpacted || editingEvent.beneficiaries || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, studentsImpacted: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Location / School / Venue</label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <ImageUploadInput
                label="Event Photograph"
                value={editingEvent.image || ''}
                onChange={(url) => setEditingEvent({ ...editingEvent, image: url })}
                helpText="Upload new photo to replace current event picture"
                previewHeight="160px"
              />

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Lead Coordinator / Team</label>
                  <input
                    type="text"
                    value={editingEvent.leader || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, leader: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Chief Guest / Dignitaries</label>
                  <input
                    type="text"
                    placeholder="Special dignitaries who attended"
                    value={editingEvent.chiefGuest || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, chiefGuest: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-sublabel">Key Highlights (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Free STEM kits, 15 Schools Reached, DEO Attended"
                  value={Array.isArray(editingEvent.highlights) ? editingEvent.highlights.join(', ') : (editingEvent.highlights || '')}
                  onChange={(e) => setEditingEvent({ ...editingEvent, highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="form-input"
                />
              </div>

              <div className="form-group mb-4">
                <label className="input-sublabel">Description & Achievements</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="form-input textarea"
                ></textarea>
              </div>

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: EDIT GALLERY PHOTO
         ============================================================== */}
      {editingGallery && (
        <div className="modal-overlay" onClick={() => setEditingGallery(null)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="admin-edit-badge"><Edit3 size={12} /> EDIT GALLERY PHOTO</span>
                <h2 className="modal-title">{editingGallery.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingGallery(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateGalleryItem} className="modal-body p-6">
              <div className="form-group mb-3">
                <label className="input-sublabel">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={editingGallery.title}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Category</label>
                  <select
                    value={editingGallery.category}
                    onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="Environment">Environment</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Relief">Relief</option>
                    <option value="Youth">Youth</option>
                    <option value="Empowerment">Empowerment</option>
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Year</label>
                  <input
                    type="text"
                    value={editingGallery.year}
                    onChange={(e) => setEditingGallery({ ...editingGallery, year: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-sublabel">Location</label>
                <input
                  type="text"
                  value={editingGallery.location}
                  onChange={(e) => setEditingGallery({ ...editingGallery, location: e.target.value })}
                  className="form-input"
                />
              </div>

              <ImageUploadInput
                label="Gallery Photograph"
                required
                value={editingGallery.image || ''}
                onChange={(url) => setEditingGallery({ ...editingGallery, image: url })}
                helpText="Upload new photo to replace this gallery picture"
                previewHeight="160px"
              />

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setEditingGallery(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: EDIT TESTIMONIAL STORY
         ============================================================== */}
      {editingStory && (
        <div className="modal-overlay" onClick={() => setEditingStory(null)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="admin-edit-badge"><Edit3 size={12} /> EDIT STORY</span>
                <h2 className="modal-title">{editingStory.name}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingStory(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStory} className="modal-body p-6">
              <div className="form-group mb-3">
                <label className="input-sublabel">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingStory.name}
                  onChange={(e) => setEditingStory({ ...editingStory, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Role / Association</label>
                  <input
                    type="text"
                    value={editingStory.role}
                    onChange={(e) => setEditingStory({ ...editingStory, role: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Location</label>
                  <input
                    type="text"
                    value={editingStory.location}
                    onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-sublabel">Impact Tag</label>
                <input
                  type="text"
                  value={editingStory.impactTag}
                  onChange={(e) => setEditingStory({ ...editingStory, impactTag: e.target.value })}
                  className="form-input"
                />
              </div>

              <ImageUploadInput
                label="Person / Beneficiary Photo"
                value={editingStory.avatar || ''}
                onChange={(url) => setEditingStory({ ...editingStory, avatar: url })}
                helpText="Upload new photo or avatar for this testimonial"
                previewHeight="120px"
              />

              <div className="form-group mb-4">
                <label className="input-sublabel">Testimonial Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={editingStory.quote}
                  onChange={(e) => setEditingStory({ ...editingStory, quote: e.target.value })}
                  className="form-input textarea"
                ></textarea>
              </div>

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: EDIT YOUTUBE VIDEO
         ============================================================== */}
      {editingVideo && (
        <div className="modal-overlay" onClick={() => setEditingVideo(null)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="admin-edit-badge"><Edit3 size={12} /> EDIT YOUTUBE VIDEO</span>
                <h2 className="modal-title">{editingVideo.title}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingVideo(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedVideo} className="modal-body p-6">
              <div className="form-group mb-3">
                <label className="input-sublabel">Video Title *</label>
                <input
                  type="text"
                  required
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group mb-3">
                <label className="input-sublabel">YouTube Video Link or ID *</label>
                <input
                  type="text"
                  required
                  value={editingVideo.youtubeUrl || editingVideo.youtubeId}
                  onChange={(e) => {
                    const val = e.target.value;
                    const extracted = extractYouTubeId(val) || val;
                    setEditingVideo({ ...editingVideo, youtubeUrl: val, youtubeId: extracted });
                  }}
                  className="form-input"
                />

                {/* Live Preview in Edit modal */}
                {editingVideo.youtubeId && (
                  <div className="admin-video-preview-banner mt-2">
                    <img
                      src={getYouTubeThumbnail(editingVideo.youtubeId)}
                      alt="Thumbnail Preview"
                      className="admin-video-preview-thumb"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="flex-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
                        <CheckCircle2 size={13} /> Active YouTube ID: {editingVideo.youtubeId}
                      </span>
                      <div className="text-xs text-stone-600">
                        Live thumbnail retrieved from YouTube CDN.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Duration</label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Location</label>
                  <input
                    type="text"
                    value={editingVideo.location}
                    onChange={(e) => setEditingVideo({ ...editingVideo, location: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={editingVideo.featured ?? false}
                    onChange={(e) => setEditingVideo({ ...editingVideo, featured: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Featured Video (Spotlight on Main Cinema Screen)</span>
                </label>
              </div>

              <div className="form-group mb-4">
                <label className="input-sublabel">Description</label>
                <textarea
                  rows={3}
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="form-input textarea"
                ></textarea>
              </div>

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: VOLUNTEER FULL PROFILE DOSSIER
         ============================================================== */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal-content modal-volunteer-detail" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="section-tag gold">VOLUNTEER DOSSIER</span>
                <h2 className="modal-title">{selectedVolunteer.fullName}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedVolunteer(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body p-6">
              <div className="volunteer-profile-hero">
                <div className="volunteer-avatar-circle">
                  {selectedVolunteer.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div className="volunteer-meta-lead">
                  <h3>{selectedVolunteer.fullName}</h3>
                  <div className="text-amber-800 font-semibold">{selectedVolunteer.roleType}</div>
                  <div className="text-xs text-stone-500 font-mono">Reg ID: {selectedVolunteer.id}</div>
                </div>
                <div className="volunteer-blood-pill">
                  {selectedVolunteer.bloodGroup || 'Blood: O+'}
                </div>
              </div>

              <div className="volunteer-detail-grid mt-4">
                <div className="detail-item">
                  <span className="detail-label">Occupation / Profile:</span>
                  <span className="detail-val">{selectedVolunteer.occupation || 'Student'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Organization / College:</span>
                  <span className="detail-val">{selectedVolunteer.department || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">City / Location:</span>
                  <span className="detail-val">{selectedVolunteer.city || 'Chennai'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Primary Email:</span>
                  <span className="detail-val font-mono">{selectedVolunteer.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile Number:</span>
                  <span className="detail-val font-mono">{selectedVolunteer.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Preferred Cause:</span>
                  <span className="detail-val font-semibold text-amber-900">{selectedVolunteer.preferredDomain || 'Field Drives'}</span>
                </div>
              </div>

              <div className="detail-box-full mt-3">
                <span className="detail-label">Skills & Strengths:</span>
                <p className="detail-paragraph">{selectedVolunteer.skills || 'General Volunteering'}</p>
              </div>

              {selectedVolunteer.message && (
                <div className="detail-box-full mt-3">
                  <span className="detail-label">Statement of Motivation:</span>
                  <p className="detail-paragraph italic">"{selectedVolunteer.message}"</p>
                </div>
              )}

              <div className="modal-actions-bar mt-6">
                <a
                  href={`tel:${selectedVolunteer.phone}`}
                  className="btn-outline flex-1"
                >
                  <Phone size={15} /> Call
                </a>
                <a
                  href={`https://wa.me/${selectedVolunteer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1"
                  style={{ background: '#25D366', borderColor: '#25D366', color: '#ffffff' }}
                >
                  WhatsApp
                </a>
                {selectedVolunteer.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateVolunteerStatus(selectedVolunteer.id, 'Approved');
                      setSelectedVolunteer(null);
                    }}
                    className="btn-primary flex-1"
                  >
                    Approve Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: 80G PRINTABLE TAX RECEIPT
         ============================================================== */}
      {selectedDonation && (
        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="modal-content modal-receipt-preview" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="section-tag gold">OFFICIAL 80G RECEIPT</span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedDonation(null)}
              >
                ✕
              </button>
            </div>

            <div className="receipt-certificate-printable" id="printable-receipt">
              <div className="receipt-cert-header">
                <div className="receipt-trust-logo">
                  <img src="/Rce.logo.png" alt="RCE Logo" className="receipt-logo-img" />
                </div>
                <div className="receipt-trust-info">
                  <h2>{brandName || 'RCE SOCIAL SERVICE CLUB CHARITABLE TRUST'}</h2>
                  <p>Registered Public Charitable Trust • Chennai, Tamil Nadu</p>
                  <p className="text-xs text-stone-500">
                    Trust Reg: {brandTrustReg || 'TN/CH/2021/84920'} • PAN: {brandPAN || 'AAATR8492G'} • 12A: {brand12A || 'AAATR8492GE20210'}
                  </p>
                  <div className="receipt-80g-badge">
                    <strong>80G Approval:</strong> {brand80G || 'CIT(E)/CHN/80G/2021-22/A-412'}
                  </div>
                </div>
              </div>

              <div className="receipt-serial-strip">
                <div>
                  <span className="text-xs text-stone-500">Receipt Serial:</span>
                  <div className="font-mono font-bold text-amber-900">{selectedDonation.receiptNo}</div>
                </div>
                <div>
                  <span className="text-xs text-stone-500">Date:</span>
                  <div className="font-bold text-stone-800">
                    {new Date(selectedDonation.timestamp).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="receipt-body-content">
                <p>
                  Received with gratitude from <strong>{selectedDonation.donorName}</strong> (PAN: <strong>{selectedDonation.pan}</strong>), the sum of:
                </p>

                <div className="receipt-amount-display">
                  <span>INR ₹{selectedDonation.amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="receipt-particulars-grid">
                  <div><strong>Cause:</strong> {selectedDonation.cause}</div>
                  <div><strong>Mode:</strong> {selectedDonation.paymentMethod}</div>
                  <div><strong>Txn Ref:</strong> {selectedDonation.transactionId || 'UPI Verified'}</div>
                  <div><strong>Contact:</strong> {selectedDonation.email}</div>
                </div>

                <div className="receipt-tax-clause">
                  <strong>Tax Benefit:</strong> Donations made to {brandName} are eligible for 50% deduction under Section 80G of the Income Tax Act, 1961.
                </div>

                <div className="receipt-sign-row">
                  <div className="receipt-seal-box">
                    <div className="seal-circle">OFFICIAL TRUST SEAL</div>
                  </div>
                  <div className="receipt-signature-box">
                    <div className="sig-line">Dr. V. Sundaresan, Ph.D.</div>
                    <span className="text-xs text-stone-500">Managing Trustee / Club Patron</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions-bar p-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-primary w-full"
              >
                <Printer size={16} /> Print Official 80G Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
