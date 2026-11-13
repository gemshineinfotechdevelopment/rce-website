import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Heart,
  Calendar,
  Layers,
  Mail,
  BarChart3,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Search,
  Download,
  Printer,
  ShieldCheck,
  Lock,
  LogOut,
  ArrowLeft,
  Eye,
  Edit3,
  Image as ImageIcon,
  Quote,
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
  Play,
  Video,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Key,
  EyeOff
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
  submitJoinApplication,
  submitDonation,
  adminLoginApi,
  updateAdminCredentialsApi,
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
import { DonationReceipt } from './DonationReceipt';

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
  | 'settings'
  | 'videos'
  | 'gallery'
  | 'stories';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite, onDataUpdated }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('rce_admin_session') === 'true';
  });
  const [loginUsername, setLoginUsername] = useState(() => {
    try {
      return localStorage.getItem('rce_admin_saved_username') || 'admin';
    } catch {
      return 'admin';
    }
  });
  const [passcode, setPasscode] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Mobile sidebar drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Desktop sidebar collapse state (persisted)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('rce_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rce_admin_sidebar_collapsed', String(sidebarCollapsed));
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  // Sub-navigation for Settings (Website Content CMS + Live Counters + Security)
  const [cmsSubTab, setCmsSubTab] = useState<'hero' | 'about' | 'pillars' | 'contact' | 'brand' | 'counters' | 'security'>('hero');

  // Admin Credentials Security Settings State
  const [currPassword, setCurrPassword] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('admin');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showSecurityPasswords, setShowSecurityPasswords] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [securityNotice, setSecurityNotice] = useState<{ text: string; isError: boolean } | null>(null);

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
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);
  const [showAddDonation, setShowAddDonation] = useState(false);

  // In-app Confirmation Dialog State (replaces browser window.confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmLabel?: string;
    isDanger?: boolean;
    onConfirm: () => Promise<void> | void;
  } | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  // Add Volunteer Modal Form State
  const [volFullName, setVolFullName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volRoleType, setVolRoleType] = useState('Volunteer');
  const [volOccupation, setVolOccupation] = useState('Student');
  const [volDepartment, setVolDepartment] = useState('');
  const [volCollegeId, setVolCollegeId] = useState('');
  const [volYear, setVolYear] = useState('');
  const [volCity, setVolCity] = useState('');
  const [volBloodGroup, setVolBloodGroup] = useState('O+ Positive');
  const [volDomain, setVolDomain] = useState('Child Education & Vidhya Connect');
  const [volAvailability, setVolAvailability] = useState('Weekends (Saturday/Sunday)');
  const [volSkills, setVolSkills] = useState('');
  const [volStatus, setVolStatus] = useState('Approved');
  const [volMessage, setVolMessage] = useState('');
  const [isSubmittingVolunteer, setIsSubmittingVolunteer] = useState(false);

  // Add Donation Modal Form State
  const [donName, setDonName] = useState('');
  const [donEmail, setDonEmail] = useState('');
  const [donPhone, setDonPhone] = useState('');
  const [donPan, setDonPan] = useState('');
  const [donAmount, setDonAmount] = useState('1000');
  const [donCause, setDonCause] = useState('Child Education & Vidhya Connect');
  const [donPaymentMethod, setDonPaymentMethod] = useState('UPI');
  const [donTxnId, setDonTxnId] = useState('');
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);

  // Videos List
  const [videosList, setVideosList] = useState<VideoItem[]>([]);

  // Filter & Search states
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerDeptFilter, setVolunteerDeptFilter] = useState('All');
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState('All');
  const [donationSearch, setDonationSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('All');

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
  const [eventCategory, setEventCategory] = useState('');
  const [eventStudentsImpacted, setEventStudentsImpacted] = useState('1,200+ Students Benefited');
  const [eventImage, setEventImage] = useState('');
  const [eventStatus, setEventStatus] = useState('Conducted');
  const [eventLeader, setEventLeader] = useState('RCE Educational Team');
  const [eventChiefGuest, setEventChiefGuest] = useState('');
  const [eventHighlights, setEventHighlights] = useState('Daily evening tutoring, Spoken English, Free stationery');
  const [eventDesc, setEventDesc] = useState('');
  const [eventFormUrl, setEventFormUrl] = useState('');
  const [eventYoutubeUrl, setEventYoutubeUrl] = useState('');

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
  const [contactEmail, setContactEmail] = useState(DEFAULT_SITE_CONTENT.contact.email);
  const [contactHours, setContactHours] = useState(DEFAULT_SITE_CONTENT.contact.hours);

  // Brand CMS
  const [brandName, setBrandName] = useState(DEFAULT_SITE_CONTENT.brand.name);
  const [brandSubtitle, setBrandSubtitle] = useState(DEFAULT_SITE_CONTENT.brand.subtitle);
  const [brandMission, setBrandMission] = useState(DEFAULT_SITE_CONTENT.brand.mission);
  const [brandTrustReg, setBrandTrustReg] = useState(DEFAULT_SITE_CONTENT.brand.trustReg);
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

      if (data?.adminUsername) {
        setNewAdminUsername(data.adminUsername);
        setLoginUsername(data.adminUsername);
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
      setContactEmail(content.contact.email || '');
      setContactHours(content.contact.hours || '');
    }
    if (content.brand) {
      setBrandName(content.brand.name || '');
      setBrandSubtitle(content.brand.subtitle || '');
      setBrandMission(content.brand.mission || '');
      setBrandTrustReg(content.brand.trustReg || '');
      setBrandPAN(content.brand.pan || '');
    }
  };

  const showNotice = (text: string, isError = false) => {
    setActionNotice({ text, isError });
    setTimeout(() => setActionNotice(null), 2800);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await adminLoginApi(passcode, loginUsername);
      sessionStorage.setItem('rce_admin_session', 'true');
      sessionStorage.setItem('rce_admin_username', res.adminUser || loginUsername);
      localStorage.setItem('rce_admin_saved_username', loginUsername);
      setIsAuthenticated(true);
      showNotice(`Welcome to RCE Club Admin Portal, ${res.adminUser || loginUsername}!`);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or passcode. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityNotice(null);

    if (!currPassword.trim()) {
      setSecurityNotice({ text: 'Please enter your current administrator password.', isError: true });
      return;
    }
    if (!newAdminUsername.trim() || newAdminUsername.trim().length < 3) {
      setSecurityNotice({ text: 'Username must be at least 3 characters long.', isError: true });
      return;
    }
    if (!newAdminPassword || newAdminPassword.length < 4) {
      setSecurityNotice({ text: 'New password must be at least 4 characters long.', isError: true });
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      setSecurityNotice({ text: 'New password and confirmation password do not match.', isError: true });
      return;
    }

    setIsSavingSecurity(true);
    try {
      await updateAdminCredentialsApi({
        currentPasscode: currPassword.trim(),
        newUsername: newAdminUsername.trim(),
        newPasscode: newAdminPassword.trim()
      });
      localStorage.setItem('rce_admin_saved_username', newAdminUsername.trim());
      sessionStorage.setItem('rce_admin_username', newAdminUsername.trim());
      setSecurityNotice({
        text: 'Admin username and password updated successfully! Please use these credentials next time you sign in.',
        isError: false
      });
      showNotice('Admin credentials updated successfully!');
      setCurrPassword('');
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      await loadData();
    } catch (err: any) {
      setSecurityNotice({
        text: err.message || 'Failed to update credentials. Please verify your current password.',
        isError: true
      });
    } finally {
      setIsSavingSecurity(false);
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
          taxExemption80G: '',
          reg12A: '',
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
          phone: '',
          email: contactEmail,
          hours: contactHours,
          emergencyHotline: '',
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
    setConfirmDialog({
      title: 'Reset Website Content',
      message: 'Reset all website content fields to template defaults?',
      confirmLabel: 'Reset Defaults',
      isDanger: true,
      onConfirm: () => {
        populateCmsFields(DEFAULT_SITE_CONTENT);
        showNotice('Loaded default template values. Click "Save Website Details" to apply.');
      },
    });
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

  const handleDeleteGalleryItem = (id: string) => {
    setConfirmDialog({
      title: 'Remove Photo',
      message: 'Remove this photo from the public gallery? This action cannot be undone.',
      confirmLabel: 'Delete Photo',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteGalleryItemApi(id);
          showNotice('Photo deleted from gallery');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Failed to delete photo', true);
        }
      },
    });
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

  const handleDeleteStory = (id: string) => {
    setConfirmDialog({
      title: 'Delete Testimonial',
      message: 'Are you sure you want to delete this testimonial story?',
      confirmLabel: 'Delete Story',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteClubStoryApi(id);
          showNotice('Story removed from website');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Failed to delete story', true);
        }
      },
    });
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

  const handleDeleteVideo = (id: string) => {
    setConfirmDialog({
      title: 'Remove Video',
      message: 'Remove this YouTube video from the website showcase?',
      confirmLabel: 'Delete Video',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteClubVideoApi(id);
          showNotice('Video removed from showcase');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Failed to delete video', true);
        }
      },
    });
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

  const handleDeleteProject = (id: string) => {
    setConfirmDialog({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      confirmLabel: 'Delete Project',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteClubProject(id);
          showNotice('Project removed from website');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Delete failed', true);
        }
      },
    });
  };

  const isEventScheduleOver = (dateStr: string, status?: string) => {
    if (!dateStr && !status) return false;
    const st = (status || '').toLowerCase().trim();
    if (st === 'conducted' || st === 'completed') return true;
    if (st === 'ongoing flagship') return false;
    if (!dateStr) return false;
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const eventEnd = new Date(year, month, day, 23, 59, 59, 999).getTime();
        return eventEnd < Date.now();
      }
      const d = new Date(dateStr).getTime();
      return !isNaN(d) && d < Date.now();
    } catch {
      return false;
    }
  };

  // Events Handlers
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showNotice('Please enter an event title', true);
      return;
    }
    const coverPhoto = eventImage.trim();
    const finalImages = coverPhoto ? [coverPhoto] : [];
    try {
      await createClubEvent({
        title: eventTitle.trim(),
        date: eventDate || new Date().toISOString().slice(0, 10),
        time: eventTime,
        location: eventLocation || 'Sivakasi & Rural Hubs, Tamil Nadu',
        category: eventCategory.trim() || 'Educational Initiative',
        status: eventStatus || 'Conducted',
        studentsImpacted: eventStudentsImpacted || '1,000+ Students Benefited',
        image: coverPhoto,
        images: finalImages,
        highlights: eventHighlights
          ? eventHighlights.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Educational initiative', 'Volunteer led'],
        leader: eventLeader || 'RCE Educational Team',
        chiefGuest: eventChiefGuest,
        slotsTotal: 100,
        description: eventDesc || 'Educational program conducted by Right Club for Education.',
        formUrl: eventFormUrl.trim(),
        youtubeUrl: eventYoutubeUrl.trim(),
      });
      showNotice('Event uploaded and published to the live website!');
      setEventTitle('');
      setEventCategory('');
      setEventDesc('');
      setEventFormUrl('');
      setEventYoutubeUrl('');
      setEventChiefGuest('');
      setEventImage('');
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

  const handleDeleteEvent = (id: string) => {
    setConfirmDialog({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event/drive? This action cannot be undone.',
      confirmLabel: 'Delete Event',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteClubEvent(id);
          showNotice('Drive removed from live site');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Delete failed', true);
        }
      },
    });
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

  const handleDeleteVolunteer = (id: string) => {
    setConfirmDialog({
      title: 'Delete Volunteer Record',
      message: `Permanently remove volunteer record ${id}? This action cannot be undone.`,
      confirmLabel: 'Delete Volunteer',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteVolunteerApi(id);
          showNotice('Volunteer record deleted');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Delete failed', true);
        }
      },
    });
  };

  const handleAddVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volFullName.trim() || !volEmail.trim() || !volPhone.trim()) {
      showNotice('Please enter Full Name, Email, and Contact Number', true);
      return;
    }
    setIsSubmittingVolunteer(true);
    try {
      await submitJoinApplication({
        fullName: volFullName.trim(),
        email: volEmail.trim(),
        phone: volPhone.trim(),
        roleType: volRoleType,
        occupation: volOccupation,
        department: volDepartment.trim() || 'General',
        collegeId: volCollegeId.trim() || 'N/A',
        yearOfStudy: volYear.trim() || 'N/A',
        bloodGroup: volBloodGroup,
        city: volCity.trim() || 'Sivakasi',
        skills: volSkills.trim() || 'Community Outreach',
        availability: volAvailability,
        preferredDomain: volDomain,
        message: volMessage.trim(),
        status: volStatus,
      });
      showNotice('Volunteer added successfully!');
      setVolFullName('');
      setVolEmail('');
      setVolPhone('');
      setVolDepartment('');
      setVolCollegeId('');
      setVolYear('');
      setVolCity('');
      setVolSkills('');
      setVolMessage('');
      setShowAddVolunteer(false);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to add volunteer', true);
    } finally {
      setIsSubmittingVolunteer(false);
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

  const handleDeleteInquiry = (id: string) => {
    setConfirmDialog({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to permanently delete this inquiry message?',
      confirmLabel: 'Delete Inquiry',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteInquiryApi(id);
          showNotice('Inquiry removed');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Delete failed', true);
        }
      },
    });
  };

  // Donation Actions
  const handleDeleteDonation = (receiptNo: string) => {
    setConfirmDialog({
      title: 'Delete Donation Record',
      message: `Void and permanently delete donation record ${receiptNo}?`,
      confirmLabel: 'Delete Record',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteDonationApi(receiptNo);
          showNotice('Donation record deleted');
          await loadData();
          if (onDataUpdated) onDataUpdated();
        } catch (err: any) {
          showNotice(err.message || 'Delete failed', true);
        }
      },
    });
  };

  const handleAddDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmt = Number(donAmount);
    if (!donName.trim() || !donEmail.trim() || !numericAmt || numericAmt < 50) {
      showNotice('Please enter Donor Name, Email, and valid Amount (minimum ₹50)', true);
      return;
    }
    setIsSubmittingDonation(true);
    try {
      await submitDonation({
        donorName: donName.trim(),
        email: donEmail.trim(),
        phone: donPhone.trim() || 'Not provided',
        pan: donPan.trim().toUpperCase(),
        amount: numericAmt,
        cause: donCause || 'Child Education & Vidhya Connect',
        paymentMethod: donPaymentMethod,
        transactionId: donTxnId.trim(),
      });
      showNotice('Donation recorded and receipt generated!');
      setDonName('');
      setDonEmail('');
      setDonPhone('');
      setDonPan('');
      setDonAmount('1000');
      setDonTxnId('');
      setShowAddDonation(false);
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to add donation', true);
    } finally {
      setIsSubmittingDonation(false);
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
    link.setAttribute('download', `RCE_Donations_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
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

  // Filtered Events List
  const filteredEvents = (adminData?.events || []).filter((ev) => {
    const q = eventSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      (ev.location && ev.location.toLowerCase().includes(q)) ||
      (ev.category && ev.category.toLowerCase().includes(q)) ||
      (ev.leader && ev.leader.toLowerCase().includes(q)) ||
      (ev.chiefGuest && ev.chiefGuest.toLowerCase().includes(q)) ||
      (ev.date && ev.date.includes(q)) ||
      (ev.description && ev.description.toLowerCase().includes(q));

    const matchCategory =
      eventCategoryFilter === 'All' ||
      (ev.category && ev.category.toLowerCase() === eventCategoryFilter.toLowerCase());

    return matchSearch && matchCategory;
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
            <div className="form-group mb-3">
              <label className="input-sublabel">Admin Username</label>
              <div className="admin-input-icon-box">
                <Users size={18} className="text-amber-600" />
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="form-input flex-1"
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="input-sublabel">Security Password</label>
              <div className="admin-input-icon-box">
                <Lock size={18} className="text-amber-600" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="p-1 text-stone-400 hover:text-stone-700 bg-transparent border-none cursor-pointer flex items-center justify-center"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
    <div className={`admin-standalone-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Floating Toast Notification (Fixed overlay - will never disturb layout) */}
      {actionNotice && (
        <div
          className={`admin-floating-notice ${actionNotice.isError ? 'error' : 'success'}`}
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 99999 }}
        >
          {actionNotice.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span className="flex-1 text-sm">{actionNotice.text}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-white/80 hover:text-white p-0.5 ml-2 cursor-pointer bg-transparent border-none flex items-center"
            title="Dismiss notice"
          >
            <X size={15} />
          </button>
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
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-group">
            <div
              className="admin-sidebar-logo-wrap"
              onClick={() => {
                if (sidebarCollapsed) setSidebarCollapsed(false);
              }}
              title={sidebarCollapsed ? 'Click to expand sidebar' : undefined}
              role={sidebarCollapsed ? 'button' : undefined}
            >
              <img src="/Rce.logo.png" alt="RCE Logo" className="admin-sidebar-logo-img" />
            </div>
            {!sidebarCollapsed && (
              <div className="admin-sidebar-text">
                <h3>{brandName || 'RCE'}</h3>
                <span className="admin-brand-portal-pill">ADMIN PORTAL</span>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button
              type="button"
              className="admin-sidebar-collapse-btn"
              onClick={() => setSidebarCollapsed(true)}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          )}

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
            title={sidebarCollapsed ? 'Overview' : undefined}
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
            title={sidebarCollapsed ? `Volunteers (${pendingVolunteersCount > 0 ? `${pendingVolunteersCount} Pending` : adminData?.volunteerApplications?.length || 0})` : undefined}
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
            title={sidebarCollapsed ? `Donations (${adminData?.donationRecords?.length || 0})` : undefined}
          >
            <div className="flex items-center gap-3">
              <Heart size={18} />
              <span>Donations</span>
            </div>
            <span className="admin-badge-count">{adminData?.donationRecords?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); setMobileSidebarOpen(false); }}
            title={sidebarCollapsed ? `Events (${adminData?.events?.length || 0})` : undefined}
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
            title={sidebarCollapsed ? `Projects (${adminData?.projects?.length || 0})` : undefined}
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
            title={sidebarCollapsed ? `Inquiries ${newInquiriesCount > 0 ? `(${newInquiriesCount} New)` : ''}` : undefined}
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
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
            title={sidebarCollapsed ? 'Website Settings & Counters' : undefined}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('videos'); setMobileSidebarOpen(false); }}
            title={sidebarCollapsed ? `YouTube Videos (${videosList.length})` : undefined}
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
            title={sidebarCollapsed ? `Photo Gallery (${adminData?.gallery?.length || 0})` : undefined}
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
            title={sidebarCollapsed ? `Testimonials (${adminData?.stories?.length || 0})` : undefined}
          >
            <div className="flex items-center gap-3">
              <Quote size={18} />
              <span>Testimonials</span>
            </div>
            <span className="admin-badge-count">{adminData?.stories?.length || 0}</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            onClick={() => { setMobileSidebarOpen(false); onBackToWebsite(); }}
            className="btn-outline w-full mb-2 admin-switch-website-btn"
            title={sidebarCollapsed ? 'View Live Website' : undefined}
          >
            <ArrowLeft size={16} />
            <span>View Live Website</span>
          </button>

          <button
            type="button"
            onClick={() => { setMobileSidebarOpen(false); handleLogout(); }}
            className="admin-logout-btn w-full"
            title={sidebarCollapsed ? 'Log Out' : undefined}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className={`admin-main-viewport ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
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
            <button
              type="button"
              className="admin-desktop-sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            </button>
            <div className="admin-topbar-title">
              <h2>
                {activeTab === 'overview' && 'Executive Performance Overview'}
                {activeTab === 'settings' && 'Website Settings & Live Counters'}
                {activeTab === 'videos' && 'YouTube Videos & Impact Media Showcase'}
                {activeTab === 'gallery' && 'Public Photo Gallery'}
                {activeTab === 'stories' && 'Voices of Change & Stories'}
                {activeTab === 'events' && 'Events'}
                {activeTab === 'projects' && 'Flagship Causes & Projects'}
                {activeTab === 'volunteers' && 'Volunteer & Member Registry'}
                {activeTab === 'donations' && 'Donations & Official Receipts'}
                {activeTab === 'inquiries' && 'Citizen Messages & Inquiries'}
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
            <div className="admin-overview-grid">
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
                    <Calendar size={20} className="text-emerald-700" />
                    <div>
                      <strong>Schedule a Drive</strong>
                      <p>Publish upcoming community, health, or clean-up drives</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="admin-action-tile"
                  >
                    <Settings size={20} className="text-blue-700" />
                    <div>
                      <strong>Website Settings & Counters</strong>
                      <p>Edit hero texts, about story, contact info, and live counters</p>
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
                        <p>Contributed to <i>{d.cause}</i> • #{d.receiptNo}</p>
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
                  {Array.from(
                    new Set(
                      (adminData?.volunteerApplications || [])
                        .map((v) => (v.department || '').trim())
                        .filter(Boolean)
                    )
                  ).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
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
                  onClick={() => setShowAddVolunteer(true)}
                  className="btn-primary btn-admin-top"
                  title="Add Volunteer"
                >
                  <UserPlus size={15} />
                  <span>Add Volunteer</span>
                </button>

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
                        <td className="whitespace-nowrap">
                          <span className="admin-code-badge">{vol.id}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="font-bold text-stone-900 text-xs whitespace-nowrap">{vol.fullName}</div>
                          <div className="text-[11px] text-stone-500 whitespace-nowrap">{vol.email}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="text-xs font-semibold text-stone-800 whitespace-nowrap">
                            {vol.occupation || 'Student'} <span className="text-stone-400 font-normal">•</span> <span className="text-[11px] text-stone-500">{vol.department || vol.city || 'General'}</span>
                          </div>
                          <span className="text-[10px] text-amber-800 font-medium whitespace-nowrap">{vol.roleType}</span>
                        </td>
                        <td className="text-center whitespace-nowrap">
                          <span className="blood-group-chip">{vol.bloodGroup || 'O+'}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="text-xs font-semibold text-stone-900 whitespace-nowrap">
                            <span>{vol.phone}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className="text-xs font-bold text-amber-900 whitespace-nowrap" title={vol.skills || vol.preferredDomain}>
                            {vol.preferredDomain || 'Field Drives'}
                          </span>
                        </td>
                        <td className="text-center whitespace-nowrap">
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
                        <td className="whitespace-nowrap">
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
            TAB: DONATIONS & RECEIPTS
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
                <button
                  type="button"
                  onClick={() => setShowAddDonation(true)}
                  className="btn-primary btn-admin-top"
                  title="Add Donation"
                >
                  <Heart size={15} />
                  <span>Add Donation</span>
                </button>

                <button
                  type="button"
                  onClick={exportDonationsCSV}
                  className="btn-outline btn-admin-top"
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
                    <th>Receipt No</th>
                    <th>Donor Name</th>
                    <th>Contact Phone</th>
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
                      <td colSpan={9} className="text-center py-8 text-stone-500">
                        No donation records found.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d) => (
                      <tr key={d.receiptNo}>
                        <td className="whitespace-nowrap">
                          <span className="admin-code-badge">{d.receiptNo}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold block whitespace-nowrap">Verified Receipt</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="font-bold text-stone-900 text-xs whitespace-nowrap">{d.donorName}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                            <Mail size={11} className="text-amber-700 flex-shrink-0" />
                            <span>{d.email || 'No email'}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="text-xs font-semibold text-stone-900 whitespace-nowrap">
                            <span>{d.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="text-sm font-extrabold text-amber-900 whitespace-nowrap">
                            ₹{d.amount.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className="admin-pan-chip">{d.pan || 'N/A'}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className="text-xs font-semibold text-stone-800 whitespace-nowrap">{d.cause}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="text-xs font-semibold text-stone-700 whitespace-nowrap">{d.paymentMethod}</div>
                          <div className="text-[10px] font-mono text-stone-400 whitespace-nowrap">{d.transactionId || 'UPI Verified'}</div>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className="text-xs text-stone-500 whitespace-nowrap">
                            {new Date(d.timestamp).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="admin-action-row justify-center">
                            <button
                              type="button"
                              onClick={() => setSelectedDonation(d)}
                              className="admin-icon-btn blue"
                              title="Print Donation Receipt"
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
                {showAddEvent ? <ChevronUp size={16} /> : <Calendar size={16} />}
                <span>{showAddEvent ? 'Close Form' : 'Add Event'}</span>
              </button>
            </div>

            {/* Expandable Add Event Form */}
            {showAddEvent && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-amber-700" />
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
                      <input
                        type="text"
                        required
                        placeholder="Type category (e.g. ₹5 Paadasaalai, Kalvi Mela...)"
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className="form-input"
                        list="event-category-suggestions"
                      />
                      <datalist id="event-category-suggestions">
                        <option value="₹5 Paadasaalai" />
                        <option value="Kalvi Mela" />
                        <option value="Teachers Award" />
                        <option value="Kit Distribution" />
                        <option value="Education Awareness" />
                        <option value="Career Guidance" />
                        <option value="General Education" />
                      </datalist>
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
                    helpText="Upload photograph for this event from your device (JPG, PNG, WEBP)"
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

                  <div className="form-row-2 mb-3">
                    <div>
                      <label className="input-sublabel">Key Highlights / Milestones (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. 15 Schools Reached, Free Notebook Bundles, Spoken English Coaching"
                        value={eventHighlights}
                        onChange={(e) => setEventHighlights(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Registration / Form Link (Optional)</label>
                      <input
                        type="url"
                        placeholder="Paste form link (e.g. https://forms.gle/...)"
                        value={eventFormUrl}
                        onChange={(e) => setEventFormUrl(e.target.value)}
                        className="form-input"
                      />
                      {eventFormUrl && eventFormUrl.trim() && (
                        <span className={`text-[11px] mt-1 block font-semibold ${isEventScheduleOver(eventDate, eventStatus) ? "text-amber-800" : "text-emerald-700"}`}>
                          {isEventScheduleOver(eventDate, eventStatus)
                            ? "⚠️ Schedule முடிந்துவிட்டதால் முகப்புப் பக்கத்தில் 'Form Closed / Disabled' என்று தோன்றும்."
                            : "✅ Schedule முடிவடையாததால் முகப்புப் பக்கத்தில் படிவம் Active-ஆக தோன்றும்."}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="input-sublabel flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <Video size={14} className="text-red-600" />
                        <span>YouTube Video Coverage Link (Optional / விருப்பப்பட்டால்)</span>
                      </span>
                      {eventYoutubeUrl && extractYouTubeId(eventYoutubeUrl) && (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Video ID: {extractYouTubeId(eventYoutubeUrl)}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)"
                        value={eventYoutubeUrl}
                        onChange={(e) => setEventYoutubeUrl(e.target.value)}
                        className="form-input pr-10"
                      />
                      {eventYoutubeUrl && (
                        <button
                          type="button"
                          onClick={() => setEventYoutubeUrl('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs px-1.5 py-0.5 rounded"
                          title="Clear link"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {eventYoutubeUrl && extractYouTubeId(eventYoutubeUrl) && (
                      <div className="mt-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-3">
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(eventYoutubeUrl)}/mqdefault.jpg`}
                          alt="YouTube preview"
                          className="w-28 h-16 object-cover rounded-lg border border-stone-300 flex-shrink-0 shadow-sm"
                        />
                        <div className="text-xs text-stone-600">
                          <strong className="text-stone-900 block font-semibold">✅ YouTube Video Attached to Event</strong>
                          <span>This video player will be embedded directly in the event details modal on the live website.</span>
                        </div>
                      </div>
                    )}
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

            {/* Search & Category Filter Toolbar */}
            <div className="admin-toolbar mb-4">
              <div className="admin-search-wrapper">
                <Search size={18} className="text-stone-400" />
                <input
                  type="text"
                  placeholder="Search events by Title, Year/Date, Category, Venue, Guests..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="admin-search-input"
                />
                {eventSearch && (
                  <button
                    type="button"
                    onClick={() => setEventSearch('')}
                    className="text-stone-400 hover:text-stone-600 mr-2 p-1"
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="admin-filter-group">
                <select
                  value={eventCategoryFilter}
                  onChange={(e) => setEventCategoryFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="All">All Categories</option>
                  {Array.from(new Set((adminData?.events || []).map((e) => e.category?.trim()).filter(Boolean))).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="admin-stat-pill">
                  Showing: <strong>{filteredEvents.length}</strong> / {adminData?.events?.length || 0}
                </div>
              </div>
            </div>

            {/* Empty Search Results Notice */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-stone-500 bg-amber-50/40 rounded-xl border border-amber-200/70 p-6 my-4">
                <Search size={36} className="mx-auto text-amber-700/60 mb-2" />
                <h4 className="font-bold text-amber-950 text-base">No events found matching "{eventSearch}"</h4>
                <p className="text-sm text-stone-600 mt-1">Try another keyword, year, or clear your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setEventSearch('');
                    setEventCategoryFilter('All');
                  }}
                  className="btn-outline text-xs mt-3 px-3.5 py-1.5"
                >
                  Reset Search & Filters
                </button>
              </div>
            )}

            {/* Events Cards Grid */}
            <div className="admin-cards-grid">
              {filteredEvents.map((ev) => (
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
                    <span className="meta-pill bg-amber-50 text-amber-900 font-semibold" title="Attached event photos">
                      📸 {Array.isArray(ev.images) && ev.images.length > 0 ? ev.images.length : (ev.image ? 1 : 0)} photos
                    </span>
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

                                    <div className="admin-card-footer-corners">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(ev)}
                      className="admin-corner-btn edit"
                      title="Edit Event"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <span className="text-xs text-stone-500 truncate max-w-[150px]">{ev.leader ? `Lead: ${ev.leader}` : 'RCE Team'}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="admin-corner-btn delete"
                      title="Delete Event"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
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
                {showAddProject ? <ChevronUp size={16} /> : <Layers size={16} />}
                <span>{showAddProject ? 'Close Form' : 'Add Project'}</span>
              </button>
            </div>

            {/* Expandable Add Project Form */}
            {showAddProject && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <Layers size={18} className="text-amber-700" />
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

                      <div className="admin-card-footer-corners">
                        <button
                          type="button"
                          onClick={() => setEditingProject(proj)}
                          className="admin-corner-btn edit"
                          title="Edit Project"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="admin-corner-btn delete"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: INQUIRIES
           ============================================================== */}
        {activeTab === 'inquiries' && (
          <div className="admin-content-view">
            <div className="admin-card-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Sender Name</th>
                    <th>Contact Phone</th>
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
                      <td colSpan={8} className="text-center py-8 text-stone-500">
                        No citizen messages or inquiries found.
                      </td>
                    </tr>
                  ) : (
                    (adminData?.contactMessages || []).map((msg) => (
                      <tr key={msg.id}>
                        <td className="whitespace-nowrap">
                          <span className="admin-code-badge">{msg.id}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="font-bold text-stone-900 text-xs whitespace-nowrap">{msg.name}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                            <Mail size={11} className="text-amber-700 flex-shrink-0" />
                            <a href={`mailto:${msg.email}`} className="hover:underline hover:text-amber-900">
                              {msg.email}
                            </a>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="text-xs font-semibold text-stone-900 whitespace-nowrap">
                            <span>{msg.phone || 'No phone'}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap">
                          <div className="font-semibold text-stone-800 text-xs whitespace-nowrap">{msg.subject}</div>
                          <span className="text-[10px] text-amber-800 whitespace-nowrap">{msg.category || 'General'}</span>
                        </td>
                        <td className="whitespace-nowrap">
                          <p className="text-xs text-stone-600 truncate max-w-[220px] whitespace-nowrap" title={msg.message}>{msg.message}</p>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className={`priority-chip ${msg.priority?.toLowerCase() === 'high' ? 'high' : 'normal'}`}>
                            {msg.priority || 'Normal'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className={`status-chip ${msg.status?.toLowerCase() === 'resolved' ? 'green' : msg.status?.toLowerCase() === 'in progress' ? 'blue' : 'amber'}`}>
                            {msg.status || 'New'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
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
            TAB: SETTINGS (WEBSITE CONTENT CMS & LIVE COUNTERS)
           ============================================================== */}
        {activeTab === 'settings' && (
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
                <span>📞 Contact & Office</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'brand' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('brand')}
              >
                <span>🛡️ Brand & Legal</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'counters' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('counters')}
              >
                <span>📊 Live Counters</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'security' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('security')}
              >
                <span>🔐 Admin Credentials</span>
              </button>
            </div>

            {cmsSubTab === 'counters' ? (
              <div className="admin-box">
                <div className="admin-section-header-bar mb-4">
                  <div>
                    <h3 className="admin-section-title">Home Page Live Counters</h3>
                    <p className="admin-section-subtitle">Real-time stats displayed on the public landing page ribbon</p>
                  </div>
                </div>

                <form onSubmit={handleSaveCounters}>
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
            ) : cmsSubTab === 'security' ? (
              <div className="admin-box">
                <div className="admin-section-header-bar mb-4">
                  <div>
                    <h3 className="admin-section-title flex items-center gap-2">
                      <ShieldCheck size={20} className="text-amber-600" />
                      <span>Admin Account & Login Security</span>
                    </h3>
                    <p className="admin-section-subtitle">
                      Change the username and password used to access this Admin Portal
                    </p>
                  </div>
                </div>

                {securityNotice && (
                  <div className={`status-alert-banner ${securityNotice.isError ? 'error' : 'success'} mb-4`}>
                    {securityNotice.isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                    <span>{securityNotice.text}</span>
                  </div>
                )}

                <div className="admin-security-info-box mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-700">
                      <Lock size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        Active Administrator Account
                      </div>
                      <div className="text-xs text-stone-600 mt-0.5">
                        Current Login Username: <span className="font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded font-mono">{adminData?.adminUsername || newAdminUsername || 'admin'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateCredentials} className="admin-security-form max-w-xl">
                  <div className="form-group mb-4">
                    <label className="input-sublabel">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="admin-input-icon-box">
                      <Key size={18} className="text-amber-600" />
                      <input
                        type={showSecurityPasswords ? 'text' : 'password'}
                        required
                        placeholder="Enter current administrator password"
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        className="form-input flex-1"
                      />
                    </div>
                    <span className="text-xs text-stone-500 mt-1 block">Default initial password is <code className="bg-stone-100 px-1.5 py-0.5 rounded text-amber-800 font-mono">rce@admin</code></span>
                  </div>

                  <hr className="my-4 border-amber-200/50" />

                  <div className="form-group mb-4">
                    <label className="input-sublabel">
                      New Admin Username <span className="text-red-500">*</span>
                    </label>
                    <div className="admin-input-icon-box">
                      <Users size={18} className="text-amber-600" />
                      <input
                        type="text"
                        required
                        minLength={3}
                        placeholder="Enter new administrator username"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        className="form-input flex-1"
                      />
                    </div>
                    <span className="text-xs text-stone-500 mt-1 block">Username to sign in with (minimum 3 characters)</span>
                  </div>

                  <div className="form-group mb-4">
                    <label className="input-sublabel">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="admin-input-icon-box">
                      <Lock size={18} className="text-amber-600" />
                      <input
                        type={showSecurityPasswords ? 'text' : 'password'}
                        required
                        minLength={4}
                        placeholder="Enter new strong password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="form-input flex-1"
                      />
                    </div>
                    <span className="text-xs text-stone-500 mt-1 block">Minimum 4 characters</span>
                  </div>

                  <div className="form-group mb-4">
                    <label className="input-sublabel">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="admin-input-icon-box">
                      <Lock size={18} className="text-amber-600" />
                      <input
                        type={showSecurityPasswords ? 'text' : 'password'}
                        required
                        minLength={4}
                        placeholder="Re-enter new password to confirm"
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        className="form-input flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    <button
                      type="button"
                      onClick={() => setShowSecurityPasswords(!showSecurityPasswords)}
                      className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0"
                    >
                      {showSecurityPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                      <span>{showSecurityPasswords ? 'Hide passwords' : 'Show passwords'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingSecurity}
                      className="btn-primary"
                    >
                      <Save size={16} />
                      <span>{isSavingSecurity ? 'Saving Changes...' : 'Update Admin Credentials'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
            /* CMS Form Card */
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
                        <h3>Contact Desk & Office</h3>
                        <p>Edit office location, official email, and operating hours</p>
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
                        <label className="input-sublabel">Official Email</label>
                        <input
                          type="text"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Operating Hours</label>
                        <input
                          type="text"
                          value={contactHours}
                          onChange={(e) => setContactHours(e.target.value)}
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
            )}
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
                {showAddVideo && <ChevronUp size={16} />}
                <span>{showAddVideo ? 'Close Form' : 'Add YouTube Video'}</span>
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
                  <Tv size={16} />
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

                      <div className="admin-card-footer-corners mt-auto">
                        <button
                          type="button"
                          onClick={() => setEditingVideo(v)}
                          className="admin-corner-btn edit"
                          title="Edit Video"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <a
                          href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1"
                        >
                          <ExternalLink size={13} />
                          <span>Watch</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(v.id)}
                          className="admin-corner-btn delete"
                          title="Delete Video"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
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
                {showAddGallery && <ChevronUp size={16} />}
                <span>{showAddGallery ? 'Close Form' : 'Add New Photo'}</span>
              </button>
            </div>

            {showAddGallery && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-amber-700" />
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

                    <div className="admin-card-footer-corners mt-auto">
                      <button
                        type="button"
                        onClick={() => setEditingGallery(item)}
                        className="admin-corner-btn edit"
                        title="Edit Photo"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="admin-corner-btn delete"
                        title="Delete Photo"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
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
                {showAddStory && <ChevronUp size={16} />}
                <span>{showAddStory ? 'Close Form' : 'Add Testimonial'}</span>
              </button>
            </div>

            {showAddStory && (
              <div className="admin-box mb-6 border-amber-300 bg-amber-50/30">
                <h4 className="font-bold text-amber-950 mb-4 flex items-center gap-2">
                  <Quote size={18} className="text-amber-700" />
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

                  <div className="admin-card-footer-corners mt-auto">
                    <button
                      type="button"
                      onClick={() => setEditingStory(story)}
                      className="admin-corner-btn edit"
                      title="Edit Story"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      className="admin-corner-btn delete"
                      title="Delete Story"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
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
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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
                  <input
                    type="text"
                    required
                    placeholder="Type category (e.g. ₹5 Paadasaalai, Kalvi Mela...)"
                    value={editingEvent.category || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="form-input"
                    list="event-category-suggestions"
                  />
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
                onChange={(url) => setEditingEvent({ ...editingEvent, image: url, images: url ? [url] : [] })}
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

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Key Highlights (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Free STEM kits, 15 Schools Reached, DEO Attended"
                    value={Array.isArray(editingEvent.highlights) ? editingEvent.highlights.join(', ') : (editingEvent.highlights || '')}
                    onChange={(e) => setEditingEvent({ ...editingEvent, highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Registration / Form Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="Paste form link (e.g. https://forms.gle/...)"
                    value={editingEvent.formUrl || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, formUrl: e.target.value })}
                    className="form-input"
                  />
                  {editingEvent.formUrl && editingEvent.formUrl.trim() && (
                    <span className={`text-[11px] mt-1 block font-semibold ${isEventScheduleOver(editingEvent.date, editingEvent.status) ? "text-amber-800" : "text-emerald-700"}`}>
                      {isEventScheduleOver(editingEvent.date, editingEvent.status)
                        ? "⚠️ Schedule முடிந்துவிட்டதால் முகப்புப் பக்கத்தில் 'Form Closed / Disabled' என்று தோன்றும்."
                        : "✅ Schedule முடிவடையாததால் முகப்புப் பக்கத்தில் படிவம் Active-ஆக தோன்றும்."}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-sublabel flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-stone-800">
                    <Video size={14} className="text-red-600" />
                    <span>YouTube Video Coverage Link (Optional / விருப்பப்பட்டால்)</span>
                  </span>
                  {editingEvent.youtubeUrl && extractYouTubeId(editingEvent.youtubeUrl) && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Video ID: {extractYouTubeId(editingEvent.youtubeUrl)}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)"
                    value={editingEvent.youtubeUrl || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, youtubeUrl: e.target.value })}
                    className="form-input pr-10"
                  />
                  {editingEvent.youtubeUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, youtubeUrl: '' })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs px-1.5 py-0.5 rounded"
                      title="Clear link"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {editingEvent.youtubeUrl && extractYouTubeId(editingEvent.youtubeUrl) && (
                  <div className="mt-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-3">
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeId(editingEvent.youtubeUrl)}/mqdefault.jpg`}
                      alt="YouTube preview"
                      className="w-28 h-16 object-cover rounded-lg border border-stone-300 flex-shrink-0 shadow-sm"
                    />
                    <div className="text-xs text-stone-600">
                      <strong className="text-stone-900 block font-semibold">✅ YouTube Video Attached to Event</strong>
                      <span>This video player will be embedded directly in the event details modal on the live website.</span>
                    </div>
                  </div>
                )}
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
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
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
                {selectedVolunteer.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateVolunteerStatus(selectedVolunteer.id, 'Approved');
                      setSelectedVolunteer(null);
                    }}
                    className="btn-primary"
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
          MODAL: PRINTABLE DONATION RECEIPT
         ============================================================== */}
      {selectedDonation && (
        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="modal-content modal-receipt-preview p-0" onClick={(e) => e.stopPropagation()}>
            <DonationReceipt
              receipt={selectedDonation}
              brand={adminData?.siteContent?.brand}
              contact={adminData?.siteContent?.contact}
              onClose={() => setSelectedDonation(null)}
              showCloseBtn={true}
            />
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: ADD VOLUNTEER RECORD
         ============================================================== */}
      {showAddVolunteer && (
        <div className="modal-overlay" onClick={() => setShowAddVolunteer(false)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="section-tag gold">ADMIN VOLUNTEER ENTRY</span>
                <h2 className="modal-title">Add New Volunteer</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddVolunteer(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVolunteerSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row-2">
                <div>
                  <label className="input-sublabel">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Subramanian"
                    value={volFullName}
                    onChange={(e) => setVolFullName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. karthik@example.com"
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-3 mb-3">
                <div>
                  <label className="input-sublabel">Contact Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Role Type</label>
                  <select
                    value={volRoleType}
                    onChange={(e) => setVolRoleType(e.target.value)}
                    className="form-input"
                  >
                    <option value="Volunteer">Volunteer</option>
                    <option value="Active Member">Active Member</option>
                    <option value="Campus Ambassador">Campus Ambassador</option>
                    <option value="Mentor / Professional">Mentor / Professional</option>
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Approval Status</label>
                  <select
                    value={volStatus}
                    onChange={(e) => setVolStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </div>

              <div className="form-row-3 mb-3">
                <div>
                  <label className="input-sublabel">Occupation / Profile</label>
                  <select
                    value={volOccupation}
                    onChange={(e) => setVolOccupation(e.target.value)}
                    className="form-input"
                  >
                    <option value="Student">Student</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Educator / Doctor">Educator / Doctor</option>
                    <option value="Business / Self-Employed">Business / Self-Employed</option>
                    <option value="General Citizen">General Citizen</option>
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Department / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science / Organization"
                    value={volDepartment}
                    onChange={(e) => setVolDepartment(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Blood Group</label>
                  <select
                    value={volBloodGroup}
                    onChange={(e) => setVolBloodGroup(e.target.value)}
                    className="form-input"
                  >
                    <option value="O+ Positive">O+ Positive</option>
                    <option value="O- Negative">O- Negative</option>
                    <option value="A+ Positive">A+ Positive</option>
                    <option value="A- Negative">A- Negative</option>
                    <option value="B+ Positive">B+ Positive</option>
                    <option value="B- Negative">B- Negative</option>
                    <option value="AB+ Positive">AB+ Positive</option>
                    <option value="AB- Negative">AB- Negative</option>
                  </select>
                </div>
              </div>

              <div className="form-row-3 mb-3">
                <div>
                  <label className="input-sublabel">Student / Staff ID</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={volCollegeId}
                    onChange={(e) => setVolCollegeId(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Year / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd Year"
                    value={volYear}
                    onChange={(e) => setVolYear(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">City / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Sivakasi"
                    value={volCity}
                    onChange={(e) => setVolCity(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Preferred Domain / Cause</label>
                  <select
                    value={volDomain}
                    onChange={(e) => setVolDomain(e.target.value)}
                    className="form-input"
                  >
                    <option value="General Community Service">General Community Service</option>
                    <option value="Child Education & Vidhya Connect">Child Education & Vidhya Connect</option>
                    {(adminData?.projects || []).map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Availability</label>
                  <select
                    value={volAvailability}
                    onChange={(e) => setVolAvailability(e.target.value)}
                    className="form-input"
                  >
                    <option value="Weekends (Saturday/Sunday)">Weekends (Saturday/Sunday)</option>
                    <option value="Weekday Evenings">Weekday Evenings</option>
                    <option value="Flexible Schedule">Flexible Schedule</option>
                    <option value="Special Event Drives">Special Event Drives</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-sublabel">Skills & Strengths</label>
                <input
                  type="text"
                  placeholder="e.g. Teaching, Event Coordination, Photography"
                  value={volSkills}
                  onChange={(e) => setVolSkills(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group mb-4">
                <label className="input-sublabel">Notes / Motivation</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes or statement..."
                  value={volMessage}
                  onChange={(e) => setVolMessage(e.target.value)}
                  className="form-input textarea"
                ></textarea>
              </div>

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddVolunteer(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVolunteer}
                  className="btn-primary"
                >
                  <Save size={16} />
                  <span>{isSubmittingVolunteer ? 'Saving...' : 'Save Volunteer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: ADD DONATION RECORD
         ============================================================== */}
      {showAddDonation && (
        <div className="modal-overlay" onClick={() => setShowAddDonation(false)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="section-tag gold">ADMIN DONATION ENTRY</span>
                <h2 className="modal-title">Add New Donation</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddDonation(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDonationSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row-2">
                <div>
                  <label className="input-sublabel">Donor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meenakshi Sundaram"
                    value={donName}
                    onChange={(e) => setDonName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Amount (₹) *</label>
                  <input
                    type="number"
                    min={50}
                    required
                    placeholder="1000"
                    value={donAmount}
                    onChange={(e) => setDonAmount(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. donor@example.com"
                    value={donEmail}
                    onChange={(e) => setDonEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={donPhone}
                    onChange={(e) => setDonPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mb-3">
                <div>
                  <label className="input-sublabel">PAN Card Number (Optional)</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={donPan}
                    onChange={(e) => setDonPan(e.target.value.toUpperCase())}
                    className="form-input uppercase"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Payment Mode</label>
                  <select
                    value={donPaymentMethod}
                    onChange={(e) => setDonPaymentMethod(e.target.value)}
                    className="form-input"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                    <option value="Cash">Cash Contribution</option>
                    <option value="Cheque / DD">Cheque / Demand Draft</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2 mb-4">
                <div>
                  <label className="input-sublabel">Allocated Cause / Project</label>
                  <select
                    value={donCause}
                    onChange={(e) => setDonCause(e.target.value)}
                    className="form-input"
                  >
                    <option value="Child Education & Vidhya Connect">Child Education & Vidhya Connect</option>
                    <option value="General Community Welfare">General Community Welfare</option>
                    {(adminData?.projects || []).map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Transaction Ref / UTR (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI/329481928410"
                    value={donTxnId}
                    onChange={(e) => setDonTxnId(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDonation(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDonation}
                  className="btn-primary"
                >
                  <Save size={16} />
                  <span>{isSubmittingDonation ? 'Recording...' : 'Record Donation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: IN-APP CONFIRMATION DIALOG (REPLACES BROWSER CONFIRM)
         ============================================================== */}
      {confirmDialog && (
        <div
          className="modal-overlay"
          style={{ zIndex: 100000 }}
          onClick={() => !isConfirmLoading && setConfirmDialog(null)}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: 0,
              overflow: 'hidden',
              borderRadius: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <div
              className="modal-header"
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #edd9c5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: confirmDialog.isDanger !== false ? '#fee2e2' : '#fef3c7',
                    color: confirmDialog.isDanger !== false ? '#dc2626' : '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <h3
                  id="confirm-dialog-title"
                  style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#24140c',
                    lineHeight: 1.3,
                  }}
                >
                  {confirmDialog.title}
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                disabled={isConfirmLoading}
                onClick={() => setConfirmDialog(null)}
                aria-label="Close confirmation"
                style={{ flexShrink: 0 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '22px 24px 20px' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: '#543d31',
                  lineHeight: 1.6,
                }}
              >
                {confirmDialog.message}
              </p>
            </div>

            <div
              style={{
                padding: '16px 24px 20px',
                borderTop: '1px solid #f0e6dc',
                background: '#fdfaf7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={() => setConfirmDialog(null)}
                className="btn-outline"
                style={{ minWidth: '100px', padding: '10px 20px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={async () => {
                  setIsConfirmLoading(true);
                  try {
                    await confirmDialog.onConfirm();
                  } finally {
                    setIsConfirmLoading(false);
                    setConfirmDialog(null);
                  }
                }}
                className="btn-primary"
                style={
                  confirmDialog.isDanger !== false
                    ? {
                        background: '#dc2626',
                        borderColor: '#dc2626',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                        padding: '10px 20px',
                      }
                    : { padding: '10px 20px' }
                }
              >
                {confirmDialog.isDanger !== false && <Trash2 size={15} />}
                <span>{isConfirmLoading ? 'Processing...' : confirmDialog.confirmLabel || 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
