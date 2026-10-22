import React, { useState } from 'react';
import { X, CheckCircle2, Users, Award, GraduationCap, Briefcase, Sparkles, Send } from 'lucide-react';
import { submitJoinApplication } from '../services/api';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
  onSuccessRegistered?: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'Volunteer',
  onSuccessRegistered,
}) => {
  const [roleType, setRoleType] = useState(defaultRole || 'Volunteer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [collegeId, setCollegeId] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');
  const [emergencyContact, setEmergencyContact] = useState('');
  const occupation = 'Student';
  const [skills, setSkills] = useState('Ground Drives & Field Work');
  const [availability, setAvailability] = useState('Weekends (Saturday/Sunday)');
  const [preferredDomain, setPreferredDomain] = useState('Child Education & Vidhya Connect');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{ id: string; name: string } | null>(null);

  if (!isOpen) return null;

  const roleOptions = [
    {
      id: 'Volunteer',
      title: 'Volunteer',
      desc: 'Participate in weekend drives, distribution & ground activities',
      icon: <Users size={20} color="#b45309" />,
    },
    {
      id: 'Member',
      title: 'Active Member',
      desc: 'Core team organizing, project planning & leadership',
      icon: <Award size={20} color="#78350f" />,
    },
    {
      id: 'Student',
      title: 'Campus Ambassador',
      desc: 'Lead student chapter drives in your college or school',
      icon: <GraduationCap size={20} color="#d97706" />,
    },
    {
      id: 'Mentor',
      title: 'Mentor / Professional',
      desc: 'Offer career guidance, legal/medical advice or CSR support',
      icon: <Briefcase size={20} color="#92400e" />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name, email, and contact number.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitJoinApplication({
        fullName,
        email,
        phone,
        roleType,
        department,
        collegeId,
        yearOfStudy,
        bloodGroup,
        emergencyContact,
        city: city || 'Chennai / TN',
        occupation: occupation || 'Student',
        skills,
        availability,
        preferredDomain,
        message,
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

              {/* College & Student Details */}
              <div className="form-group">
                <label className="form-label">3. College Department & Details</label>
                <div className="form-row-2">
                  <div>
                    <label className="input-sublabel">Department / Branch</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="form-input"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                      <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Management Studies / MBA">Management Studies / MBA</option>
                      <option value="Alumni / Faculty / External">Alumni / Faculty / External</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-sublabel">Student ID / Roll No</label>
                    <input
                      type="text"
                      placeholder="e.g. 23CS105"
                      value={collegeId}
                      onChange={(e) => setCollegeId(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2 mt-3">
                  <div>
                    <label className="input-sublabel">Year of Study</label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="form-input"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="PG / Alumni">PG / Alumni</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-sublabel">Blood Group</label>
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
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="input-sublabel">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 94441 55667 (Parent / Guardian)"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Skills & Availability */}
              <div className="form-group">
                <label className="form-label">4. Volunteering Preference & Skills</label>
                <div className="form-row-2">
                  <div>
                    <label className="input-sublabel">Preferred Cause / Domain</label>
                    <select
                      value={preferredDomain}
                      onChange={(e) => setPreferredDomain(e.target.value)}
                      className="form-input"
                    >
                      <option value="Child Education & Vidhya Connect">Child Education & Vidhya Connect</option>
                      <option value="Green Earth Miyawaki Afforestation">Green Earth Miyawaki Afforestation</option>
                      <option value="Arogya Free Health & Eye Camps">Arogya Free Health & Eye Camps</option>
                      <option value="Annapoorna Hospital Food Drive">Annapoorna Hospital Food Drive</option>
                      <option value="Kala Uday Youth Leadership">Kala Uday Youth Leadership</option>
                      <option value="Media & Event Logistics">Media & Event Logistics</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-sublabel">Availability</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="form-input"
                    >
                      <option value="Weekends (Saturday/Sunday)">Weekends (Saturday/Sunday)</option>
                      <option value="Flexible Weekdays">Flexible Weekdays</option>
                      <option value="Emergency Relief On-Call">Emergency Relief On-Call</option>
                      <option value="Remote / Digital Support">Remote / Digital Support</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="input-sublabel">Primary Skill / Strength</label>
                  <select
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="form-input"
                  >
                    <option value="Ground Drives & Field Work">Ground Drives & Field Work</option>
                    <option value="Teaching & Tutoring Kids">Teaching & Tutoring Kids</option>
                    <option value="Miyawaki Tree Plantation">Miyawaki Tree Plantation</option>
                    <option value="Medical Camp Coordination">Medical Camp Coordination</option>
                    <option value="Social Media & Content Creation">Social Media & Content Creation</option>
                    <option value="Event Planning & Logistics">Event Planning & Logistics</option>
                  </select>
                </div>

                {/* Optional Motivation Message */}
                <div className="mt-3">
                  <label className="input-sublabel">Why would you like to join? (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Share a few words about what motivates you to serve..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-input textarea"
                  ></textarea>
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
