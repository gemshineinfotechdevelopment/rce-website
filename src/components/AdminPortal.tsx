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
  Award,
  MapPin,
  FileSpreadsheet,
  Edit3,
  Image as ImageIcon,
  Quote,
  Globe,
  ExternalLink,
  Save,
  RotateCcw
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
  PillarItem,
  SiteContent
} from '../services/api';

interface AdminPortalProps {
  onBackToWebsite: () => void;
  onDataUpdated?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite, onDataUpdated }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('rce_admin_session') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'cms'
    | 'gallery'
    | 'stories'
    | 'events'
    | 'projects'
    | 'counters'
    | 'volunteers'
    | 'donations'
    | 'inquiries'
    | 'newsletters'
  >('overview');

  // Sub-navigation for Website CMS
  const [cmsSubTab, setCmsSubTab] = useState<'hero' | 'about' | 'pillars' | 'contact' | 'brand'>('hero');

  // Core Data
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSavingCms, setIsSavingCms] = useState(false);

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

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('08:00 AM - 12:30 PM');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('Environment');
  const [eventSlots, setEventSlots] = useState('120');
  const [eventLeader, setEventLeader] = useState('RCE Student Coordinator');
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
  // 1. Hero
  const [heroTag, setHeroTag] = useState(DEFAULT_SITE_CONTENT.hero.tag);
  const [heroTitlePrefix, setHeroTitlePrefix] = useState(DEFAULT_SITE_CONTENT.hero.titlePrefix);
  const [heroTitleGradient, setHeroTitleGradient] = useState(DEFAULT_SITE_CONTENT.hero.titleGradient);
  const [heroTitleSuffix, setHeroTitleSuffix] = useState(DEFAULT_SITE_CONTENT.hero.titleSuffix);
  const [heroDesc, setHeroDesc] = useState(DEFAULT_SITE_CONTENT.hero.description);
  const [heroPrimaryCta, setHeroPrimaryCta] = useState(DEFAULT_SITE_CONTENT.hero.primaryCta);
  const [heroSecondaryCta, setHeroSecondaryCta] = useState(DEFAULT_SITE_CONTENT.hero.secondaryCta);
  const [heroTertiaryCta, setHeroTertiaryCta] = useState(DEFAULT_SITE_CONTENT.hero.tertiaryCta);
  const [heroBadge1, setHeroBadge1] = useState(DEFAULT_SITE_CONTENT.hero.trustBadge1);
  const [heroBadge2, setHeroBadge2] = useState(DEFAULT_SITE_CONTENT.hero.trustBadge2);
  const [heroBadge3, setHeroBadge3] = useState(DEFAULT_SITE_CONTENT.hero.trustBadge3);
  const [heroImage, setHeroImage] = useState(DEFAULT_SITE_CONTENT.hero.imageUrl);
  const [heroTagline, setHeroTagline] = useState(DEFAULT_SITE_CONTENT.hero.badgeTagline);
  const [heroStatTreesLabel, setHeroStatTreesLabel] = useState(DEFAULT_SITE_CONTENT.hero.statTreesLabel || 'Saplings Planted');
  const [heroStatLivesLabel, setHeroStatLivesLabel] = useState(DEFAULT_SITE_CONTENT.hero.statLivesLabel || 'Lives Impacted');

  // 2. About
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
  const [aboutYearsLabel, setAboutYearsLabel] = useState(DEFAULT_SITE_CONTENT.about.yearsExperienceLabel || 'Years of Active Service');
  const [aboutDrives, setAboutDrives] = useState(DEFAULT_SITE_CONTENT.about.drivesExperience);
  const [aboutImage, setAboutImage] = useState(DEFAULT_SITE_CONTENT.about.imageUrl);
  const [aboutPillarsTitle, setAboutPillarsTitle] = useState(DEFAULT_SITE_CONTENT.about.pillarsTitle || 'Our 4 Core Pillars of Service');

  // 3. Pillars
  const [pillarsList, setPillarsList] = useState<PillarItem[]>(DEFAULT_SITE_CONTENT.about.pillars);

  // 4. Contact & Helpline
  const [contactTag, setContactTag] = useState(DEFAULT_SITE_CONTENT.contact.tag || 'Connect With Us');
  const [contactTitle, setContactTitle] = useState(DEFAULT_SITE_CONTENT.contact.title || 'Have Questions or a ');
  const [contactTitleGradient, setContactTitleGradient] = useState(DEFAULT_SITE_CONTENT.contact.titleGradient || 'Cause to Champion?');
  const [contactSubtitle, setContactSubtitle] = useState(DEFAULT_SITE_CONTENT.contact.subtitle || 'Every great initiative begins with a conversation. Let us know how we can collaborate.');
  const [contactAddress, setContactAddress] = useState(DEFAULT_SITE_CONTENT.contact.officeAddress);
  const [contactPhone, setContactPhone] = useState(DEFAULT_SITE_CONTENT.contact.phone);
  const [contactEmail, setContactEmail] = useState(DEFAULT_SITE_CONTENT.contact.email);
  const [contactHours, setContactHours] = useState(DEFAULT_SITE_CONTENT.contact.hours);
  const [contactEmergency, setContactEmergency] = useState(DEFAULT_SITE_CONTENT.contact.emergencyHotline);

  // 5. Brand & Legal
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
    } catch {
      showNotice('Failed to fetch latest server data. Check if backend port 5000 is active.', true);
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
      setHeroBadge1(content.hero.trustBadge1 || '');
      setHeroBadge2(content.hero.trustBadge2 || '');
      setHeroBadge3(content.hero.trustBadge3 || '');
      setHeroImage(content.hero.imageUrl || '');
      setHeroTagline(content.hero.badgeTagline || '');
      setHeroStatTreesLabel(content.hero.statTreesLabel || 'Saplings Planted');
      setHeroStatLivesLabel(content.hero.statLivesLabel || 'Lives Impacted');
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
      setAboutYearsLabel(content.about.yearsExperienceLabel || 'Years of Active Service');
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
    setTimeout(() => setActionNotice(null), 4500);
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
      showNotice('Authenticated successfully. Welcome to RCE Club Admin Portal!');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid passcode. Default passcode is: rce@admin');
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

  // ==========================================
  // CMS CONTENT SAVE HANDLER
  // ==========================================
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
          trustBadge1: heroBadge1,
          trustBadge2: heroBadge2,
          trustBadge3: heroBadge3,
          imageUrl: heroImage,
          badgeTagline: heroTagline,
          statTreesLabel: heroStatTreesLabel,
          statLivesLabel: heroStatLivesLabel,
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
          yearsExperienceLabel: aboutYearsLabel,
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
    if (!window.confirm('Reset all website texts and images to default template content?')) return;
    populateCmsFields(DEFAULT_SITE_CONTENT);
    showNotice('Loaded default template values. Click "Save Website Details" to apply.');
  };

  // Pillar update helper
  const handlePillarChange = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...pillarsList];
    updated[index] = { ...updated[index], [field]: value };
    setPillarsList(updated);
  };

  // ==========================================
  // GALLERY HANDLERS
  // ==========================================
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

  // ==========================================
  // STORIES HANDLERS
  // ==========================================
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

  // ==========================================
  // PROJECT ACTIONS (CREATE, EDIT, DELETE)
  // ==========================================
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

  // ==========================================
  // EVENT ACTIONS (CREATE, EDIT, DELETE)
  // ==========================================
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showNotice('Please enter an event title', true);
      return;
    }
    try {
      await createClubEvent({
        title: eventTitle,
        date: eventDate || new Date().toISOString().slice(0, 10),
        time: eventTime,
        location: eventLocation || 'RCE Campus & Outreach Ground',
        category: eventCategory,
        slotsTotal: Number(eventSlots) || 100,
        leader: eventLeader,
        description: eventDesc || 'Community volunteer drive organized by RCE Social Service Club.',
      });
      showNotice('Drive scheduled and published to the live website!');
      setEventTitle('');
      setEventDesc('');
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
      `"${v.department || 'N/A'}"`,
      `"${v.collegeId || 'N/A'}"`,
      `"${v.yearOfStudy || 'N/A'}"`,
      `"${v.bloodGroup || 'N/A'}"`,
      v.email,
      v.phone,
      v.roleType,
      `"${v.skills}"`,
      `"${v.availability}"`,
      `"${v.preferredDomain || 'General'}"`,
      v.status,
      v.joinedAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RCE_Volunteers_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
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
      `"${d.city || 'N/A'}"`,
      `"${d.cause}"`,
      d.paymentMethod,
      d.transactionId || 'N/A',
      d.status,
      d.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
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

  // ==============================================================
  // 1. IF NOT LOGGED IN -> RENDER SECURE LOGIN GATEWAY
  // ==============================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-logo">
              <span className="text-3xl">🤝</span>
            </div>
            <span className="section-tag gold">RESTRICTED ACCESS</span>
            <h2>RCE Club Admin Portal</h2>
            <p>Administrative Command & Content Management Hub</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label className="input-sublabel">Security Passcode / Secret Key</label>
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
                Default Access Keys: <code>rce@admin</code> or <code>admin123</code>
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
              <span>{loginLoading ? 'Verifying Credentials...' : 'Sign In to Admin Portal'}</span>
            </button>

            <div className="admin-login-quick-demo">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="btn-outline w-full text-xs"
              >
                <span>⚡ Instant One-Click Demo Access</span>
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onBackToWebsite}
                className="text-xs text-amber-700 hover:underline flex items-center justify-center gap-1 mx-auto"
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
  // 2. MAIN LOGGED-IN ADMIN COMMAND CONSOLE
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

      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="logo-emblem">🤝</div>
          <div className="admin-sidebar-text">
            <h3>{brandName || 'RCE CLUB'}</h3>
            <span>ADMIN COMMAND</span>
          </div>
        </div>

        {/* Live Server Indicator */}
        <div className="admin-server-badge">
          <span className="status-ping-dot green"></span>
          <span>API Connected (Port 5000)</span>
        </div>

        {/* Nav Links */}
        <nav className="admin-sidebar-nav">
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} />
            <span>Dashboard Overview</span>
          </button>

          {/* WEBSITE CONTENT CMS TAB (KEY REQUEST) */}
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'cms' ? 'active' : ''}`}
            onClick={() => setActiveTab('cms')}
            style={{ background: activeTab === 'cms' ? '#b45309' : '#fdf5eb', border: '1px solid #fed7aa' }}
          >
            <Globe size={18} className="text-amber-700" />
            <span style={{ fontWeight: 800, color: activeTab === 'cms' ? '#ffffff' : '#78350f' }}>
              Website Content (CMS)
            </span>
            <span className="admin-badge-count gold">Editable</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={18} />
            <span>Photo Gallery</span>
            <span className="admin-badge-count">{adminData?.gallery?.length || 6}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => setActiveTab('stories')}
          >
            <Quote size={18} />
            <span>Voices & Stories</span>
            <span className="admin-badge-count">{adminData?.stories?.length || 3}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Layers size={18} />
            <span>Projects & Causes</span>
            <span className="admin-badge-count">{adminData?.projects?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={18} />
            <span>Events & Drives</span>
            <span className="admin-badge-count">{adminData?.events?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'counters' ? 'active' : ''}`}
            onClick={() => setActiveTab('counters')}
          >
            <Sliders size={18} />
            <span>Live Counters</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteers')}
          >
            <Users size={18} />
            <span>Volunteers & Members</span>
            <span className="admin-badge-count">{adminData?.volunteerApplications?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <Heart size={18} />
            <span>Donations & 80G Tax</span>
            <span className="admin-badge-count">{adminData?.donationRecords?.length || 0}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <Mail size={18} />
            <span>Helpline & Inquiries</span>
            {newInquiriesCount > 0 && (
              <span className="admin-badge-count urgent">{newInquiriesCount} New</span>
            )}
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'newsletters' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletters')}
          >
            <Mail size={18} />
            <span>Newsletter Audience</span>
            <span className="admin-badge-count">{adminData?.newsletterSubscribers?.length || 0}</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            onClick={onBackToWebsite}
            className="btn-outline w-full mb-2 admin-switch-website-btn"
          >
            <ArrowLeft size={16} />
            <span>View Public Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn w-full"
          >
            <LogOut size={16} />
            <span>Log Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-viewport">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h2>
              {activeTab === 'overview' && 'Executive Performance Dashboard'}
              {activeTab === 'cms' && 'Website Content & Details Manager (CMS)'}
              {activeTab === 'gallery' && 'Public Photo Gallery Management'}
              {activeTab === 'stories' && 'Voices of Change & Testimonials'}
              {activeTab === 'events' && 'Social Drives & Event Operations'}
              {activeTab === 'projects' && 'Flagship Causes & Community Projects'}
              {activeTab === 'counters' && 'Home Page Live Impact Counters'}
              {activeTab === 'volunteers' && 'Volunteer & Student Members Registry'}
              {activeTab === 'donations' && 'Donations & 80G Tax Exemption Receipts'}
              {activeTab === 'inquiries' && 'Helpline & Citizen Messages'}
              {activeTab === 'newsletters' && 'Newsletter Audience & Email Subscribers'}
            </h2>
            <p>Direct manual controls for all live website sections and data</p>
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
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={onBackToWebsite}
              className="btn-primary btn-admin-top"
              title="Switch to public landing page"
            >
              <ExternalLink size={15} />
              <span>Live Website ↗</span>
            </button>
          </div>
        </header>

        {/* ==============================================================
            TAB: WEBSITE CONTENT (CMS) - FULL MANUAL CONTROL OVER ALL SECTIONS
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
                <span>📖 About Us & Movement</span>
              </button>
              <button
                type="button"
                className={`cms-subnav-btn ${cmsSubTab === 'pillars' ? 'active' : ''}`}
                onClick={() => setCmsSubTab('pillars')}
              >
                <span>🏛️ 4 Core Pillars</span>
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
                <span>🛡️ Brand & Legal Charter</span>
              </button>
            </div>

            {/* CMS Form Card */}
            <div className="admin-cms-card">
              <form onSubmit={handleSaveCmsContent}>
                {/* 1. HERO SECTION SUBTAB */}
                {cmsSubTab === 'hero' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>Hero Section Banner</h3>
                        <p>Change the main headline, tagline, mission description, hero image, and CTA button labels.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleResetCmsToDefaults}
                          className="btn-outline text-xs"
                        >
                          <RotateCcw size={14} /> Reset Defaults
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingCms}
                          className="btn-primary"
                        >
                          <Save size={16} /> {isSavingCms ? 'Saving...' : 'Save Website Details'}
                        </button>
                      </div>
                    </div>

                    <div className="cms-preview-banner">
                      <span className="cms-preview-title">Live Preview Headline</span>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#24140c' }}>
                        {heroTitlePrefix}
                        <span style={{ color: '#d97706', textDecoration: 'underline' }}>{heroTitleGradient}</span>
                        {heroTitleSuffix}
                      </h2>
                      <p style={{ fontSize: '0.86rem', color: '#6c5448', marginTop: '6px' }}>{heroDesc}</p>
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Top Pill Tag Text</label>
                      <input
                        type="text"
                        value={heroTag}
                        onChange={(e) => setHeroTag(e.target.value)}
                        className="form-input"
                        placeholder="e.g. A People-Driven Social Movement"
                      />
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label className="input-sublabel">Headline Prefix Text</label>
                        <input
                          type="text"
                          value={heroTitlePrefix}
                          onChange={(e) => setHeroTitlePrefix(e.target.value)}
                          className="form-input"
                          placeholder="e.g. Dedicated to "
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Headline Highlighted Gradient Text</label>
                        <input
                          type="text"
                          value={heroTitleGradient}
                          onChange={(e) => setHeroTitleGradient(e.target.value)}
                          className="form-input"
                          placeholder="e.g. Culture, Service"
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <label className="input-sublabel">Headline Suffix Text</label>
                      <input
                        type="text"
                        value={heroTitleSuffix}
                        onChange={(e) => setHeroTitleSuffix(e.target.value)}
                        className="form-input"
                        placeholder="e.g.  & Community Upliftment"
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Hero Description Paragraph</label>
                      <textarea
                        rows={3}
                        value={heroDesc}
                        onChange={(e) => setHeroDesc(e.target.value)}
                        className="form-input textarea"
                        placeholder="Explain the movement and mission clearly..."
                      ></textarea>
                    </div>

                    <div className="form-row-3 mt-3">
                      <div>
                        <label className="input-sublabel">Primary CTA Button</label>
                        <input
                          type="text"
                          value={heroPrimaryCta}
                          onChange={(e) => setHeroPrimaryCta(e.target.value)}
                          className="form-input"
                          placeholder="Join As Volunteer"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Secondary CTA Button</label>
                        <input
                          type="text"
                          value={heroSecondaryCta}
                          onChange={(e) => setHeroSecondaryCta(e.target.value)}
                          className="form-input"
                          placeholder="Support A Cause"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Tertiary CTA Link</label>
                        <input
                          type="text"
                          value={heroTertiaryCta}
                          onChange={(e) => setHeroTertiaryCta(e.target.value)}
                          className="form-input"
                          placeholder="Active Drives"
                        />
                      </div>
                    </div>

                    <div className="form-row-3 mt-3">
                      <div>
                        <label className="input-sublabel">Trust Badge 1</label>
                        <input
                          type="text"
                          value={heroBadge1}
                          onChange={(e) => setHeroBadge1(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Trust Badge 2</label>
                        <input
                          type="text"
                          value={heroBadge2}
                          onChange={(e) => setHeroBadge2(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Trust Badge 3</label>
                        <input
                          type="text"
                          value={heroBadge3}
                          onChange={(e) => setHeroBadge3(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <label className="input-sublabel">Hero Main Image URL</label>
                      <input
                        type="url"
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        className="form-input"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {heroImage && (
                        <div className="mt-2" style={{ maxWidth: '240px' }}>
                          <img src={heroImage} alt="Hero Preview" style={{ borderRadius: '8px', maxHeight: '120px', width: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>

                    <div className="form-row-3 mt-3">
                      <div>
                        <label className="input-sublabel">Badge Tagline</label>
                        <input
                          type="text"
                          value={heroTagline}
                          onChange={(e) => setHeroTagline(e.target.value)}
                          className="form-input"
                          placeholder="✨ Service Above Self • RCE Chapter"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Float Stat 1 Label</label>
                        <input
                          type="text"
                          value={heroStatTreesLabel}
                          onChange={(e) => setHeroStatTreesLabel(e.target.value)}
                          className="form-input"
                          placeholder="Saplings Planted"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Float Stat 2 Label</label>
                        <input
                          type="text"
                          value={heroStatLivesLabel}
                          onChange={(e) => setHeroStatLivesLabel(e.target.value)}
                          className="form-input"
                          placeholder="Lives Impacted"
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
                        <p>Customize the about narrative, historical journey, checklist points, and experience badges.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary"
                      >
                        <Save size={16} /> {isSavingCms ? 'Saving...' : 'Save Website Details'}
                      </button>
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label className="input-sublabel">Section Tag</label>
                        <input
                          type="text"
                          value={aboutTag}
                          onChange={(e) => setAboutTag(e.target.value)}
                          className="form-input"
                          placeholder="About RCE Movement"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Title Highlight Text</label>
                        <input
                          type="text"
                          value={aboutTitleGradient}
                          onChange={(e) => setAboutTitleGradient(e.target.value)}
                          className="form-input"
                          placeholder="Heart & Integrity"
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <label className="input-sublabel">Main Title Prefix</label>
                      <input
                        type="text"
                        value={aboutTitle}
                        onChange={(e) => setAboutTitle(e.target.value)}
                        className="form-input"
                        placeholder="Empowering Youth to Serve with "
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Section Subtitle</label>
                      <input
                        type="text"
                        value={aboutSubtitle}
                        onChange={(e) => setAboutSubtitle(e.target.value)}
                        className="form-input"
                        placeholder="Just like Kutumb (Family)..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Story Heading</label>
                      <input
                        type="text"
                        value={aboutStoryHeading}
                        onChange={(e) => setAboutStoryHeading(e.target.value)}
                        className="form-input"
                        placeholder="From a Small Campus Initiative to a Statewide Movement"
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Story Paragraph 1</label>
                      <textarea
                        rows={3}
                        value={aboutStoryPara1}
                        onChange={(e) => setAboutStoryPara1(e.target.value)}
                        className="form-input textarea"
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Story Paragraph 2</label>
                      <textarea
                        rows={3}
                        value={aboutStoryPara2}
                        onChange={(e) => setAboutStoryPara2(e.target.value)}
                        className="form-input textarea"
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Checklist Point 1</label>
                      <input
                        type="text"
                        value={aboutChecklist1}
                        onChange={(e) => setAboutChecklist1(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Checklist Point 2</label>
                      <input
                        type="text"
                        value={aboutChecklist2}
                        onChange={(e) => setAboutChecklist2(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Checklist Point 3</label>
                      <input
                        type="text"
                        value={aboutChecklist3}
                        onChange={(e) => setAboutChecklist3(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-row-3 mt-3">
                      <div>
                        <label className="input-sublabel">Years Badge Number</label>
                        <input
                          type="text"
                          value={aboutYears}
                          onChange={(e) => setAboutYears(e.target.value)}
                          className="form-input"
                          placeholder="5+"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Years Badge Text</label>
                        <input
                          type="text"
                          value={aboutYearsLabel}
                          onChange={(e) => setAboutYearsLabel(e.target.value)}
                          className="form-input"
                          placeholder="Years of Active Service"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Drives Badge Text</label>
                        <input
                          type="text"
                          value={aboutDrives}
                          onChange={(e) => setAboutDrives(e.target.value)}
                          className="form-input"
                          placeholder="180+ Successful Drives"
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <label className="input-sublabel">About Section Image URL</label>
                      <input
                        type="url"
                        value={aboutImage}
                        onChange={(e) => setAboutImage(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {/* 3. 4 CORE PILLARS SUBTAB */}
                {cmsSubTab === 'pillars' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>4 Core Pillars of Service</h3>
                        <p>Adjust titles and descriptions for the 4 cornerstone service domains of RCE Club.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary"
                      >
                        <Save size={16} /> {isSavingCms ? 'Saving...' : 'Save Website Details'}
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
                        <div key={pillar.id || idx} className="p-4 rounded-xl border border-stone-300 bg-stone-50">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pillar #{idx + 1}</span>
                          <div className="form-group mt-2">
                            <label className="input-sublabel">Pillar Title</label>
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
                              rows={3}
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

                {/* 4. CONTACT & HELPLINE SUBTAB */}
                {cmsSubTab === 'contact' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>Contact Desk & Emergency Hotline</h3>
                        <p>Edit office location, phones, emails, working hours, and emergency numbers.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary"
                      >
                        <Save size={16} /> {isSavingCms ? 'Saving...' : 'Save Website Details'}
                      </button>
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label className="input-sublabel">Section Title Prefix</label>
                        <input
                          type="text"
                          value={contactTitle}
                          onChange={(e) => setContactTitle(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Title Gradient Highlight</label>
                        <input
                          type="text"
                          value={contactTitleGradient}
                          onChange={(e) => setContactTitleGradient(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <label className="input-sublabel">Subtitle Text</label>
                      <input
                        type="text"
                        value={contactSubtitle}
                        onChange={(e) => setContactSubtitle(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-sublabel">Registered Office Address</label>
                      <input
                        type="text"
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label className="input-sublabel">Helpline & WhatsApp Number(s)</label>
                        <input
                          type="text"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Official Email Desk</label>
                        <input
                          type="text"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2 mt-3">
                      <div>
                        <label className="input-sublabel">Operating Working Hours</label>
                        <textarea
                          rows={2}
                          value={contactHours}
                          onChange={(e) => setContactHours(e.target.value)}
                          className="form-input textarea"
                        ></textarea>
                      </div>
                      <div>
                        <label className="input-sublabel">24/7 Emergency Blood / Food Aid Hotline</label>
                        <input
                          type="text"
                          value={contactEmergency}
                          onChange={(e) => setContactEmergency(e.target.value)}
                          className="form-input"
                          placeholder="+91 99400 99999"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. BRAND & CHARTER SUBTAB */}
                {cmsSubTab === 'brand' && (
                  <div>
                    <div className="cms-section-header">
                      <div>
                        <h3>Brand & Legal Charter</h3>
                        <p>Change organization name, motto, footer mission statement, and official trust registrations.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isSavingCms}
                        className="btn-primary"
                      >
                        <Save size={16} /> {isSavingCms ? 'Saving...' : 'Save Website Details'}
                      </button>
                    </div>

                    <div className="form-row-2">
                      <div>
                        <label className="input-sublabel">Club Brand Name</label>
                        <input
                          type="text"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="form-input"
                          placeholder="RCE CLUB"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Club Subtitle / Motto</label>
                        <input
                          type="text"
                          value={brandSubtitle}
                          onChange={(e) => setBrandSubtitle(e.target.value)}
                          className="form-input"
                          placeholder="SERVICE • CULTURE • YOUTH"
                        />
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <label className="input-sublabel">Footer Mission Statement</label>
                      <textarea
                        rows={3}
                        value={brandMission}
                        onChange={(e) => setBrandMission(e.target.value)}
                        className="form-input textarea"
                      ></textarea>
                    </div>

                    <div className="form-row-2">
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
                        <label className="input-sublabel">80G Income Tax Exemption No</label>
                        <input
                          type="text"
                          value={brand80G}
                          onChange={(e) => setBrand80G(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-2 mt-3">
                      <div>
                        <label className="input-sublabel">12A Income Tax Registration</label>
                        <input
                          type="text"
                          value={brand12A}
                          onChange={(e) => setBrand12A(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="input-sublabel">Trust PAN Number</label>
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

                <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingCms}
                    className="btn-primary btn-large"
                  >
                    <CheckCircle2 size={18} />
                    <span>{isSavingCms ? 'Updating Live Website...' : 'Save & Publish Website Details'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: PHOTO GALLERY MANAGEMENT
           ============================================================== */}
        {activeTab === 'gallery' && (
          <div className="admin-content-view">
            <div className="admin-two-col-layout">
              {/* Left Column: Add Photo Form */}
              <div className="admin-box">
                <h3 className="admin-box-title">📸 Add Photo to Impact Gallery</h3>
                <form onSubmit={handleAddGalleryItem} className="admin-form-compact">
                  <div className="form-group">
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

                  <div className="form-row-2">
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
                  </div>

                  <div className="form-group mt-3">
                    <label className="input-sublabel">Location / Ground Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Kattivakkam Lake"
                      value={newGalLocation}
                      onChange={(e) => setNewGalLocation(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Image URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newGalImage}
                      onChange={(e) => setNewGalImage(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full mt-2">
                    <PlusCircle size={17} />
                    <span>Upload / Add Photo</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Live Gallery Cards */}
              <div className="admin-box">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="admin-box-title">Published Gallery Photos ({adminData?.gallery?.length || 0})</h3>
                </div>

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

                        <div className="mt-auto pt-2 border-t border-stone-200 flex justify-end gap-2">
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
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB: VOICES OF CHANGE & TESTIMONIAL STORIES
           ============================================================== */}
        {activeTab === 'stories' && (
          <div className="admin-content-view">
            <div className="admin-two-col-layout">
              {/* Left Column: Add Story Form */}
              <div className="admin-box">
                <h3 className="admin-box-title">💬 Publish Impact Story / Testimonial</h3>
                <form onSubmit={handleAddStory} className="admin-form-compact">
                  <div className="form-group">
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

                  <div className="form-row-2">
                    <div>
                      <label className="input-sublabel">Role / Association</label>
                      <input
                        type="text"
                        placeholder="e.g. Mother of 8th Grade Student"
                        value={newStoryRole}
                        onChange={(e) => setNewStoryRole(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Rural Tiruvallur"
                        value={newStoryLocation}
                        onChange={(e) => setNewStoryLocation(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label className="input-sublabel">Impact Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Education Beneficiary"
                      value={newStoryImpactTag}
                      onChange={(e) => setNewStoryImpactTag(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Avatar Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newStoryAvatar}
                      onChange={(e) => setNewStoryAvatar(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Testimonial Quote *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="What impact did RCE bring to this person or community?"
                      value={newStoryQuote}
                      onChange={(e) => setNewStoryQuote(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full mt-2">
                    <PlusCircle size={17} />
                    <span>Publish Story to Live Site</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Published Stories */}
              <div className="admin-box">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="admin-box-title">Published Stories ({adminData?.stories?.length || 0})</h3>
                </div>

                <div className="admin-stories-grid">
                  {(adminData?.stories || []).map((story) => (
                    <div key={story.id} className="admin-story-card">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="event-cat-chip">{story.impactTag}</span>
                          <div className="flex gap-1">
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

                        <p className="text-sm italic text-stone-700 my-3">"{story.quote}"</p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
                        <img
                          src={story.avatar}
                          alt={story.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm">{story.name}</h4>
                          <span className="text-xs text-stone-500">{story.role} &bull; {story.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-content-view">
            {/* KPI Cards */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card gold-border">
                <div className="kpi-icon-wrap gold">
                  <Users size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Registered Volunteers</span>
                  <h3 className="kpi-value">{adminData?.volunteerApplications?.length || 0}</h3>
                  <span className="kpi-subtext text-emerald-600">
                    +{pendingVolunteersCount} Pending Review
                  </span>
                </div>
              </div>

              <div className="admin-kpi-card emerald-border">
                <div className="kpi-icon-wrap green">
                  <Heart size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Donations Raised</span>
                  <h3 className="kpi-value">₹{totalDonationSum.toLocaleString('en-IN')}</h3>
                  <span className="kpi-subtext">Across {adminData?.donationRecords?.length || 0} Contributors</span>
                </div>
              </div>

              <div className="admin-kpi-card blue-border">
                <div className="kpi-icon-wrap blue">
                  <Calendar size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Active & Planned Drives</span>
                  <h3 className="kpi-value">{adminData?.events?.length || 0}</h3>
                  <span className="kpi-subtext">Next: Upcoming Drives</span>
                </div>
              </div>

              <div className="admin-kpi-card purple-border">
                <div className="kpi-icon-wrap purple">
                  <Mail size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Helpline Inquiries</span>
                  <h3 className="kpi-value">{adminData?.contactMessages?.length || 0}</h3>
                  <span className="kpi-subtext text-amber-700">{newInquiriesCount} Require Action</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Submissions Grid */}
            <div className="admin-overview-grid mt-6">
              {/* Left Column: Quick Actions & Live Stats summary */}
              <div className="admin-box">
                <h3 className="admin-box-title">⚡ Quick Management Actions</h3>
                <div className="admin-quick-actions-list">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms')}
                    className="admin-action-tile"
                  >
                    <Globe size={20} className="text-amber-700" />
                    <div>
                      <strong>Edit Website Content & Details</strong>
                      <p>Update hero, about text, 4 pillars, helpline contact, and logo charter</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className="admin-action-tile"
                  >
                    <ImageIcon size={20} className="text-emerald-700" />
                    <div>
                      <strong>Manage Photo Gallery</strong>
                      <p>Upload new event photos, edit titles, and organize categories</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('events')}
                    className="admin-action-tile"
                  >
                    <PlusCircle size={20} className="text-amber-600" />
                    <div>
                      <strong>Schedule New Social Drive</strong>
                      <p>Publish an upcoming beach clean-up, health camp or tree planting</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={exportVolunteersCSV}
                    className="admin-action-tile"
                  >
                    <FileSpreadsheet size={20} className="text-emerald-600" />
                    <div>
                      <strong>Export Volunteers Registry (.CSV)</strong>
                      <p>Download full student roster for NAAC/College accreditation</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Column: Recent Activity Feed */}
              <div className="admin-box">
                <h3 className="admin-box-title">🕒 Recent Submissions Feed</h3>
                <div className="admin-activity-stream">
                  {adminData?.volunteerApplications?.slice(0, 4).map((v) => (
                    <div key={v.id} className="activity-item">
                      <div className="activity-icon-badge">
                        <Users size={16} />
                      </div>
                      <div className="activity-body">
                        <div className="activity-header">
                          <strong>{v.fullName}</strong>
                          <span className="activity-time">{v.department || v.roleType}</span>
                        </div>
                        <p>Joined as <b>{v.roleType}</b> • Blood Group: <b>{v.bloodGroup || 'N/A'}</b></p>
                        <span className={`status-chip ${v.status.toLowerCase().includes('approved') ? 'green' : 'amber'}`}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {adminData?.donationRecords?.slice(0, 2).map((d) => (
                    <div key={d.receiptNo} className="activity-item">
                      <div className="activity-icon-badge green">
                        <Heart size={16} />
                      </div>
                      <div className="activity-body">
                        <div className="activity-header">
                          <strong>{d.donorName}</strong>
                          <span className="activity-time">₹{d.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <p>Contributed to <i>{d.cause}</i> • 80G Receipt #{d.receiptNo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: VOLUNTEERS */}
        {activeTab === 'volunteers' && (
          <div className="admin-content-view">
            <div className="admin-toolbar">
              <div className="admin-search-wrapper">
                <Search size={18} className="text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Name, Roll No, Dept, Blood Group, Phone..."
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
                  <option value="Computer Science">Computer Science & Eng</option>
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
                    <th>Dept & Roll No</th>
                    <th>Blood Group</th>
                    <th>Phone / WhatsApp</th>
                    <th>Domain & Skills</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-stone-500">
                        No volunteer records matching your filters.
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
                          <span className="text-xs text-amber-700 font-semibold">{vol.roleType}</span>
                        </td>
                        <td>
                          <div className="text-xs font-bold text-stone-800">{vol.department || 'General'}</div>
                          <div className="text-xs text-stone-500">ID: {vol.collegeId || 'N/A'} • {vol.yearOfStudy || 'Student'}</div>
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
                            className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-1"
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
                          <div className="admin-action-row">
                            <button
                              type="button"
                              onClick={() => setSelectedVolunteer(vol)}
                              className="admin-icon-btn blue"
                              title="View Full Profile"
                            >
                              <Eye size={15} />
                            </button>
                            {vol.status !== 'Approved' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateVolunteerStatus(vol.id, 'Approved')}
                                className="admin-icon-btn green"
                                title="Approve Volunteer"
                              >
                                <CheckCircle2 size={15} />
                              </button>
                            )}
                            {vol.status !== 'Rejected' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateVolunteerStatus(vol.id, 'Rejected')}
                                className="admin-icon-btn amber"
                                title="Reject Application"
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

        {/* Tab 3: DONATIONS & 80G */}
        {activeTab === 'donations' && (
          <div className="admin-content-view">
            <div className="admin-toolbar">
              <div className="admin-search-wrapper">
                <Search size={18} className="text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Donor Name, 80G Receipt No, PAN, Cause..."
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
                  <span>Export 80G Ledger (.CSV)</span>
                </button>
              </div>
            </div>

            <div className="admin-card-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>80G Receipt No</th>
                    <th>Donor Details</th>
                    <th>Amount (INR)</th>
                    <th>PAN Card No</th>
                    <th>Cause Supported</th>
                    <th>Payment Details</th>
                    <th>Date</th>
                    <th>Actions</th>
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
                          <div className="admin-action-row">
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

        {/* Tab 4: EVENTS & DRIVES */}
        {activeTab === 'events' && (
          <div className="admin-content-view">
            <div className="admin-two-col-layout">
              {/* Left Column: Create Event Form */}
              <div className="admin-box">
                <h3 className="admin-box-title">📅 Schedule New Social Drive</h3>
                <form onSubmit={handleAddEvent} className="admin-form-compact">
                  <div className="form-group">
                    <label className="input-sublabel">Event / Drive Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mega Beach Clean-up Drive: Mission Marina"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-2">
                    <div>
                      <label className="input-sublabel">Date *</label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Time Window</label>
                      <input
                        type="text"
                        placeholder="07:30 AM - 11:30 AM"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2 mt-3">
                    <div>
                      <label className="input-sublabel">Category / Domain</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className="form-input"
                      >
                        <option value="Environment">Environment & Plantation</option>
                        <option value="Healthcare">Healthcare & Blood Camp</option>
                        <option value="Education">Education & School Tutoring</option>
                        <option value="Relief">Relief & Food Drive</option>
                        <option value="Culture & Youth">Culture & Youth Workshop</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-sublabel">Volunteer Slots</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={eventSlots}
                        onChange={(e) => setEventSlots(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label className="input-sublabel">Location / Landmark Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Lakeview Biodiversity Park, Sector 4"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Student Lead Coordinator</label>
                    <input
                      type="text"
                      placeholder="e.g. Arunachalam (3rd Year CSE)"
                      value={eventLeader}
                      onChange={(e) => setEventLeader(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Drive Instructions & Objectives</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the drive goals, what volunteers should bring, assembly point..."
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full mt-2">
                    <PlusCircle size={17} />
                    <span>Publish Drive to Website</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Live Drives List with EDIT capability */}
              <div className="admin-box">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="admin-box-title">🚀 Active & Published Drives ({adminData?.events?.length || 0})</h3>
                  <div className="text-xs text-stone-500">Live on Homepage</div>
                </div>

                <div className="admin-events-list">
                  {adminData?.events?.map((ev) => (
                    <div key={ev.id} className="admin-event-card">
                      <div className="admin-event-card-header">
                        <div>
                          <span className="event-cat-chip">{ev.category}</span>
                          <h4 className="admin-event-card-title">{ev.title}</h4>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingEvent(ev)}
                            className="admin-icon-btn blue"
                            title="Edit Event Details"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="admin-icon-btn red"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="admin-event-meta-grid">
                        <div className="meta-pill">
                          <Calendar size={13} />
                          <span>{ev.date} • {ev.time}</span>
                        </div>
                        <div className="meta-pill">
                          <MapPin size={13} />
                          <span className="truncate">{ev.location}</span>
                        </div>
                        <div className="meta-pill">
                          <Users size={13} />
                          <span>Slots: {ev.slotsBooked || 0} / {ev.slotsTotal || 100}</span>
                        </div>
                        <div className="meta-pill">
                          <Award size={13} />
                          <span>Lead: {ev.leader}</span>
                        </div>
                      </div>

                      <p className="admin-event-desc">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="admin-content-view">
            <div className="admin-two-col-layout">
              {/* Left Column: Create Project Form */}
              <div className="admin-box">
                <h3 className="admin-box-title">🚀 Launch New Social Project</h3>
                <form onSubmit={handleAddProject} className="admin-form-compact">
                  <div className="form-group">
                    <label className="input-sublabel">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vidhya Connect: Rural School Tutoring"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-2">
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
                        <option value="Empowerment">Women Empowerment</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-sublabel">Target Goal (₹)</label>
                      <input
                        type="number"
                        placeholder="300000"
                        value={projGoal}
                        onChange={(e) => setProjGoal(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2 mt-3">
                    <div>
                      <label className="input-sublabel">Funds Already Raised (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={projRaised}
                        onChange={(e) => setProjRaised(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Beneficiaries Count</label>
                      <input
                        type="text"
                        placeholder="1,500+ Students"
                        value={projBeneficiaries}
                        onChange={(e) => setProjBeneficiaries(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label className="input-sublabel">Tagline / Short Hook</label>
                    <input
                      type="text"
                      placeholder="Empowering 1,500+ rural students with weekend tutoring & kits"
                      value={projTagline}
                      onChange={(e) => setProjTagline(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Banner Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={projImage}
                      onChange={(e) => setProjImage(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Key Highlights (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Free STEM kits, Mentorship, High school scholarships"
                      value={projHighlights}
                      onChange={(e) => setProjHighlights(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-sublabel">Detailed Project Description</label>
                    <textarea
                      rows={3}
                      placeholder="Provide quality learning kits, mentorship, and weekend coaching..."
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full mt-2">
                    <PlusCircle size={17} />
                    <span>Launch & Add to Website</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Projects with EDIT capability */}
              <div className="admin-box">
                <h3 className="admin-box-title">Flagship Initiatives ({adminData?.projects?.length || 0})</h3>
                <div className="admin-projects-grid">
                  {adminData?.projects?.map((proj) => {
                    const percent = Math.min(100, Math.round(((proj.raised || 0) / (proj.goal || 1)) * 100));
                    return (
                      <div key={proj.id} className="admin-project-card">
                        <img src={proj.image} alt={proj.title} className="admin-project-thumb" />
                        <div className="admin-project-body">
                          <div className="flex items-center justify-between">
                            <span className="event-cat-chip">{proj.category}</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => setEditingProject(proj)}
                                className="admin-icon-btn blue"
                                title="Edit Project Details"
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
                            <span>₹{(proj.raised || 0).toLocaleString('en-IN')} raised ({percent}%)</span>
                            <span>Goal: ₹{(proj.goal || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: INQUIRIES & HELPLINE */}
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(adminData?.contactMessages || []).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-stone-500">
                        No inquiries received yet.
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
                          <div className="text-xs text-stone-500">{msg.phone || 'Phone not provided'}</div>
                        </td>
                        <td>
                          <div className="font-semibold text-stone-800 text-sm">{msg.subject}</div>
                          <span className="text-xs text-amber-700">{msg.category || 'General'}</span>
                        </td>
                        <td>
                          <p className="text-xs text-stone-600 line-clamp-3 max-w-sm">{msg.message}</p>
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
                          <div className="admin-action-row">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="admin-icon-btn blue"
                              title="Send Email Reply"
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

        {/* Tab 7: NEWSLETTERS */}
        {activeTab === 'newsletters' && (
          <div className="admin-content-view">
            <div className="admin-box max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="admin-box-title">Newsletter Subscribers List</h3>
                  <p className="text-xs text-stone-500">Audience receiving monthly impact digests and drive invitations</p>
                </div>
                <div className="text-sm font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {adminData?.newsletterSubscribers?.length || 0} Emails
                </div>
              </div>

              <div className="admin-newsletter-list-box">
                {adminData?.newsletterSubscribers?.map((email, idx) => (
                  <div key={idx} className="admin-newsletter-row">
                    <span className="font-mono text-sm text-stone-800">{email}</span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: WEBSITE LIVE COUNTERS */}
        {activeTab === 'counters' && (
          <div className="admin-content-view">
            <div className="admin-box max-w-2xl">
              <h3 className="admin-box-title">📊 Live Website Stats Ribbon Manager</h3>
              <p className="text-xs text-stone-500 mb-6">
                Directly adjust the dynamic metric numbers displayed on the homepage stats ribbon.
              </p>

              <form onSubmit={handleSaveCounters} className="admin-form-compact">
                <div className="form-row-2">
                  <div>
                    <label className="input-sublabel">Total Lives Impacted</label>
                    <input
                      type="number"
                      required
                      value={counterLives}
                      onChange={(e) => setCounterLives(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">Active Volunteers</label>
                    <input
                      type="number"
                      required
                      value={counterVolunteers}
                      onChange={(e) => setCounterVolunteers(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2 mt-3">
                  <div>
                    <label className="input-sublabel">Projects & Drives Completed</label>
                    <input
                      type="number"
                      required
                      value={counterProjects}
                      onChange={(e) => setCounterProjects(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">Miyawaki Trees Planted</label>
                    <input
                      type="number"
                      required
                      value={counterTrees}
                      onChange={(e) => setCounterTrees(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2 mt-3">
                  <div>
                    <label className="input-sublabel">Nutritious Meals Served</label>
                    <input
                      type="number"
                      required
                      value={counterMeals}
                      onChange={(e) => setCounterMeals(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">Medical & Eye Screening Camps</label>
                    <input
                      type="number"
                      required
                      value={counterCamps}
                      onChange={(e) => setCounterCamps(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2 mt-3">
                  <div>
                    <label className="input-sublabel">Cities Covered</label>
                    <input
                      type="number"
                      required
                      value={counterCities}
                      onChange={(e) => setCounterCities(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">Satisfaction Rate (%)</label>
                    <input
                      type="number"
                      required
                      value={counterSatisfaction}
                      onChange={(e) => setCounterSatisfaction(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-6 btn-large">
                  <CheckCircle2 size={18} />
                  <span>Update Live Counters On Website</span>
                </button>
              </form>
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
              <div className="form-group">
                <label className="input-sublabel">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
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
                    <option value="Empowerment">Women Empowerment</option>
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Badge Tag</label>
                  <input
                    type="text"
                    value={editingProject.badge || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, badge: e.target.value })}
                    className="form-input"
                    placeholder="Flagship Initiative"
                  />
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="input-sublabel">Target Goal (₹)</label>
                  <input
                    type="number"
                    value={editingProject.goal}
                    onChange={(e) => setEditingProject({ ...editingProject, goal: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Raised Amount (₹)</label>
                  <input
                    type="number"
                    value={editingProject.raised}
                    onChange={(e) => setEditingProject({ ...editingProject, raised: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="input-sublabel">Beneficiaries Tag</label>
                  <input
                    type="text"
                    value={editingProject.beneficiaries || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, beneficiaries: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Banner Image URL</label>
                  <input
                    type="url"
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="input-sublabel">Tagline</label>
                <input
                  type="text"
                  value={editingProject.tagline}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Highlights (Comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingProject.highlights) ? editingProject.highlights.join(', ') : editingProject.highlights}
                  onChange={(e) => setEditingProject({ ...editingProject, highlights: e.target.value.split(',').map(s => s.trim()) })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Description</label>
                <textarea
                  rows={4}
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
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: EDIT EVENT / DRIVE
         ============================================================== */}
      {editingEvent && (
        <div className="modal-overlay" onClick={() => setEditingEvent(null)}>
          <div className="modal-content admin-modal-edit" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="admin-edit-badge"><Edit3 size={12} /> EDIT DRIVE</span>
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
              <div className="form-group">
                <label className="input-sublabel">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
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
                  <label className="input-sublabel">Time Window</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="input-sublabel">Category</label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="Environment">Environment & Plantation</option>
                    <option value="Healthcare">Healthcare & Blood Camp</option>
                    <option value="Education">Education & School Tutoring</option>
                    <option value="Relief">Relief & Food Drive</option>
                    <option value="Culture & Youth">Culture & Youth Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="input-sublabel">Status</label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="input-sublabel">Total Slots</label>
                  <input
                    type="number"
                    value={editingEvent.slotsTotal}
                    onChange={(e) => setEditingEvent({ ...editingEvent, slotsTotal: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="input-sublabel">Booked Slots</label>
                  <input
                    type="number"
                    value={editingEvent.slotsBooked}
                    onChange={(e) => setEditingEvent({ ...editingEvent, slotsBooked: Number(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="input-sublabel">Location / Venue</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Lead Coordinator</label>
                <input
                  type="text"
                  value={editingEvent.leader}
                  onChange={(e) => setEditingEvent({ ...editingEvent, leader: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Description & Instructions</label>
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
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
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
              <div className="form-group">
                <label className="input-sublabel">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={editingGallery.title}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
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

              <div className="form-group mt-3">
                <label className="input-sublabel">Location / Ground Venue</label>
                <input
                  type="text"
                  value={editingGallery.location}
                  onChange={(e) => setEditingGallery({ ...editingGallery, location: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingGallery.image}
                  onChange={(e) => setEditingGallery({ ...editingGallery, image: e.target.value })}
                  className="form-input"
                />
              </div>

              {editingGallery.image && (
                <div className="mb-4">
                  <img
                    src={editingGallery.image}
                    alt="Preview"
                    style={{ maxHeight: '160px', width: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}

              <div className="modal-actions-bar mt-4">
                <button
                  type="button"
                  onClick={() => setEditingGallery(null)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
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
              <div className="form-group">
                <label className="input-sublabel">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingStory.name}
                  onChange={(e) => setEditingStory({ ...editingStory, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
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

              <div className="form-group mt-3">
                <label className="input-sublabel">Impact Tag</label>
                <input
                  type="text"
                  value={editingStory.impactTag}
                  onChange={(e) => setEditingStory({ ...editingStory, impactTag: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Avatar Image URL</label>
                <input
                  type="url"
                  value={editingStory.avatar}
                  onChange={(e) => setEditingStory({ ...editingStory, avatar: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Testimonial Quote *</label>
                <textarea
                  rows={4}
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
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          VOLUNTEER FULL PROFILE MODAL
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

            <div className="modal-body">
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
                  <span className="detail-label">College Department:</span>
                  <span className="detail-val">{selectedVolunteer.department || 'Computer Science & Engineering'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Student ID / Roll No:</span>
                  <span className="detail-val">{selectedVolunteer.collegeId || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year of Study:</span>
                  <span className="detail-val">{selectedVolunteer.yearOfStudy || '3rd Year'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Emergency Phone:</span>
                  <span className="detail-val font-mono">{selectedVolunteer.emergencyContact || 'Not provided'}</span>
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
                  <span className="detail-val font-semibold text-amber-900">{selectedVolunteer.preferredDomain || 'Child Education'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Availability:</span>
                  <span className="detail-val">{selectedVolunteer.availability}</span>
                </div>
              </div>

              <div className="detail-box-full mt-4">
                <span className="detail-label">Core Skills & Strengths:</span>
                <p className="detail-paragraph">{selectedVolunteer.skills}</p>
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
                  <Phone size={15} /> Call Candidate
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
          80G TAX EXEMPTION PRINTABLE RECEIPT MODAL
         ============================================================== */}
      {selectedDonation && (
        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="modal-content modal-receipt-preview" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="section-tag gold">OFFICIAL RECEIPT</span>
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
                <div className="receipt-trust-logo">🤝</div>
                <div className="receipt-trust-info">
                  <h2>{brandName || 'RCE SOCIAL SERVICE CLUB CHARITABLE TRUST'}</h2>
                  <p>Registered Public Charitable Trust • Chennai, Tamil Nadu</p>
                  <p className="text-xs text-stone-500">
                    Trust Reg: {brandTrustReg || 'TN/CH/2021/84920'} • PAN: {brandPAN || 'AAATR8492G'} • 12A Reg: {brand12A || 'AAATR8492GE20210'}
                  </p>
                  <div className="receipt-80g-badge">
                    <strong>80G Approval Order:</strong> {brand80G || 'CIT(E)/CHN/80G/2021-22/A-412'}
                  </div>
                </div>
              </div>

              <div className="receipt-serial-strip">
                <div>
                  <span className="text-xs text-stone-500">Receipt Serial Number:</span>
                  <div className="font-mono font-bold text-amber-900">{selectedDonation.receiptNo}</div>
                </div>
                <div>
                  <span className="text-xs text-stone-500">Date of Contribution:</span>
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
                  Received with gratitude from <strong>{selectedDonation.donorName}</strong>, resident of <strong>{selectedDonation.city || 'Tamil Nadu, India'}</strong> (PAN: <strong>{selectedDonation.pan}</strong>), the sum of:
                </p>

                <div className="receipt-amount-display">
                  <span>INR ₹{selectedDonation.amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="receipt-particulars-grid">
                  <div><strong>Allocated Cause:</strong> {selectedDonation.cause}</div>
                  <div><strong>Payment Mode:</strong> {selectedDonation.paymentMethod}</div>
                  <div><strong>Txn / UTR Reference:</strong> {selectedDonation.transactionId || 'UPI Verified'}</div>
                  <div><strong>Donor Contact:</strong> {selectedDonation.email} • {selectedDonation.phone}</div>
                </div>

                <div className="receipt-tax-clause">
                  <strong>Tax Benefit Note:</strong> All unconditional donations made to {brandName} are eligible for 50% deduction under Section 80G of the Indian Income Tax Act, 1961.
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
