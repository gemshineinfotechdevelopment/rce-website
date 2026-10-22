import React, { useState } from 'react';
import { X, Heart, ShieldCheck, QrCode, CheckCircle2, Printer } from 'lucide-react';
import { submitDonation } from '../services/api';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCause?: string;
  onSuccessDonated?: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  defaultCause = 'Child Education & Vidhya Connect',
  onSuccessDonated,
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cause, setCause] = useState<string>(defaultCause || 'Child Education & Vidhya Connect');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pan, setPan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [receiptData, setReceiptData] = useState<any | null>(null);

  if (!isOpen) return null;

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(Number(val));
    }
  };

  const getImpactDescription = (amt: number) => {
    if (amt < 800) {
      return 'Provides school bag, notebooks, and geometry stationery for 2 underprivileged kids.';
    } else if (amt < 2000) {
      return 'Plants & protects 5 native shade trees with bamboo guards and 1-year water support.';
    } else if (amt < 4000) {
      return 'Covers free ophthalmic screening and prescription glasses for 5 elderly villagers.';
    } else if (amt < 8000) {
      return 'Sponsors 120 freshly cooked nutritious meals for government hospital patient attendants.';
    } else {
      return 'Full 1-year STEM coaching scholarship and learning tablet for a brilliant high-school girl.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (amount < 50) {
      setErrorMsg('Minimum contribution amount is ₹50.');
      return;
    }
    if (!donorName.trim() || !email.trim()) {
      setErrorMsg('Please provide your name and email to receive the 80G tax receipt.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitDonation({
        donorName,
        email,
        phone,
        pan,
        amount,
        cause,
        paymentMethod,
      });

      setReceiptData(res.receipt);
      if (onSuccessDonated) onSuccessDonated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Donation submission failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setReceiptData(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <div className="modal-content modal-donate" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="section-tag gold">
              <Heart size={12} fill="currentColor" />
              Empower Lives Through Giving
            </span>
            <h2 className="modal-title">Make a Tax-Deductible Contribution</h2>
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
          {receiptData ? (
            <div className="receipt-card">
              <div className="receipt-header">
                <div className="receipt-check">
                  <CheckCircle2 size={44} color="#b45309" />
                </div>
                <h3>Contribution Received!</h3>
                <p>Thank you, {receiptData.donorName}. Your kindness helps shape a brighter tomorrow.</p>
              </div>

              <div className="receipt-table">
                <div className="receipt-row">
                  <span>Receipt No:</span>
                  <strong>{receiptData.receiptNo}</strong>
                </div>
                <div className="receipt-row">
                  <span>Amount Contributed:</span>
                  <strong className="text-lg" style={{ color: '#b45309' }}>₹{receiptData.amount.toLocaleString()}</strong>
                </div>
                <div className="receipt-row">
                  <span>Supported Cause:</span>
                  <span>{receiptData.cause}</span>
                </div>
                <div className="receipt-row">
                  <span>PAN (80G Tax Benefit):</span>
                  <span>{receiptData.pan || 'N/A'}</span>
                </div>
                <div className="receipt-row">
                  <span>Date & Time:</span>
                  <span>{new Date(receiptData.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="receipt-row">
                  <span>Tax Exemption Status:</span>
                  <span className="text-emerald-700 font-bold">100% Valid u/s 80G</span>
                </div>
              </div>

              <div className="receipt-actions">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-outline flex-1"
                >
                  <Printer size={16} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="btn-primary flex-1"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="donate-form">
              {/* Select Cause */}
              <div className="form-group">
                <label className="form-label">1. Select Cause / Initiative</label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="form-input"
                >
                  <option value="Child Education & Vidhya Connect">Child Education & Vidhya Connect</option>
                  <option value="Green Earth: Miyawaki 25,000 Saplings">Green Earth: Miyawaki 25,000 Saplings</option>
                  <option value="Arogya: Community Eye & Health Camps">Arogya: Community Eye & Health Camps</option>
                  <option value="Annapoorna: Zero-Hunger Weekend Drives">Annapoorna: Zero-Hunger Weekend Drives</option>
                  <option value="Shakthi: Women Skill Development Hub">Shakthi: Women Skill Development Hub</option>
                  <option value="General Community Welfare Fund">General Community Welfare Fund</option>
                </select>
              </div>

              {/* Select Amount */}
              <div className="form-group">
                <label className="form-label">2. Choose Contribution Amount (INR)</label>
                <div className="preset-amount-grid">
                  {presetAmounts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`preset-btn ${amount === p && !customAmount ? 'active' : ''}`}
                      onClick={() => handlePresetSelect(p)}
                    >
                      ₹{p.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="custom-amount-wrapper mt-3">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="text"
                    placeholder="Or enter custom amount (e.g. 15000)"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="form-input custom-input"
                  />
                </div>

                {/* Live Impact Readout */}
                <div className="impact-readout-card">
                  <span className="impact-icon">💡</span>
                  <p className="impact-desc">
                    <strong>Your Impact:</strong> {getImpactDescription(amount)}
                  </p>
                </div>
              </div>

              {/* Donor Details */}
              <div className="form-group">
                <label className="form-label">3. Donor Information (For 80G Tax Exemption Receipt)</label>
                <div className="form-row-2">
                  <div>
                    <label className="input-sublabel">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Priya Raman"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">Email Address (for receipt) *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. priya@hospital.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row-2 mt-3">
                  <div>
                    <label className="input-sublabel">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98400 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="input-sublabel">PAN Number (Optional, for 80G)</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="e.g. ABCDE1234F"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      className="form-input uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector & Instant QR */}
              <div className="form-group">
                <label className="form-label">4. Payment Mode</label>
                <div className="payment-method-selector">
                  <button
                    type="button"
                    className={`pay-method-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <QrCode size={18} />
                    <span>UPI / QR Code</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-method-btn ${paymentMethod === 'Bank Transfer' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('Bank Transfer')}
                  >
                    <span>Bank Transfer (NEFT/IMPS)</span>
                  </button>
                </div>

                {paymentMethod === 'UPI' ? (
                  <div className="upi-preview-box">
                    <div className="upi-qr-placeholder">
                      <div className="qr-box-simulated">
                        <QrCode size={90} className="text-stone-800" />
                        <span className="qr-badge">SCAN & PAY WITH ANY UPI APP</span>
                      </div>
                    </div>
                    <div className="upi-text-info">
                      <p><strong>Official UPI VPA:</strong> <code>rceclub@upi</code></p>
                      <p className="text-xs text-stone-500">Supports Google Pay, PhonePe, Paytm, BHIM & all banking apps.</p>
                      <p className="tax-notice">
                        <ShieldCheck size={14} color="#b45309" className="inline mr-1" />
                        All donations are exempt under Section 80G of the Indian Income Tax Act.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bank-details-box">
                    <p><strong>Account Name:</strong> RCE SOCIAL SERVICE CLUB TRUST</p>
                    <p><strong>Account Number:</strong> 92002008472910</p>
                    <p><strong>IFSC Code:</strong> HDFC0001234</p>
                    <p><strong>Branch:</strong> Anna Nagar East, Chennai</p>
                  </div>
                )}
              </div>

              {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

              {/* Donate Button */}
              <div className="modal-submit-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full btn-large"
                >
                  <Heart size={18} fill="currentColor" />
                  <span>
                    {loading
                      ? 'Generating Receipt...'
                      : `Donate ₹${amount.toLocaleString()} & Get 80G Receipt`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
