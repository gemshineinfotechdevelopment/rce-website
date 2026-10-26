import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Users, Award, GraduationCap, Briefcase, Sparkles, Send } from 'lucide-react';
import { submitJoinApplication, type ProjectItem } from '../services/api';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
  projects?: ProjectItem[];
  onSuccessRegistered?: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'Volunteer',
  projects: _projects = [],
  onSuccessRegistered,
}) => {
  const [roleType, setRoleType] = useState(defaultRole || 'Volunteer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('Working Professional');
  const [organization, setOrganization] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (defaultRole) {
      setRoleType(defaultRole);
    }
  }, [defaultRole, isOpen]);

  if (!isOpen) return null;

  const roleOptions = [
    {
      id: 'Volunteer',
      title: 'Volunteer',
      desc: 'Join weekend ground drives, distribution, tree plantation & community work',
      icon: <Users size={20} color="#b45309" />,
    },
    {
      id: 'Member',
      title: 'Active Member',
      desc: 'Core team organizing, project coordination & community leadership',
      icon: <Award size={20} color="#78350f" />,
    },
    {
      id: 'Youth & Student',
      title: 'Youth & Student',
      desc: 'Campus initiatives, school mentorship drives and student volunteering',
      icon: <GraduationCap size={20} color="#d97706" />,
    },
    {
      id: 'Mentor / Professional',
      title: 'Mentor / Professional',
      desc: 'Career guidance, medical/legal advice, training, or CSR collaboration',
      icon: <Briefcase size={20} color="#92400e" />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    2
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name, email, and contact number.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitJoinApplication({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        roleType,
        department: organization.trim() || occupation,
        collegeId: 'N/A',
        yearOfStudy: 'N/A',
        bloodGroup,
        emergencyContact: emergencyContact.trim() || 'Not provided',
        city: city.trim() || 'Chennai / TN',
        occupation: occupation || 'General Citizen',
        skills: 'General Volunteering & Community Drives',
        availability: 'Flexible / Weekends',
        preferredDomain: 'General Community Service',
        message: '',
      });

      setSuccessData({
        id: res.applicationId || 'RCE-VOL-849201',
        name: fullName,
      });

      if (onSuccessRegistered) onSuccessRegistered();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSuccessData(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content modal-join" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="section-tag gold">
              <Sparkles size={12} color="#d97706" />
              Join RCE Movement
            </span>
            <h2 className="modal-title">Become Part of the Family</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={resetAndClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {successData ? (
            <div className="join-success-card">
              <div className="success-icon-wrap">
                <CheckCircle2 size={54} color="#b45309" />
              </div>
              <h3 className="success-heading">Welcome to the Family, {successData.name}!</h3>
              <p className="success-text">
                Your application has been received and verified. Our volunteer coordinator will reach out to welcome you to the team.
              </p>

              <div className="app-id-pill">
                <span>Member Registration ID:</span>
                <strong>{successData.id}</strong>
              </div>

              <div className="success-actions">
                <a
                  href="https://chat.whatsapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full"
                >
                  Join Volunteer WhatsApp Group
                </a>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="btn-outline w-full mt-2"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="join-form">
              {/* Role Selector Cards */}
              <div className="form-group">
                <label className="form-label">1. Choose How You Wish to Contribute</label>
                <div className="role-selector-grid">
                  {roleOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className={`role-option-card ${roleType === opt.id ? 'active' : ''}`}
                      onClick={() => setRoleType(opt.id)}
                    >
                      <div className="role-icon-box">{opt.icon}</div>
                      <div className="role-text-box">
                        <span className="role-title">{opt.title}</span>
                        <span className="role-desc">{opt.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="form-group">
                <label className="form-label">2. Personal & Contact Details</label>
                <div className="form-row-2">
                  <div>
                    <label className="input-sublabel">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">Phone Number / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2 mt-3">
                  <div>
                    <label className="input-sublabel">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. anand@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">City / Town</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Coimbatore, etc."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Profile & Background (Universal for All Citizens) */}
              <div className="form-group">
                <label className="form-label">3. Profile & Background</label>
                <div className="form-row-2">
                  <div>
                    <label className="input-sublabel">Occupation / Profile</label>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="form-input"
                    >
                      <option value="Working Professional">Working Professional</option>
                      <option value="College Student">College Student</option>
                      <option value="School Student">School Student</option>
                      <option value="Business / Self-Employed">Business / Self-Employed</option>
                      <option value="Homemaker">Homemaker</option>
                      <option value="Retired / Senior Citizen">Retired / Senior Citizen</option>
                      <option value="Social Worker / Freelancer">Social Worker / Freelancer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-sublabel">Company / College / Workplace (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. TCS, Anna Univ, Self-Employed, etc."
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2 mt-3">
                  <div>
                    <label className="input-sublabel">Blood Group (Optional)</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="form-input"
                    >
                      <option value="O+ Positive">O+ Positive</option>
                      <option value="A+ Positive">A+ Positive</option>
                      <option value="B+ Positive">B+ Positive</option>
                      <option value="AB+ Positive">AB+ Positive</option>
                      <option value="O- Negative">O- Negative</option>
                      <option value="A- Negative">A- Negative</option>
                      <option value="B- Negative">B- Negative</option>
                      <option value="AB- Negative">AB- Negative</option>
                      <option value="Not Sure">Not Sure / Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-sublabel">Emergency Contact Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 94441 55667 (Family / Friend)"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

              {/* Submit CTA */}
              <div className="modal-submit-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-secondary w-full btn-large"
                >
                  <Send size={18} />
                  <span>{loading ? 'Submitting Application...' : 'Submit Application & Join'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
