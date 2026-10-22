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
  Sparkles,
  Award,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';
import {
  fetchAdminData,
  createClubEvent,
  deleteClubEvent,
  createClubProject,
  deleteClubProject,
  updateClubStats,
  updateVolunteerStatusApi,
  deleteVolunteerApi,
  updateInquiryStatusApi,
  deleteInquiryApi,
  deleteDonationApi,
  adminLoginApi
} from '../services/api';
import type {
  AdminData,
  VolunteerApplicationRecord,
  DonationRecord
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
  const [activeTab, setActiveTab] = useState<'overview' | 'volunteers' | 'donations' | 'events' | 'projects' | 'inquiries' | 'newsletters' | 'counters'>('overview');

  // Core Data
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ text: string; isError: boolean } | null>(null);

  // Filter & Search states
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerDeptFilter, setVolunteerDeptFilter] = useState('All');
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState('All');

  const [donationSearch, setDonationSearch] = useState('');

  // Selected Detail Modals
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerApplicationRecord | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);

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

  // Counter Ribbon Edit State
  const [counterLives, setCounterLives] = useState('28450');
  const [counterVolunteers, setCounterVolunteers] = useState('1420');
  const [counterProjects, setCounterProjects] = useState('185');
  const [counterTrees, setCounterTrees] = useState('12400');
  const [counterMeals, setCounterMeals] = useState('45200');
  const [counterCamps, setCounterCamps] = useState('68');

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
        setCounterLives(String(data.stats.livesImpacted || '28450'));
        setCounterVolunteers(String(data.stats.activeVolunteers || '1420'));
        setCounterProjects(String(data.stats.projectsCompleted || '185'));
        setCounterTrees(String(data.stats.treesPlanted || '12400'));
        setCounterMeals(String(data.stats.mealsServed || '45200'));
        setCounterCamps(String(data.stats.medicalCamps || '68'));
      }
    } catch {
      showNotice('Failed to fetch latest server data. Check if backend port 5000 is active.', true);
    } finally {
      setLoading(false);
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

  // Event Creation
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

  // Project Creation
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

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteClubProject(id);
      showNotice('Project removed');
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
      });
      showNotice('Live website counters updated successfully!');
      await loadData();
      if (onDataUpdated) onDataUpdated();
    } catch (err: any) {
      showNotice(err.message || 'Failed to update stats', true);
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
            <p>Administrative Command & Management Hub for College Social Drives</p>
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
              <div className="admin-login-error">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <button type="submit" disabled={loginLoading} className="btn-primary w-full btn-large">
              <ShieldCheck size={18} />
              <span>{loginLoading ? 'Authenticating...' : 'Unlock Admin Portal'}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="btn-secondary w-full"
              style={{ background: '#fdf5eb', color: '#78350f', borderColor: '#d97706' }}
            >
              <Sparkles size={16} />
              <span>Instant Demo Access</span>
            </button>
          </form>

          <div className="admin-login-footer">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="admin-back-btn"
            >
              <ArrowLeft size={16} />
              <span>Back to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // 2. LOGGED IN -> RENDER FULL-SCREEN STANDALONE ADMIN PANEL
  // ==============================================================
  return (
    <div className="admin-standalone-wrapper">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className={`admin-floating-notice ${actionNotice.isError ? 'error' : 'success'}`}>
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
            <h3>RCE CLUB</h3>
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
            className={`admin-nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={18} />
            <span>Events & Drives</span>
            <span className="admin-badge-count">{adminData?.events?.length || 0}</span>
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

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'counters' ? 'active' : ''}`}
            onClick={() => setActiveTab('counters')}
          >
            <Sliders size={18} />
            <span>Website Live Counters</span>
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
              {activeTab === 'volunteers' && 'Volunteer & Student Members Registry'}
              {activeTab === 'donations' && 'Donations & 80G Tax Exemption Receipts'}
              {activeTab === 'events' && 'Social Drives & Event Operations'}
              {activeTab === 'projects' && 'Flagship Causes & Community Projects'}
              {activeTab === 'inquiries' && 'Helpline & Citizen Messages'}
              {activeTab === 'newsletters' && 'Newsletter Audience & Email Subscribers'}
              {activeTab === 'counters' && 'Home Page Live Impact Counters'}
            </h2>
            <p>Real-time telemetry and management controls for RCE Social Service Club</p>
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
              <span>Live Website ↗</span>
            </button>
          </div>
        </header>

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
                  <span className="kpi-subtext">Next: 08 Nov Mega Plantation</span>
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
                    onClick={() => setActiveTab('volunteers')}
                    className="admin-action-tile"
                  >
                    <Users size={20} className="text-blue-600" />
                    <div>
                      <strong>Review Pending Volunteers ({pendingVolunteersCount})</strong>
                      <p>Approve applications, assign student coordinators</p>
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

                  <button
                    type="button"
                    onClick={exportDonationsCSV}
                    className="admin-action-tile"
                  >
                    <Download size={20} className="text-purple-600" />
                    <div>
                      <strong>Download 80G Tax Donations Ledger</strong>
                      <p>Export donor PAN, transaction IDs, and receipts for audit</p>
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
            {/* Filter & Action Toolbar */}
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

            {/* Volunteers Table */}
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
            {/* Top Toolbar */}
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

            {/* Table */}
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

              {/* Right Column: Live Drives List */}
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
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="admin-icon-btn red"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
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

              {/* Right Column: Existing Projects */}
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
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(proj.id)}
                              className="admin-icon-btn red"
                              title="Delete Project"
                            >
                              <Trash2 size={15} />
                            </button>
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
                  <h2>RCE SOCIAL SERVICE CLUB CHARITABLE TRUST</h2>
                  <p>Registered Public Charitable Trust • Chennai, Tamil Nadu</p>
                  <p className="text-xs text-stone-500">
                    Trust Reg: TN/CH/2021/84920 • PAN: AAATR8492G • 12A Reg: AAATR8492GE20210
                  </p>
                  <div className="receipt-80g-badge">
                    <strong>80G Approval Order:</strong> CIT(E)/CHN/80G/2021-22/A-412
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
                  <strong>Tax Benefit Note:</strong> All unconditional donations made to RCE Social Service Club Trust are eligible for 50% deduction under Section 80G of the Indian Income Tax Act, 1961.
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
