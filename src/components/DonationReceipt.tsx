import React, { useState } from 'react';
import { Printer, CheckCircle, ShieldCheck, X, Award, Check } from 'lucide-react';

export interface DonationReceiptData {
  receiptNo: string;
  donorName: string;
  email?: string;
  phone?: string;
  pan?: string;
  amount: number;
  cause: string;
  paymentMethod?: string;
  transactionId?: string;
  timestamp: string | number | Date;
  status?: string;
}

interface DonationReceiptProps {
  receipt: DonationReceiptData;
  onClose?: () => void;
  showCloseBtn?: boolean;
}

// Convert numbers into Indian Rupee Words (Lakhs, Crores, Thousands)
export function numberToWordsINR(num: number): string {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
  }

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remaining = Math.floor(num % 100);

  let str = '';
  if (crore > 0) str += inWords(crore) + ' Crore ';
  if (lakh > 0) str += inWords(lakh) + ' Lakh ';
  if (thousand > 0) str += inWords(thousand) + ' Thousand ';
  if (hundred > 0) str += inWords(hundred) + ' Hundred ';
  if (remaining > 0) {
    if (str !== '') str += 'and ';
    str += inWords(remaining) + ' ';
  }

  return str.trim() + ' Rupees Only';
}

export const DonationReceipt: React.FC<DonationReceiptProps> = ({
  receipt,
  onClose,
  showCloseBtn = true,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const receiptDate = new Date(receipt.timestamp || Date.now());
  const formattedDate = receiptDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = receiptDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate Financial Year & Assessment Year
  const month = receiptDate.getMonth();
  const fullYear = receiptDate.getFullYear();
  const fyStart = month >= 3 ? fullYear : fullYear - 1;
  const financialYear = `FY ${fyStart}-${(fyStart + 1).toString().slice(-2)}`;
  const assessmentYear = `AY ${fyStart + 1}-${(fyStart + 2).toString().slice(-2)}`;

  const amountInWords = numberToWordsINR(receipt.amount);

  // Reliable Direct Print Function: Injects clean standalone certificate into hidden iframe
  const handlePrint = () => {
    setIsPrinting(true);
    const receiptElem = document.getElementById('printable-receipt');

    if (!receiptElem) {
      window.print();
      setIsPrinting(false);
      return;
    }

    try {
      // Remove any prior print iframe
      const oldIframe = document.getElementById('rce-print-frame');
      if (oldIframe) {
        oldIframe.remove();
      }

      // Create isolated invisible iframe for printing
      const iframe = document.createElement('iframe');
      iframe.id = 'rce-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.opacity = '0.01';
      iframe.style.pointerEvents = 'none';
      iframe.style.border = '0';
      iframe.title = 'RCE Donation Bill Print';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        window.print();
        setIsPrinting(false);
        return;
      }

      const receiptClone = receiptElem.cloneNode(true) as HTMLElement;

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>RCE_Donation_Certificate_${receipt.receiptNo}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              background: #ffffff;
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
              color: #1e293b;
              line-height: 1.45;
              padding: 4mm 6mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: A4 portrait;
              margin: 6mm;
            }

            .exec-receipt-card {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              overflow: hidden;
              position: relative;
            }

            .exec-top-accent-bar {
              height: 6px;
              background: linear-gradient(90deg, #9a3412 0%, #d97706 50%, #f59e0b 100%);
            }

            .exec-receipt-content {
              padding: 22px 26px;
            }

            /* Header Row */
            .exec-header-row {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 20px;
              padding-bottom: 16px;
              border-bottom: 1.5px solid #e2e8f0;
            }
            .exec-brand-col {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .exec-logo-img {
              width: 72px;
              height: 72px;
              object-fit: contain;
              border-radius: 50%;
              border: 2px solid #b45309;
              padding: 2px;
              background: #ffffff;
            }
            .exec-org-meta {
              display: flex;
              flex-direction: column;
            }
            .exec-estd-badge {
              font-size: 0.65rem;
              font-weight: 800;
              letter-spacing: 0.08em;
              color: #b45309;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .exec-trust-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: 1.35rem;
              font-weight: 900;
              color: #1e293b;
              line-height: 1.15;
              letter-spacing: 0.02em;
            }
            .exec-trust-sub {
              font-size: 0.74rem;
              font-weight: 600;
              color: #64748b;
              margin-top: 2px;
            }
            .exec-address-text {
              font-size: 0.72rem;
              color: #475569;
              margin-top: 2px;
            }

            .exec-cert-badge-col {
              text-align: right;
              flex-shrink: 0;
            }
            .exec-form-pill {
              display: inline-block;
              background: #fef3c7;
              border: 1px solid #f59e0b;
              color: #92400e;
              font-weight: 800;
              font-size: 0.72rem;
              padding: 4px 10px;
              border-radius: 4px;
              letter-spacing: 0.04em;
              text-transform: uppercase;
            }
            .exec-cert-name {
              font-family: 'Outfit', sans-serif;
              font-size: 1.15rem;
              font-weight: 800;
              color: #0f172a;
              margin-top: 4px;
            }
            .exec-cert-copy-tag {
              font-size: 0.68rem;
              color: #64748b;
              font-weight: 600;
            }

            /* Credential Strip */
            .exec-credential-strip {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 6px 12px;
              margin: 12px 0 16px;
              font-size: 0.72rem;
            }
            .cred-item {
              color: #334155;
            }
            .cred-item strong {
              color: #0f172a;
            }
            .cred-divider {
              color: #cbd5e1;
            }

            /* Voucher Metadata 4-Box Grid */
            .exec-voucher-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 16px;
            }
            .voucher-stat-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 8px 12px;
            }
            .voucher-stat-label {
              font-size: 0.65rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #64748b;
              font-weight: 700;
              margin-bottom: 2px;
            }
            .voucher-stat-value {
              font-size: 0.84rem;
              font-weight: 800;
              color: #0f172a;
            }
            .voucher-serial-no {
              color: #b45309 !important;
              font-family: 'Outfit', monospace !important;
              font-size: 0.92rem !important;
            }

            /* Section Sub-headings */
            .exec-section-heading {
              font-size: 0.75rem;
              font-weight: 800;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: #475569;
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 6px;
            }

            /* Donor Particulars Table */
            .exec-donor-card {
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              overflow: hidden;
              margin-bottom: 16px;
              background: #ffffff;
            }
            .donor-spec-row {
              display: grid;
              grid-template-columns: 140px 1fr 140px 1fr;
              border-bottom: 1px solid #f1f5f9;
            }
            .donor-spec-row:last-child {
              border-bottom: none;
            }
            .spec-label {
              background: #f8fafc;
              padding: 8px 12px;
              font-size: 0.76rem;
              font-weight: 700;
              color: #475569;
              border-right: 1px solid #f1f5f9;
              display: flex;
              align-items: center;
            }
            .spec-value {
              padding: 8px 12px;
              font-size: 0.8rem;
              font-weight: 600;
              color: #0f172a;
              border-right: 1px solid #f1f5f9;
              display: flex;
              align-items: center;
            }
            .spec-value:last-child {
              border-right: none;
            }
            .donor-name-highlight {
              font-size: 0.86rem;
              font-weight: 800;
              color: #0f172a;
            }
            .pan-tag {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background: #f1f5f9;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: monospace;
              font-weight: 800;
              color: #0f172a;
            }

            /* Breakdown Table */
            .exec-table-card {
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              overflow: hidden;
              margin-bottom: 16px;
            }
            .exec-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.8rem;
            }
            .exec-table th {
              background: #1e293b;
              color: #ffffff;
              padding: 8px 12px;
              font-weight: 700;
              font-size: 0.72rem;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              text-align: left;
            }
            .exec-table th:last-child {
              text-align: right;
            }
            .exec-table td {
              padding: 9px 12px;
              border-bottom: 1px solid #f1f5f9;
              color: #334155;
            }
            .exec-table td:last-child {
              text-align: right;
            }
            .total-calc-row td {
              background: #f8fafc;
              font-weight: 800;
              color: #0f172a;
              border-top: 1.5px solid #cbd5e1;
              font-size: 0.84rem;
            }
            .total-amount-highlight {
              font-size: 1.05rem !important;
              color: #9a3412 !important;
              font-family: 'Outfit', sans-serif;
            }

            /* Amount Words Strip */
            .exec-words-strip {
              background: #fefce8;
              border: 1px solid #fef08a;
              border-radius: 6px;
              padding: 8px 14px;
              margin-bottom: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.8rem;
            }
            .words-label {
              font-weight: 800;
              color: #854d0e;
              text-transform: uppercase;
              font-size: 0.7rem;
              letter-spacing: 0.04em;
            }
            .words-text {
              font-weight: 800;
              color: #1e293b;
              font-style: italic;
            }

            /* Statutory 80G Box */
            .exec-tax-card {
              background: #f0fdf4;
              border: 1.5px solid #86efac;
              border-radius: 6px;
              padding: 10px 14px;
              margin-bottom: 18px;
              font-size: 0.74rem;
              line-height: 1.45;
              color: #166534;
            }
            .tax-card-title {
              font-weight: 800;
              font-size: 0.76rem;
              color: #14532d;
              margin-bottom: 3px;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .tax-card-body strong {
              color: #14532d;
            }
            .tax-card-body code {
              background: #dcfce7;
              padding: 1px 4px;
              border-radius: 3px;
              font-family: monospace;
              font-weight: 700;
            }

            /* Signatures & Seal Row */
            .exec-sign-row {
              display: grid;
              grid-template-columns: 1fr 140px 1.4fr;
              gap: 16px;
              align-items: flex-end;
              padding-top: 14px;
              border-top: 1.5px solid #e2e8f0;
            }

            /* Digital Verification Badge */
            .exec-verify-col {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
            }
            .verify-pill {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 3px 8px;
              border-radius: 9999px;
              font-size: 0.68rem;
              font-weight: 800;
              color: #334155;
            }
            .verify-caption {
              font-size: 0.65rem;
              color: #64748b;
              line-height: 1.35;
            }

            /* Circular Seal */
            .exec-seal-col {
              text-align: center;
            }
            .exec-round-seal {
              width: 94px;
              height: 94px;
              margin: 0 auto;
              border: 2px dashed #b45309;
              border-radius: 50%;
              padding: 4px;
              background: #fffbeb;
              display: flex;
              align-items: center;
              justify-content: center;
              transform: rotate(-4deg);
            }
            .seal-inner-circle {
              width: 100%;
              height: 100%;
              border: 1px solid #b45309;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 4px 2px;
              text-align: center;
              color: #b45309;
            }
            .seal-txt-top { font-size: 0.42rem; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; }
            .seal-crest { display: flex; flex-direction: column; align-items: center; line-height: 1.1; }
            .seal-star { font-size: 0.58rem; color: #d97706; }
            .seal-name { font-family: 'Cinzel', serif; font-size: 0.8rem; font-weight: 900; }
            .seal-reg { font-size: 0.44rem; font-weight: 800; }
            .seal-txt-btm { font-size: 0.4rem; font-weight: 900; text-transform: uppercase; }
            .seal-caption-note { font-size: 0.6rem; color: #78716c; font-style: italic; margin-top: 3px; }

            /* Signatory Column */
            .exec-signatory-col {
              text-align: right;
            }
            .for-trust-note {
              font-size: 0.74rem;
              font-weight: 800;
              color: #1e293b;
            }
            .auth-sub {
              font-size: 0.66rem;
              color: #64748b;
              font-style: italic;
            }
            .exec-fluid-signature {
              font-family: 'Brush Script MT', 'Segoe Script', cursive, sans-serif;
              font-size: 1.55rem;
              color: #1e3a8a;
              margin: 4px 0 -4px 0;
            }
            .signatory-rule {
              border-top: 1.5px solid #0f172a;
              margin-top: 4px;
              padding-top: 4px;
              font-weight: 800;
              font-size: 0.82rem;
              color: #0f172a;
            }
            .signatory-role {
              font-size: 0.72rem;
              color: #b45309;
              font-weight: 700;
            }

            /* Footer */
            .exec-cert-footer {
              margin-top: 14px;
              text-align: center;
              font-size: 0.66rem;
              color: #94a3b8;
              border-top: 1px solid #f1f5f9;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          ${receiptClone.outerHTML}
        </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        setIsPrinting(false);
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          window.print();
        }
      }, 300);
    } catch (err) {
      console.warn('Iframe print error, falling back to window.print():', err);
      window.print();
      setIsPrinting(false);
    }
  };

  return (
    <div className="donation-receipt-wrapper">
      {/* Action Toolbar on Screen (hidden when printed) */}
      <div className="receipt-screen-toolbar no-print">
        <div className="receipt-toolbar-left">
          <span className="receipt-status-pill">
            <CheckCircle size={15} className="text-emerald-600" />
            <span>Official 80G Tax Exemption Certificate</span>
          </span>
        </div>
        <div className="receipt-toolbar-right">
          <button
            type="button"
            onClick={handlePrint}
            className="btn-receipt-action btn-print-primary"
            title="Print or Save as PDF"
            disabled={isPrinting}
          >
            <Printer size={16} />
            <span>{isPrinting ? 'Preparing Certificate...' : 'Print / Save PDF'}</span>
          </button>
          {showCloseBtn && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-receipt-action btn-receipt-close"
              title="Close certificate preview"
              aria-label="Close certificate preview"
            >
              <X size={15} />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* The Printable Official Executive 80G Tax Certificate Document (100% English) */}
      <div className="receipt-certificate-printable" id="printable-receipt">
        <div className="exec-receipt-card">
          {/* Top Gold Gradient Bar */}
          <div className="exec-top-accent-bar"></div>

          <div className="exec-receipt-content">
            {/* Header Section */}
            <div className="exec-header-row">
              <div className="exec-brand-col">
                <img
                  src="/Rce.logo.png"
                  alt="RCE Official Crest"
                  className="exec-logo-img"
                />
                <div className="exec-org-meta">
                  <span className="exec-estd-badge">ESTD. 2021 • GOVERNMENT RECOGNIZED CHARITABLE TRUST</span>
                  <h1 className="exec-trust-title">RIGHT CLUB FOR EDUCATION CHARITABLE TRUST</h1>
                  <span className="exec-trust-sub">Registered under Indian Trusts Act, 1882 • NITI Aayog NGO Darpan Reg: TN/2021/0284920</span>
                  <span className="exec-address-text">
                    Head Office: 14/2, Gandhi Road, Sivakasi - 626123, Virudhunagar Dist., Tamil Nadu | Branch Office: Chennai, India
                  </span>
                </div>
              </div>

              <div className="exec-cert-badge-col">
                <span className="exec-form-pill">Form 10BE / Sec 80G</span>
                <h2 className="exec-cert-name">DONATION RECEIPT</h2>
                <span className="exec-cert-copy-tag">Original Donor Copy • Tax Exemption Certificate</span>
              </div>
            </div>

            {/* Credential Strip */}
            <div className="exec-credential-strip">
              <span className="cred-item"><strong>Trust PAN:</strong> AAATR8492G</span>
              <span className="cred-divider">•</span>
              <span className="cred-item"><strong>12A Registration:</strong> AAATR8492GE20210</span>
              <span className="cred-divider">•</span>
              <span className="cred-item"><strong>80G Approval URN:</strong> CIT(E)/CHN/80G/2021-22/A-412</span>
              <span className="cred-divider">•</span>
              <span className="cred-item"><strong>Contact:</strong> +91 94421 84920 / contact@rceindia.org</span>
            </div>

            {/* Voucher 4-Box Grid */}
            <div className="exec-voucher-grid">
              <div className="voucher-stat-box">
                <div className="voucher-stat-label">Receipt Voucher No</div>
                <div className="voucher-stat-value voucher-serial-no">{receipt.receiptNo}</div>
              </div>
              <div className="voucher-stat-box">
                <div className="voucher-stat-label">Issue Date & Time</div>
                <div className="voucher-stat-value">{formattedDate}, {formattedTime}</div>
              </div>
              <div className="voucher-stat-box">
                <div className="voucher-stat-label">Financial Year</div>
                <div className="voucher-stat-value">{financialYear}</div>
              </div>
              <div className="voucher-stat-box">
                <div className="voucher-stat-label">Assessment Year</div>
                <div className="voucher-stat-value">{assessmentYear}</div>
              </div>
            </div>

            {/* Donor Particulars Section */}
            <div className="exec-section-heading">
              <Award size={14} className="text-amber-700" />
              <span>Donor & Remittance Particulars</span>
            </div>

            <div className="exec-donor-card">
              <div className="donor-spec-row">
                <div className="spec-label">Donor Full Name</div>
                <div className="spec-value donor-name-highlight">
                  Mr./Ms. {receipt.donorName}
                </div>
                <div className="spec-label">Donor PAN</div>
                <div className="spec-value">
                  {receipt.pan && receipt.pan !== 'N/A' ? (
                    <span className="pan-tag">
                      <Check size={12} className="text-emerald-600" />
                      {receipt.pan.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono text-xs">Not Provided</span>
                  )}
                </div>
              </div>

              <div className="donor-spec-row">
                <div className="spec-label">Email Address</div>
                <div className="spec-value">{receipt.email || 'N/A'}</div>
                <div className="spec-label">Contact Phone</div>
                <div className="spec-value">{receipt.phone || 'N/A'}</div>
              </div>

              <div className="donor-spec-row">
                <div className="spec-label">Payment Mode</div>
                <div className="spec-value">{receipt.paymentMethod || 'UPI / Digital Payment'}</div>
                <div className="spec-label">Transaction Ref / UTR</div>
                <div className="spec-value font-mono text-xs text-amber-900 font-bold">
                  {receipt.transactionId || 'UPI-VERIFIED'}
                </div>
              </div>

              <div className="donor-spec-row">
                <div className="spec-label">Allocated Project</div>
                <div className="spec-value font-semibold text-slate-800" style={{ gridColumn: 'span 3' }}>
                  {receipt.cause} (General Educational & Public Welfare Fund)
                </div>
              </div>
            </div>

            {/* Financial Contribution Table */}
            <div className="exec-section-heading">
              <ShieldCheck size={14} className="text-amber-700" />
              <span>Contribution Breakdown & Tax Exemption Schedule</span>
            </div>

            <div className="exec-table-card">
              <table className="exec-table">
                <thead>
                  <tr>
                    <th style={{ width: '45px' }}>#</th>
                    <th>Contribution Description</th>
                    <th style={{ width: '160px' }}>Category</th>
                    <th style={{ width: '160px' }}>80G Benefit</th>
                    <th style={{ width: '150px' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>
                      <strong>Voluntary Contribution for Charitable Welfare</strong>
                      <div className="text-xs text-slate-500">Dedicated towards child education, free healthcare & public afforestation</div>
                    </td>
                    <td>Corpus Donation</td>
                    <td>
                      <span className="text-emerald-700 font-bold">50% Deduction</span>
                    </td>
                    <td className="font-bold font-mono">₹{receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr className="total-calc-row">
                    <td colSpan={4} style={{ textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Total Net Contribution Received:
                    </td>
                    <td className="total-amount-highlight">
                      ₹{receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amount in Words */}
            <div className="exec-words-strip">
              <span className="words-label">Amount in Words:</span>
              <span className="words-text">{amountInWords}</span>
            </div>

            {/* Statutory Tax Exemption Declaration */}
            <div className="exec-tax-card">
              <div className="tax-card-title">
                <ShieldCheck size={16} />
                <span>INCOME TAX BENEFIT UNDER SECTION 80G(5)(vi) OF THE INCOME TAX ACT, 1961:</span>
              </div>
              <div className="tax-card-body">
                This receipt certifies that <strong>RIGHT CLUB FOR EDUCATION CHARITABLE TRUST</strong> is registered under Section 12A of the Income Tax Act, 1961, and donations to the Trust qualify for <strong>50% deduction under Section 80G(5)(vi)</strong> vide Order No. <code>CIT(E)/CHN/80G/2021-22/A-412</code> dated 14-09-2021. All contributions are deployed exclusively towards educational scholarships for underprivileged children, community welfare camps, and rural public missions in accordance with Trust deeds.
              </div>
            </div>

            {/* Signatures & Seal Row */}
            <div className="exec-sign-row">
              {/* Digital Audit Verification */}
              <div className="exec-verify-col">
                <div className="verify-pill">
                  <CheckCircle size={13} className="text-emerald-600" />
                  <span>Digitally Recorded & Verified</span>
                </div>
                <div className="verify-caption">
                  Computer-generated statutory tax invoice.<br />
                  Valid for Indian Income Tax filing purposes.<br />
                  Audit Code: <strong>RCE-{receipt.receiptNo}</strong>
                </div>
              </div>

              {/* Official Seal of Trust */}
              <div className="exec-seal-col">
                <div className="exec-round-seal">
                  <div className="seal-inner-circle">
                    <div className="seal-txt-top">RIGHT CLUB FOR EDUCATION</div>
                    <div className="seal-crest">
                      <span className="seal-star">★</span>
                      <span className="seal-name">RCE</span>
                      <span className="seal-reg">ESTD 2021</span>
                    </div>
                    <div className="seal-txt-btm">CHARITABLE TRUST • SIVAKASI</div>
                  </div>
                </div>
                <div className="seal-caption-note">Official Seal of Trust</div>
              </div>

              {/* Authorized Signatory */}
              <div className="exec-signatory-col">
                <div className="for-trust-note">For RIGHT CLUB FOR EDUCATION TRUST</div>
                <div className="auth-sub">(Authorized Signatory)</div>
                <div className="exec-fluid-signature">V. Sundaresan</div>
                <div className="signatory-rule">Dr. V. Sundaresan, Ph.D.</div>
                <div className="signatory-role">Managing Trustee & Founder Patron</div>
              </div>
            </div>

            {/* Footer */}
            <div className="exec-cert-footer">
              "Education is the most powerful weapon to change the world" • Right Club for Education Trust • Sivakasi & Chennai, Tamil Nadu • www.rceindia.org
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
