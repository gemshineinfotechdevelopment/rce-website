import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { submitContactForm } from '../services/api';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Suggest a School / Community in Need');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMsg({ text: 'Please fill out all required fields.', isError: true });
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactForm({ name, email, subject, message });
      setStatusMsg({
        text: `Message dispatched! Ticket ID: ${res.ticketId || 'MSG-82910'}. Our team will respond within 24 hours.`,
        isError: false,
      });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatusMsg({
        text: err.message || 'Failed to submit inquiry. Please try again.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-header text-center">
          <span className="section-tag gold">
            <MessageSquare size={14} color="#d97706" />
            Connect With Us
          </span>
          <h2 className="section-title">
            Have Questions or a <span className="text-gradient">Cause to Champion?</span>
          </h2>
          <p className="section-subtitle">
            Every great initiative begins with a conversation. Let us know how we can collaborate.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Card */}
          <div className="contact-info-card card-hover">
            <h3 className="contact-card-title">Club Headquarters</h3>
            <p className="contact-card-sub">
              Visit our central organizing hub or reach out directly to our volunteer desk.
            </p>

            <div className="contact-items-list">
              <div className="contact-item">
                <div className="contact-icon-box orange">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong>Registered Office</strong>
                  <p>RCE Youth Movement Hub, 42 Community Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box green">
                  <Phone size={20} />
                </div>
                <div>
                  <strong>Helpline & WhatsApp</strong>
                  <p>+91 (044) 2894-8800 / +91 98401 22334</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box amber">
                  <Mail size={20} />
                </div>
                <div>
                  <strong>Email Desk</strong>
                  <p>contact@rceclub.org / volunteer@rceclub.org</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box purple">
                  <Clock size={20} />
                </div>
                <div>
                  <strong>Operating Hours</strong>
                  <p>Monday - Saturday: 9:00 AM - 7:00 PM<br />Sunday: On-Ground Field Drives</p>
                </div>
              </div>
            </div>

            <div className="contact-emergency-strip">
              <span>🚨 <strong>Need Emergency Blood or Food Aid?</strong> Call our 24/7 Hotline: <code>+91 99400 99999</code></span>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="contact-form-card card-hover">
            <h3 className="contact-card-title">Send a Message</h3>
            <p className="contact-card-sub">
              Fill out the form below and our volunteer outreach coordinator will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="input-sublabel">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Your Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. meera@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="input-sublabel">Subject / Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input"
                >
                  <option value="Suggest a School / Community in Need">Suggest a School / Community in Need</option>
                  <option value="Corporate CSR Partnership">Corporate CSR Partnership</option>
                  <option value="Hospital / Medical Camp Collaboration">Hospital / Medical Camp Collaboration</option>
                  <option value="Volunteer Grievance / Query">Volunteer Grievance / Query</option>
                  <option value="Donation & 80G Receipt Assistance">Donation & 80G Receipt Assistance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-sublabel">Message / Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message or tell us about the school or cause..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input textarea"
                ></textarea>
              </div>

              {statusMsg && (
                <div
                  className={`status-alert-banner ${statusMsg.isError ? 'error' : 'success'}`}
                >
                  {!statusMsg.isError && <CheckCircle2 size={16} className="mr-1 inline" />}
                  {statusMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-large"
              >
                <Send size={18} />
                <span>{loading ? 'Transmitting Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
