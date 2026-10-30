import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsRibbon } from './components/StatsRibbon';
import { AboutSection } from './components/AboutSection';
import { InitiativesSpotlight } from './components/InitiativesSpotlight';
import { ProjectsPage } from './components/ProjectsPage';
import { EventsPage } from './components/EventsPage';
import { StoriesSection } from './components/StoriesSection';
import { VideoShowcase } from './components/VideoShowcase';
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
  fetchClubVideos,
  fetchSiteContent,
  DEFAULT_SITE_CONTENT,
} from './services/api';
import type {
  ClubStats,
  ProjectItem,
  ClubEvent,
  StoryItem,
  GalleryItem,
  VideoItem,
  SiteContent,
} from './services/api';
import './App.css';

type AppView = 'home' | 'projects' | 'events' | 'admin';

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
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isSyncingStats, setIsSyncingStats] = useState(false);

  // Multi-page routing state (home, projects, events, admin)
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith('/admin') || hash === '#admin') return 'admin';
    if (path.startsWith('/projects') || hash === '#projects') return 'projects';
    if (path.startsWith('/events') || hash === '#events') return 'events';
    return 'home';
  });

  // Modal States for Public Website
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [defaultJoinRole, setDefaultJoinRole] = useState('Volunteer');
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [defaultDonateCause, setDefaultDonateCause] = useState('Child Education & Vidhya Connect');

  // Listen to browser URL changes
  useEffect(() => {
    const handleRouteCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith('/admin') || hash === '#admin') {
        setCurrentView('admin');
      } else if (path.startsWith('/projects') || hash === '#projects') {
        setCurrentView('projects');
      } else if (path.startsWith('/events') || hash === '#events') {
        setCurrentView('events');
      } else {
        setCurrentView('home');
      }
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
      const [statsData, projectsData, eventsData, storiesData, galleryData, videosData, contentData] = await Promise.all([
        fetchClubStats(),
        fetchClubProjects(),
        fetchClubEvents(),
        fetchClubStories(),
        fetchGallery(),
        fetchClubVideos(),
        fetchSiteContent(),
      ]);

      if (statsData) setStats(statsData);
      if (projectsData?.length) setProjects(projectsData);
      if (eventsData?.length) setEvents(eventsData);
      if (storiesData?.length) setStories(storiesData);
      if (galleryData?.length) setGallery(galleryData);
      if (videosData?.length) setVideos(videosData);
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

  const handleNavigate = (view: 'home' | 'projects' | 'events', sectionId?: string) => {
    if (view === 'projects') {
      window.location.hash = '#projects';
      setCurrentView('projects');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'events') {
      window.location.hash = '#events';
      setCurrentView('events');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      if (sectionId) {
        window.location.hash = sectionId;
        setTimeout(() => {
          const el = document.querySelector(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNavigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToWebsite = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==============================================================
  // 1. STANDALONE ADMIN PORTAL VIEW
  // ==============================================================
  if (currentView === 'admin') {
    return (
      <AdminPortal
        onBackToWebsite={handleBackToWebsite}
        onDataUpdated={loadAllData}
      />
    );
  }

  // ==============================================================
  // 2. DEDICATED PROJECTS PAGE VIEW (SEPARATE PAGE)
  // ==============================================================
  if (currentView === 'projects') {
    return (
      <div className="rce-app-root">
        <Navbar
          brand={siteContent.brand}
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenJoin={handleOpenJoin}
          onOpenDonate={handleOpenDonate}
        />
        <main>
          <ProjectsPage
            projects={projects}
            onOpenDonate={handleOpenDonate}
            onOpenJoin={handleOpenJoin}
            onBackToHome={() => handleNavigate('home')}
          />
        </main>
        <Footer
          brand={siteContent.brand}
          onOpenAdmin={handleNavigateToAdmin}
        />
        <JoinModal
          isOpen={isJoinOpen}
          onClose={() => setIsJoinOpen(false)}
          defaultRole={defaultJoinRole}
          projects={projects}
          onSuccessRegistered={handleRefreshStats}
        />
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

  // ==============================================================
  // 3. DEDICATED EVENTS PAGE VIEW (SEPARATE PAGE WITH ALL 14+ DRIVES)
  // ==============================================================
  if (currentView === 'events') {
    return (
      <div className="rce-app-root">
        <Navbar
          brand={siteContent.brand}
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenJoin={handleOpenJoin}
          onOpenDonate={handleOpenDonate}
        />
        <main>
          <EventsPage
            events={events}
            onOpenJoin={(role?: string) => handleOpenJoin(role)}
            onBackToHome={() => handleNavigate('home')}
          />
        </main>
        <Footer
          brand={siteContent.brand}
          onOpenAdmin={handleNavigateToAdmin}
        />
        <JoinModal
          isOpen={isJoinOpen}
          onClose={() => setIsJoinOpen(false)}
          defaultRole={defaultJoinRole}
          projects={projects}
          onSuccessRegistered={handleRefreshStats}
        />
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

  // ==============================================================
  // 4. MAIN HOMEPAGE (CLEAN & UNCLUTTERED)
  // ==============================================================
  return (
    <div className="rce-app-root">
      <Navbar
        brand={siteContent.brand}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenJoin={handleOpenJoin}
        onOpenDonate={handleOpenDonate}
      />

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

        <VideoShowcase videos={videos} />

        <AboutSection
          content={siteContent.about}
          onOpenJoin={() => handleOpenJoin('Member')}
        />

        {/* Clean, high-impact Initiatives Spotlight linking directly to dedicated pages */}
        <InitiativesSpotlight
          projects={projects}
          events={events}
          onNavigateToProjects={() => handleNavigate('projects')}
          onNavigateToEvents={() => handleNavigate('events')}
        />

        <StoriesSection stories={stories} />

        <GallerySection items={gallery} />

        <ContactSection content={siteContent.contact} />
      </main>

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
