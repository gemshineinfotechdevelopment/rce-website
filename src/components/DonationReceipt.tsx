import React, { useState } from 'react';
import { Printer, CheckCircle, Heart, X, UserCheck } from 'lucide-react';

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
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = receiptDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const amountInWords = numberToWordsINR(receipt.amount);

  // Clean standalone single-page A4 iframe print
  const handlePrint = () => {
    setIsPrinting(true);
    const receiptElem = document.getElementById('printable-receipt');

    if (!receiptElem) {
      window.print();
      setIsPrinting(false);
      return;
    }

    try {
      const oldIframe = document.getElementById('rce-print-frame');
      if (oldIframe) {
        oldIframe.remove();
      }

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
      iframe.title = 'RCE Donation Receipt Print';
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
          <title>RCE_Donation_Receipt_${receipt.receiptNo}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html, body {
              background: #ffffff;
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
              color: #1e293b;
              line-height: 1.45;
              padding: 0;
              margin: 0;
              width: 100%;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: A4 portrait;
              margin: 7mm 8mm;
            }

            .receipt-certificate-printable {
              padding: 0;
              background: #ffffff;
              width: 100%;
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Simple Full-Page A4 Fitted Card */
            .simple-receipt-card {
              background: #ffffff;
              border: 1.5px solid #cbd5e1;
              border-radius: 8px;
              overflow: hidden;
              position: relative;
              display: flex;
              flex-direction: column;
              min-height: 272mm;
              max-height: 277mm;
              page-break-inside: avoid;
              break-inside: avoid;
            }

            .simple-top-accent-bar {
              height: 7px;
              flex-shrink: 0;
              background: linear-gradient(90deg, #9a3412 0%, #d97706 50%, #f59e0b 100%);
            }

            .simple-receipt-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              padding: 22px 28px 20px;
            }

            /* Compact Single-Line Header Row */
            .simple-header-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
              padding-bottom: 10px;
              border-bottom: 1.5px solid #e2e8f0;
            }
            .simple-brand-col {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .simple-logo-img {
              width: 48px;
              height: 48px;
              object-fit: contain;
              border-radius: 50%;
              border: 1.5px solid #b45309;
              padding: 2px;
              background: #ffffff;
              flex-shrink: 0;
            }
            .simple-org-meta {
              display: flex;
              flex-direction: column;
            }
            .simple-trust-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: 1.06rem;
              font-weight: 900;
              color: #0f172a;
              line-height: 1.15;
              letter-spacing: 0.02em;
              white-space: nowrap;
            }
            .simple-address-text {
              font-size: 0.69rem;
              color: #64748b;
              font-weight: 600;
              margin-top: 2px;
            }

            .simple-title-col {
              text-align: right;
              flex-shrink: 0;
            }
            .simple-receipt-pill {
              display: inline-block;
              background: #fef3c7;
              border: 1px solid #f59e0b;
              color: #92400e;
              font-weight: 800;
              font-size: 0.6rem;
              padding: 2px 7px;
              border-radius: 3px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
            .simple-receipt-heading {
              font-family: 'Outfit', sans-serif;
              font-size: 1.04rem;
              font-weight: 800;
              color: #0f172a;
              margin-top: 2px;
            }

            /* Compact Single-Line Org Contact & Reg Bar */
            .simple-org-grid {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 5px;
              padding: 6px 12px;
              margin: 10px 0 22px;
              font-size: 0.7rem;
            }
            .org-grid-item { color: #334155; white-space: nowrap; }
            .org-grid-item strong { color: #0f172a; }

            /* Voucher Metadata 4-Box Grid */
            .simple-meta-grid {
              display: grid;
              grid-template-columns: 1.1fr 1.35fr 0.78fr 0.77fr;
              gap: 12px;
              margin-bottom: 26px;
            }
            .meta-stat-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 12px 14px;
            }
            .meta-stat-label {
              font-size: 0.66rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #64748b;
              font-weight: 700;
              margin-bottom: 3px;
            }
            .meta-stat-value {
              font-size: 0.88rem;
              font-weight: 800;
              color: #0f172a;
              white-space: nowrap;
            }
            .meta-serial-no {
              color: #b45309 !important;
              font-family: 'Outfit', monospace !important;
              font-size: 0.94rem !important;
            }

            /* Section Sub-headings */
            .simple-section-heading {
              font-size: 0.8rem;
              font-weight: 800;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: #475569;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .simple-heading-icon {
              color: #b45309;
              flex-shrink: 0;
            }

            /* Donor Details Table */
            .simple-donor-card {
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              overflow: hidden;
              margin-bottom: 28px;
              background: #ffffff;
            }
            .simple-spec-row {
              display: grid;
              grid-template-columns: 144px 1fr 136px 1fr;
              border-bottom: 1px solid #f1f5f9;
            }
            .simple-spec-row:last-child { border-bottom: none; }
            .simple-spec-label {
              background: #f8fafc;
              padding: 15px 14px;
              font-size: 0.83rem;
              font-weight: 700;
              color: #475569;
              border-right: 1px solid #f1f5f9;
              display: flex;
              align-items: center;
            }
            .simple-spec-value {
              padding: 15px 14px;
              font-size: 0.87rem;
              font-weight: 600;
              color: #0f172a;
              border-right: 1px solid #f1f5f9;
              display: flex;
              align-items: center;
              word-break: break-word;
            }
            .simple-spec-value:last-child { border-right: none; }
            .donor-name-highlight {
              font-size: 0.94rem;
              font-weight: 800;
              color: #0f172a;
            }
            .simple-project-val {
              font-weight: 700;
              color: #1e293b;
            }
            .simple-pan-val {
              font-family: monospace;
              font-weight: 700;
              color: #334155;
            }

            /* Simple Contribution Summary Table */
            .simple-table-card {
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              overflow: hidden;
              margin-bottom: 24px;
            }
            .simple-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.88rem;
            }
            .simple-table th {
              background: #1e293b;
              color: #ffffff;
              padding: 12px 14px;
              font-weight: 700;
              font-size: 0.74rem;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              text-align: left;
            }
            .simple-table th:last-child { text-align: right; }
            .simple-table td {
              padding: 22px 14px;
              border-bottom: 1px solid #f1f5f9;
              color: #334155;
              vertical-align: middle;
            }
            .simple-table td:last-child { text-align: right; }
            .simple-desc-sub {
              font-size: 0.78rem;
              color: #64748b;
              margin-top: 4px;
              line-height: 1.45;
            }
            .simple-row-amount {
              font-weight: 800;
              font-family: 'Outfit', monospace;
              color: #0f172a;
              white-space: nowrap;
            }
            .total-calc-row td {
              background: #f8fafc;
              font-weight: 800;
              color: #0f172a;
              border-top: 1.5px solid #cbd5e1;
              font-size: 0.92rem;
              padding: 15px 14px;
            }
            .total-amount-highlight {
              font-size: 1.2rem !important;
              color: #9a3412 !important;
              font-family: 'Outfit', sans-serif;
              font-weight: 900 !important;
              white-space: nowrap;
            }

            /* Amount Words Strip */
            .simple-words-strip {
              background: #fefce8;
              border: 1px solid #fef08a;
              border-radius: 6px;
              padding: 14px 16px;
              margin-bottom: 26px;
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 0.92rem;
            }
            .words-label {
              font-weight: 800;
              color: #854d0e;
              text-transform: uppercase;
              font-size: 0.74rem;
              letter-spacing: 0.04em;
            }
            .words-text {
              font-weight: 800;
              color: #1e293b;
              font-style: italic;
            }

            /* Bottom Anchored Signatory & Verification Row */
            .simple-bottom-anchor {
              margin-top: auto;
              padding-top: 16px;
            }

            .simple-sign-row {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              gap: 20px;
              padding-top: 16px;
              border-top: 1.5px solid #e2e8f0;
            }

            .simple-verify-col {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 5px;
            }
            .verify-pill {
              display: inline-flex;
              align-items: center;
              gap: 5px;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 3px 10px;
              border-radius: 9999px;
              font-size: 0.7rem;
              font-weight: 800;
              color: #334155;
            }
            .simple-verify-icon { color: #059669; flex-shrink: 0; }
            .verify-caption {
              font-size: 0.68rem;
              color: #64748b;
              line-height: 1.45;
            }

            .simple-signatory-col { text-align: right; min-width: 220px; }
            .for-trust-note {
              font-size: 0.78rem;
              font-weight: 800;
              color: #1e293b;
            }
            .auth-sub {
              font-size: 0.68rem;
              color: #64748b;
              font-style: italic;
            }
            .simple-fluid-signature {
              font-family: 'Brush Script MT', 'Segoe Script', cursive, sans-serif;
              font-size: 1.6rem;
              color: #1e3a8a;
              margin: 6px 0 -4px 0;
            }
            .signatory-rule {
              border-top: 1.5px solid #0f172a;
              margin-top: 4px;
              padding-top: 4px;
              font-weight: 800;
              font-size: 0.84rem;
              color: #0f172a;
            }
            .signatory-role {
              font-size: 0.72rem;
              color: #b45309;
              font-weight: 700;
            }

            /* Footer */
            .simple-cert-footer {
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
            <span>Official Donation Receipt</span>
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
            <span>{isPrinting ? 'Preparing Receipt...' : 'Print / Save PDF'}</span>
          </button>
          {showCloseBtn && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-receipt-action btn-receipt-close"
              title="Close receipt preview"
              aria-label="Close receipt preview"
            >
              <X size={15} />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* The Clean, Simple, Full-Page A4 Fitted Donation Receipt */}
      <div className="receipt-certificate-printable" id="printable-receipt">
        <div className="simple-receipt-card">
          {/* Top Gold Gradient Bar */}
          <div className="simple-top-accent-bar"></div>

          <div className="simple-receipt-content">
            {/* Compact Header Section */}
            <div className="simple-header-row">
              <div className="simple-brand-col">
                <img
                  src="/Rce.logo.png"
                  alt="RCE Official Logo"
                  className="simple-logo-img"
                />
                <div className="simple-org-meta">
                  <h1 className="simple-trust-title">RIGHT CLUB FOR EDUCATION TRUST</h1>
                  <span className="simple-address-text">
                    Reg. Public Charitable Trust • Sivakasi & Chennai, Tamil Nadu • www.rceindia.org
                  </span>
                </div>
              </div>

              <div className="simple-title-col">
                <span className="simple-receipt-pill">Official Copy</span>
                <h2 className="simple-receipt-heading">DONATION RECEIPT</h2>
              </div>
            </div>

            {/* Compact Single-Line Reg & Contact Bar */}
            <div className="simple-org-grid">
              <div className="org-grid-item"><strong>Reg No:</strong> TN/CH/2021/84920</div>
              <div className="org-grid-item"><strong>PAN:</strong> AAATR8492G</div>
              <div className="org-grid-item"><strong>Email:</strong> contact@rceindia.org</div>
              <div className="org-grid-item"><strong>Web:</strong> www.rceindia.org</div>
            </div>

            {/* Voucher 4-Box Grid */}
            <div className="simple-meta-grid">
              <div className="meta-stat-box">
                <div className="meta-stat-label">Receipt No</div>
                <div className="meta-stat-value meta-serial-no">{receipt.receiptNo}</div>
              </div>
              <div className="meta-stat-box">
                <div className="meta-stat-label">Date & Time</div>
                <div className="meta-stat-value">{formattedDate}, {formattedTime}</div>
              </div>
              <div className="meta-stat-box">
                <div className="meta-stat-label">Payment Mode</div>
                <div className="meta-stat-value">{receipt.paymentMethod || 'UPI / Online'}</div>
              </div>
              <div className="meta-stat-box">
                <div className="meta-stat-label">Transaction Ref</div>
                <div className="meta-stat-value">{receipt.transactionId || 'VERIFIED'}</div>
              </div>
            </div>

            {/* Donor Details Section */}
            <div className="simple-section-heading">
              <UserCheck size={14} className="simple-heading-icon" />
              <span>Donor Details</span>
            </div>

            <div className="simple-donor-card">
              <div className="simple-spec-row">
                <div className="simple-spec-label">Donor Name</div>
                <div className="simple-spec-value donor-name-highlight">
                  Mr./Ms. {receipt.donorName}
                </div>
                <div className="simple-spec-label">Contact Phone</div>
                <div className="simple-spec-value">{receipt.phone || 'N/A'}</div>
              </div>

              <div className="simple-spec-row">
                <div className="simple-spec-label">Email Address</div>
                <div className="simple-spec-value">{receipt.email || 'N/A'}</div>
                <div className="simple-spec-label">Donor PAN</div>
                <div className="simple-spec-value simple-pan-val">
                  {receipt.pan && receipt.pan !== 'N/A' ? receipt.pan.toUpperCase() : 'Not Provided'}
                </div>
              </div>

              <div className="simple-spec-row">
                <div className="simple-spec-label">Supported Cause</div>
                <div className="simple-spec-value simple-project-val" style={{ gridColumn: 'span 3' }}>
                  {receipt.cause}
                </div>
              </div>
            </div>

            {/* Simple Contribution Summary Table (No 80G Column) */}
            <div className="simple-section-heading">
              <Heart size={14} className="simple-heading-icon" />
              <span>Contribution Summary</span>
            </div>

            <div className="simple-table-card">
              <table className="simple-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Description</th>
                    <th style={{ width: '150px' }}>Category</th>
                    <th style={{ width: '135px' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>
                      <strong>Voluntary Contribution for Community Welfare</strong>
                      <div className="simple-desc-sub">
                        Towards {receipt.cause} — supporting child education, healthcare camps & grassroots relief
                      </div>
                    </td>
                    <td>Charitable Support</td>
                    <td className="simple-row-amount">
                      ₹{receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="total-calc-row">
                    <td colSpan={3} style={{ textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Total Amount Received:
                    </td>
                    <td className="total-amount-highlight">
                      ₹{receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amount in Words */}
            <div className="simple-words-strip">
              <span className="words-label">Amount in Words:</span>
              <span className="words-text">{amountInWords}</span>
            </div>

            {/* Bottom-Anchored Signatory Row & Footer */}
            <div className="simple-bottom-anchor">
              <div className="simple-sign-row">
                {/* Digital Verification */}
                <div className="simple-verify-col">
                  <div className="verify-pill">
                    <CheckCircle size={13} className="simple-verify-icon" />
                    <span>Digitally Verified Receipt</span>
                  </div>
                  <div className="verify-caption">
                    Computer-generated official contribution receipt.<br />
                    Reference ID: <strong>{receipt.receiptNo}</strong>
                  </div>
                </div>

                {/* Authorized Signatory */}
                <div className="simple-signatory-col">
                  <div className="for-trust-note">For RIGHT CLUB FOR EDUCATION TRUST</div>
                  <div className="auth-sub">(Authorized Signatory)</div>
                  <div className="simple-fluid-signature">V. Sundaresan</div>
                  <div className="signatory-rule">Dr. V. Sundaresan, Ph.D.</div>
                  <div className="signatory-role">Managing Trustee & Founder Patron</div>
                </div>
              </div>

              {/* Footer */}
              <div className="simple-cert-footer">
                "Education is the most powerful weapon to change the world" • Right Club for Education Trust • Sivakasi & Chennai • www.rceindia.org
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
