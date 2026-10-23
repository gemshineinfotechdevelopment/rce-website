import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsRibbon } from './components/StatsRibbon';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EventsSection } from './components/EventsSection';
import { StoriesSection } from './components/StoriesSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { JoinModal } from './components/JoinModal';
import { DonateModal } from './components/DonateModal';
import { AdminPortal } from './components/AdminPortal';
import {
  fetchClubStats,
  fetchClubProjects,
  fetchClubEvents,
  fetchClubStories,
  fetchGallery,
  fetchSiteContent,
  DEFAULT_SITE_CONTENT,
} from './services/api';
import type {
  ClubStats,
  ProjectItem,
  ClubEvent,
  StoryItem,
  GalleryItem,
  SiteContent,
} from './services/api';
import './App.css';

function App() {
  const [stats, setStats] = useState<ClubStats>({
    livesImpacted: 28450,
    activeVolunteers: 1420,
    projectsCompleted: 185,
    treesPlanted: 12400,
    mealsServed: 45200,
    medicalCamps: 68,
    citiesCovered: 14,
    satisfactionRate: 98,
  });

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isSyncingStats, setIsSyncingStats] = useState(false);

  // Standalone Admin Route State
  const [isAdminPortalView, setIsAdminPortalView] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash === '#admin';
  });

  // Modal States for Public Website
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [defaultJoinRole, setDefaultJoinRole] = useState('Volunteer');
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [defaultDonateCause, setDefaultDonateCause] = useState('Child Education & Vidhya Connect');

  // Listen to browser URL changes
  useEffect(() => {
    const handleRouteCheck = () => {
      setIsAdminPortalView(
        window.location.pathname.startsWith('/admin') || window.location.hash === '#admin'
      );
    };

    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, []);

  // Load initial backend data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsSyncingStats(true);
    try {
      const [statsData, projectsData, eventsData, storiesData, galleryData, contentData] = await Promise.all([
        fetchClubStats(),
        fetchClubProjects(),
        fetchClubEvents(),
        fetchClubStories(),
        fetchGallery(),
        fetchSiteContent(),
      ]);

      if (statsData) setStats(statsData);
      if (projectsData?.length) setProjects(projectsData);
      if (eventsData?.length) setEvents(eventsData);
      if (storiesData?.length) setStories(storiesData);
      if (galleryData?.length) setGallery(galleryData);
      if (contentData) setSiteContent(contentData);
    } catch (err) {
      console.warn('Error loading club data from backend:', err);
    } finally {
      setIsSyncingStats(false);
    }
  };

  const handleRefreshStats = async () => {
    setIsSyncingStats(true);
    try {
      const [updatedStats, updatedProjects] = await Promise.all([
        fetchClubStats(),
        fetchClubProjects(),
      ]);
      setStats(updatedStats);
      if (updatedProjects?.length) setProjects(updatedProjects);
    } finally {
      setIsSyncingStats(false);
    }
  };

  const handleOpenJoin = (role = 'Volunteer') => {
    setDefaultJoinRole(role);
    setIsJoinOpen(true);
  };

  const handleOpenDonate = (cause = 'Child Education & Vidhya Connect') => {
    setDefaultDonateCause(cause);
    setIsDonateOpen(true);
  };

  const handleNavigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminPortalView(true);
  };

  const handleBackToWebsite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminPortalView(false);
  };

  // ==============================================================
  // 1. DEDICATED STANDALONE ADMIN PANEL VIEW (NOT EMBEDDED IN WEBSITE)
  // ==============================================================
  if (isAdminPortalView) {
    return (
      <AdminPortal
        onBackToWebsite={handleBackToWebsite}
        onDataUpdated={loadAllData}
      />
    );
  }

  // ==============================================================
  // 2. PUBLIC SOCIAL SERVICE CLUB WEBSITE
  // ==============================================================
  return (
    <div className="rce-app-root">
      {/* Top Public Navbar (No Admin button here) */}
      <Navbar
        brand={siteContent.brand}
        onOpenJoin={handleOpenJoin}
        onOpenDonate={handleOpenDonate}
      />

      {/* Main Landing Page Content */}
      <main>
        <Hero
          stats={stats}
          content={siteContent.hero}
          onOpenJoin={() => handleOpenJoin('Volunteer')}
          onOpenDonate={() => handleOpenDonate()}
        />

        <StatsRibbon
          stats={stats}
          onRefreshStats={handleRefreshStats}
          isLoading={isSyncingStats}
        />

        <AboutSection
          content={siteContent.about}
          onOpenJoin={() => handleOpenJoin('Member')}
        />

        <ProjectsSection
          projects={projects}
          onOpenDonate={handleOpenDonate}
          onOpenJoin={handleOpenJoin}
        />

        <EventsSection
          events={events}
          onOpenJoin={(role) => handleOpenJoin(role)}
        />

        <StoriesSection stories={stories} />

        <GallerySection items={gallery} />

        <ContactSection content={siteContent.contact} />
      </main>

      {/* Site Footer with discreet staff admin link */}
      <Footer
        brand={siteContent.brand}
        onOpenAdmin={handleNavigateToAdmin}
      />

      {/* Join RCE Modal */}
      <JoinModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        defaultRole={defaultJoinRole}
        projects={projects}
        onSuccessRegistered={handleRefreshStats}
      />

      {/* Donate / Support Modal with 80G tax receipt */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        defaultCause={defaultDonateCause}
        projects={projects}
        onSuccessDonated={handleRefreshStats}
      />
    </div>
  );
}

export default App;
