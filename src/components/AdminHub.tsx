import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Trash2,
  Users,
  Heart,
  Mail,
  Calendar,
  Layers,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import {
  fetchAdminData,
  createClubEvent,
  deleteClubEvent,
  createClubProject,
  deleteClubProject,
  updateClubStats,
} from '../services/api';
import type { AdminData } from '../services/api';
import { ImageUploadInput } from './ImageUploadInput';

interface AdminHubProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

export const AdminHub: React.FC<AdminHubProps> = ({ isOpen, onClose, onDataUpdated }) => {
  const [activeTab, setActiveTab] = useState<'submissions' | 'events' | 'projects' | 'stats'>('submissions');
  const [submissionType, setSubmissionType] = useState<'volunteers' | 'donations' | 'messages' | 'newsletters'>('volunteers');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('09:00 AM - 01:00 PM');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('Environment');
  const [eventSlots, setEventSlots] = useState('100');
  const [eventLeader, setEventLeader] = useState('RCE Coordinator');
  const [eventDesc, setEventDesc] = useState('');

  // Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Education');
  const [projTagline, setProjTagline] = useState('');
  const [projGoal, setProjGoal] = useState('300000');
  const [projRaised, setProjRaised] = useState('0');
  const [projBeneficiaries, setProjBeneficiaries] = useState('1,000+ Beneficiaries');
  const [projImage, setProjImage] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80');
  const [projDesc, setProjDesc] = useState('');
  const [projHighlights, setProjHighlights] = useState('Volunteer support, Community kit distribution');

  // Stats Form State
  const [statsLives, setStatsLives] = useState('28450');
  const [statsTrees, setStatsTrees] = useState('12400');
  const [statsMeals, setStatsMeals] = useState('45200');
  const [statsCamps, setStatsCamps] = useState('68');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    setActionMsg(null);
    try {
      const data = await fetchAdminData();
      setAdminData(data);
      if (data.stats) {
        setStatsLives(String(data.stats.livesImpacted));
        setStatsTrees(String(data.stats.treesPlanted));
        setStatsMeals(String(data.stats.mealsServed));
        setStatsCamps(String(data.stats.medicalCamps));
      }
    } catch {
      setActionMsg({ text: 'Failed to load submissions. Ensure backend port 5024 is running.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Handle Event Creation
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) {
      setActionMsg({ text: 'Please fill in Event Title and Date.', isError: true });
      return;
    }

    try {
      await createClubEvent({
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        location: eventLocation || 'Chennai Campus Grounds',
        category: eventCategory,
        slotsTotal: Number(eventSlots) || 100,
        leader: eventLeader,
        description: eventDesc || 'Community volunteer drive organized by RCE Social Service Club.',
      });

      setActionMsg({ text: 'Event published successfully! It is now live on the website.', isError: false });
      setEventTitle('');
      setEventDesc('');
      await loadData();
      onDataUpdated();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to create event', isError: true });
    }
  };

  // Handle Event Deletion
  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteClubEvent(id);
      setActionMsg({ text: 'Event removed.', isError: false });
      await loadData();
      onDataUpdated();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to delete event', isError: true });
    }
  };

  // Handle Project Creation
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      setActionMsg({ text: 'Please enter a Project Title.', isError: true });
      return;
    }

    try {
      await createClubProject({
        title: projTitle,
        category: projCategory,
        tagline: projTagline || 'Empowering communities through grassroots action',
        goal: Number(projGoal) || 100000,
        raised: Number(projRaised) || 0,
        beneficiaries: projBeneficiaries,
        image: projImage,
        description: projDesc || 'Social welfare drive.',
        highlights: projHighlights.split(',').map((s) => s.trim()),
      });

      setActionMsg({ text: 'Project created and published to the website!', isError: false });
      setProjTitle('');
      setProjTagline('');
      setProjDesc('');
      await loadData();
      onDataUpdated();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to create project', isError: true });
    }
  };

  // Handle Project Deletion
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteClubProject(id);
      setActionMsg({ text: 'Project removed.', isError: false });
      await loadData();
      onDataUpdated();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to delete project', isError: true });
    }
  };

  // Handle Stats Update
  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClubStats({
        livesImpacted: Number(statsLives),
        treesPlanted: Number(statsTrees),
        mealsServed: Number(statsMeals),
        medicalCamps: Number(statsCamps),
      });

      setActionMsg({ text: 'Live impact counters updated!', isError: false });
      await loadData();
      onDataUpdated();
    } catch (err: any) {
      setActionMsg({ text: err.message || 'Failed to update stats', isError: true });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-admin-hub" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header admin-modal-header">
          <div className="admin-header-title-group">
            <span className="section-tag gold">⚙️ Management Dashboard</span>
            <h2 className="modal-title">RCE Club Admin Control Center</h2>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              onClick={loadData}
              className="btn-outline btn-refresh-admin"
              title="Refresh live data"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close admin hub"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs-bar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <Users size={16} />
            <span>Form Submissions ({adminData ? (adminData.volunteerApplications?.length || 0) + (adminData.donationRecords?.length || 0) + (adminData.contactMessages?.length || 0) : 0})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={16} />
            <span>Events Manager ({adminData?.events?.length || 0})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Layers size={16} />
            <span>Projects Manager ({adminData?.projects?.length || 0})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={16} />
            <span>Live Counters</span>
          </button>
        </div>

        {/* Global Feedback Alert */}
        {actionMsg && (
          <div className={`status-alert-banner mx-6 mt-4 ${actionMsg.isError ? 'error' : 'success'}`}>
            {actionMsg.isError ? <AlertCircle size={16} className="inline mr-1" /> : <CheckCircle2 size={16} className="inline mr-1" />}
            {actionMsg.text}
          </div>
        )}

        {/* Body Content */}
        <div className="modal-body admin-modal-body">
          {/* TAB 1: SUBMISSIONS */}
          {activeTab === 'submissions' && (
            <div className="admin-submissions-view">
              <div className="submission-subnav">
                <button
                  type="button"
                  className={`subnav-pill ${submissionType === 'volunteers' ? 'active' : ''}`}
                  onClick={() => setSubmissionType('volunteers')}
                >
                  <Users size={14} />
                  <span>Volunteers & Members ({adminData?.volunteerApplications?.length || 0})</span>
                </button>
                <button
                  type="button"
                  className={`subnav-pill ${submissionType === 'donations' ? 'active' : ''}`}
                  onClick={() => setSubmissionType('donations')}
                >
                  <Heart size={14} />
                  <span>Donations ({adminData?.donationRecords?.length || 0})</span>
                </button>
                <button
                  type="button"
                  className={`subnav-pill ${submissionType === 'messages' ? 'active' : ''}`}
                  onClick={() => setSubmissionType('messages')}
                >
                  <Mail size={14} />
                  <span>Contact Inquiries ({adminData?.contactMessages?.length || 0})</span>
                </button>
                <button
                  type="button"
                  className={`subnav-pill ${submissionType === 'newsletters' ? 'active' : ''}`}
                  onClick={() => setSubmissionType('newsletters')}
                >
                  <span>Newsletter Subscribers ({adminData?.newsletterSubscribers?.length || 0})</span>
                </button>
              </div>

              {/* Volunteers Submissions Table */}
              {submissionType === 'volunteers' && (
                <div className="admin-table-wrap">
                  <div className="admin-search-box">
                    <Search size={15} color="#b45309" />
                    <input
                      type="text"
                      placeholder="Search by name, phone or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="admin-search-input"
                    />
                  </div>

                  {(!adminData?.volunteerApplications || adminData.volunteerApplications.length === 0) ? (
                    <div className="admin-empty-state">
                      <p>No volunteer applications submitted yet. Try filling the "Join Us" form on the website!</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="admin-data-table">
                        <thead>
                          <tr>
                            <th>Reg ID</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            <th>Contact</th>
                            <th>City / Occupation</th>
                            <th>Availability</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData.volunteerApplications
                            .filter(
                              (v) =>
                                !searchTerm ||
                                v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                v.phone.includes(searchTerm) ||
                                v.roleType.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((v) => (
                              <tr key={v.id}>
                                <td><code className="admin-code-badge">{v.id}</code></td>
                                <td><strong>{v.fullName}</strong></td>
                                <td><span className="admin-role-badge">{v.roleType}</span></td>
                                <td>
                                  <div>📞 {v.phone}</div>
                                  <div className="text-xs text-stone-500">✉️ {v.email}</div>
                                </td>
                                <td>{v.city} &bull; {v.occupation}</td>
                                <td><span className="text-xs font-semibold">{v.availability}</span></td>
                                <td><span className="text-xs text-stone-500">{new Date(v.joinedAt).toLocaleDateString()}</span></td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Donations Submissions Table */}
              {submissionType === 'donations' && (
                <div className="admin-table-wrap">
                  {(!adminData?.donationRecords || adminData.donationRecords.length === 0) ? (
                    <div className="admin-empty-state">
                      <p>No donations recorded yet. When users contribute via the Donate modal, receipts appear here.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="admin-data-table">
                        <thead>
                          <tr>
                            <th>Receipt No</th>
                            <th>Donor Name</th>
                            <th>Amount</th>
                            <th>Cause</th>
                            <th>PAN (80G)</th>
                            <th>Method</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData.donationRecords.map((d) => (
                            <tr key={d.receiptNo}>
                              <td><code className="admin-code-badge">{d.receiptNo}</code></td>
                              <td><strong>{d.donorName}</strong></td>
                              <td><strong style={{ color: '#b45309' }}>₹{d.amount.toLocaleString()}</strong></td>
                              <td>{d.cause}</td>
                              <td>{d.pan || 'N/A'}</td>
                              <td><span className="admin-role-badge">{d.paymentMethod}</span></td>
                              <td><span className="text-xs text-stone-500">{new Date(d.timestamp).toLocaleDateString()}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Messages Table */}
              {submissionType === 'messages' && (
                <div className="admin-table-wrap">
                  {(!adminData?.contactMessages || adminData.contactMessages.length === 0) ? (
                    <div className="admin-empty-state">
                      <p>No contact inquiries received yet.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="admin-data-table">
                        <thead>
                          <tr>
                            <th>Ticket ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData.contactMessages.map((m) => (
                            <tr key={m.id}>
                              <td><code className="admin-code-badge">{m.id}</code></td>
                              <td><strong>{m.name}</strong></td>
                              <td>{m.email}</td>
                              <td><span className="admin-role-badge">{m.subject}</span></td>
                              <td className="max-w-xs">{m.message}</td>
                              <td><span className="text-xs text-stone-500">{new Date(m.receivedAt || m.date || Date.now()).toLocaleDateString()}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Newsletter Table */}
              {submissionType === 'newsletters' && (
                <div className="admin-table-wrap">
                  {(!adminData?.newsletterSubscribers || adminData.newsletterSubscribers.length === 0) ? (
                    <div className="admin-empty-state">
                      <p>No newsletter subscribers yet.</p>
                    </div>
                  ) : (
                    <ul className="admin-newsletter-list">
                      {adminData.newsletterSubscribers.map((email, idx) => (
                        <li key={idx} className="admin-newsletter-item">
                          <span>✉️ {email}</span>
                          <span className="text-xs text-stone-400">Subscribed</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EVENTS MANAGER */}
          {activeTab === 'events' && (
            <div className="admin-events-view">
              {/* Add New Event Form */}
              <div className="admin-form-box">
                <h3 className="admin-subheading">
                  <PlusCircle size={18} color="#b45309" className="inline mr-2" />
                  Add New Event or Drive
                </h3>

                <form onSubmit={handleAddEvent} className="admin-grid-form">
                  <div className="form-row-2">
                    <div>
                      <label className="input-sublabel">Event Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mega Beach & Lake Cleanup Drive"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="form-input"
                      />
                    </div>
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
                  </div>

                  <div className="form-row-2 mt-3">
                    <div>
                      <label className="input-sublabel">Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 07:00 AM - 11:00 AM"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Location / Venue</label>
                      <input
                        type="text"
                        placeholder="e.g. Marina Promenade / Govt School"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2 mt-3">
                    <div>
                      <label className="input-sublabel">Category</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className="form-input"
                      >
                        <option value="Environment">Environment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Relief">Relief</option>
                        <option value="Youth & Culture">Youth & Culture</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-sublabel">Total Volunteer Slots</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={eventSlots}
                        onChange={(e) => setEventSlots(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="input-sublabel">Event Coordinator / Leader</label>
                    <input
                      type="text"
                      placeholder="e.g. Karthik R. (RCE Green Wing)"
                      value={eventLeader}
                      onChange={(e) => setEventLeader(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="input-sublabel">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief details about what volunteers will do..."
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary mt-4">
                    <PlusCircle size={16} />
                    <span>Publish Event Live</span>
                  </button>
                </form>
              </div>

              {/* Active Events List */}
              <div className="admin-list-box mt-6">
                <h3 className="admin-subheading">Current Active Events ({adminData?.events?.length || 0})</h3>
                <div className="admin-items-grid">
                  {adminData?.events?.map((ev) => (
                    <div key={ev.id} className="admin-item-card">
                      <div className="admin-item-header">
                        <span className="admin-role-badge">{ev.category}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="admin-delete-btn"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="font-bold text-base mt-2">{ev.title}</h4>
                      <p className="text-xs text-stone-500 mt-1">📅 {ev.date} &bull; ⏰ {ev.time}</p>
                      <p className="text-xs text-stone-500">📍 {ev.location}</p>
                      <p className="text-xs text-stone-600 mt-2">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div className="admin-projects-view">
              {/* Add New Project Form */}
              <div className="admin-form-box">
                <h3 className="admin-subheading">
                  <PlusCircle size={18} color="#b45309" className="inline mr-2" />
                  Add or Launch a New Project Drive
                </h3>

                <form onSubmit={handleAddProject} className="admin-grid-form">
                  <div className="form-row-2">
                    <div>
                      <label className="input-sublabel">Project Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vidhya Connect: School Library Project"
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        className="form-input"
                      />
                    </div>
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
                        <option value="Relief">Relief</option>
                        <option value="Empowerment">Empowerment</option>
                        <option value="Culture & Youth">Culture & Youth</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2 mt-3">
                    <div>
                      <label className="input-sublabel">Target Goal Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="300000"
                        value={projGoal}
                        onChange={(e) => setProjGoal(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Already Raised (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={projRaised}
                        onChange={(e) => setProjRaised(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="input-sublabel">Catchy Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Setting up 50 modern libraries in government primary schools"
                      value={projTagline}
                      onChange={(e) => setProjTagline(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-2 mt-3">
                    <div>
                      <label className="input-sublabel">Beneficiaries Count</label>
                      <input
                        type="text"
                        placeholder="e.g. 2,000+ Students"
                        value={projBeneficiaries}
                        onChange={(e) => setProjBeneficiaries(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="col-span-full">
                      <ImageUploadInput
                        label="Project Cover Photo"
                        value={projImage}
                        onChange={setProjImage}
                        helpText="Upload cover image file from your device"
                        previewHeight="130px"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="input-sublabel">Highlights (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Free storybooks, Digital tabs, Reading clubs"
                      value={projHighlights}
                      onChange={(e) => setProjHighlights(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="input-sublabel">Full Description</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed explanation of the project's purpose..."
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      className="form-input textarea"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary mt-4">
                    <PlusCircle size={16} />
                    <span>Create & Launch Project</span>
                  </button>
                </form>
              </div>

              {/* Active Projects List */}
              <div className="admin-list-box mt-6">
                <h3 className="admin-subheading">Current Projects ({adminData?.projects?.length || 0})</h3>
                <div className="admin-items-grid">
                  {adminData?.projects?.map((p) => (
                    <div key={p.id} className="admin-item-card">
                      <div className="admin-item-header">
                        <span className="admin-role-badge">{p.category}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p.id)}
                          className="admin-delete-btn"
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="font-bold text-base mt-2">{p.title}</h4>
                      <p className="text-xs text-stone-500 mt-1">{p.tagline}</p>
                      <div className="mt-2 text-xs">
                        <strong>Goal:</strong> ₹{p.goal.toLocaleString()} &bull; <strong>Raised:</strong> ₹{p.raised.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE COUNTERS / STATS */}
          {activeTab === 'stats' && (
            <div className="admin-stats-view">
              <div className="admin-form-box">
                <h3 className="admin-subheading">
                  <BarChart3 size={18} color="#b45309" className="inline mr-2" />
                  Live Footprint & Impact Numbers Editor
                </h3>
                <p className="text-sm text-stone-600 mb-4">
                  Update your club's global impact statistics. These numbers are immediately visible to all website visitors.
                </p>

                <form onSubmit={handleUpdateStats} className="admin-grid-form">
                  <div className="form-row-2">
                    <div>
                      <label className="input-sublabel">Lives Impacted</label>
                      <input
                        type="number"
                        value={statsLives}
                        onChange={(e) => setStatsLives(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Saplings Planted</label>
                      <input
                        type="number"
                        value={statsTrees}
                        onChange={(e) => setStatsTrees(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row-2 mt-3">
                    <div>
                      <label className="input-sublabel">Nutritious Meals Served</label>
                      <input
                        type="number"
                        value={statsMeals}
                        onChange={(e) => setStatsMeals(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="input-sublabel">Free Health Camps Conducted</label>
                      <input
                        type="number"
                        value={statsCamps}
                        onChange={(e) => setStatsCamps(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary mt-4">
                    <CheckCircle2 size={16} />
                    <span>Save & Update Counters</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
