import React, { useState } from 'react';
import { Printer, CheckCircle, ShieldCheck, Award, X } from 'lucide-react';

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

  // Calculate Financial Year (April - March)
  const month = receiptDate.getMonth();
  const fullYear = receiptDate.getFullYear();
  const fyStart = month >= 3 ? fullYear : fullYear - 1;
  const financialYear = `FY ${fyStart}-${(fyStart + 1).toString().slice(-2)}`;

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
          <title>RCE_Donation_Bill_${receipt.receiptNo}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              background: #ffffff;
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
              color: #1c1917;
              line-height: 1.45;
              padding: 6mm 8mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            .receipt-certificate-printable {
              background: #ffffff;
              border: 2px solid #b45309;
              border-radius: 6px;
              padding: 14px;
              color: #1c1917;
            }
            .receipt-inner-frame {
              border: 1.5px solid #b45309;
              outline: 1px solid #dfcebc;
              outline-offset: -4px;
              border-radius: 4px;
              padding: 18px 22px;
              background: #ffffff;
              position: relative;
            }
            .receipt-cert-header {
              display: flex;
              align-items: center;
              gap: 16px;
              padding-bottom: 14px;
              border-bottom: 2px solid #d97706;
            }
            .receipt-trust-logo { flex-shrink: 0; }
            .receipt-logo-img {
              width: 72px;
              height: 72px;
              object-fit: contain;
              border-radius: 50%;
              border: 2px solid #b45309;
              padding: 2px;
              background: #ffffff;
            }
            .receipt-trust-info { flex: 1; }
            .receipt-org-badge {
              font-size: 0.64rem;
              font-weight: 800;
              letter-spacing: 0.1em;
              color: #b45309;
              text-transform: uppercase;
            }
            .receipt-trust-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: 1.35rem;
              font-weight: 900;
              color: #451a03;
              margin: 0;
              line-height: 1.15;
            }
            .receipt-trust-subtitle {
              font-size: 0.78rem;
              font-weight: 800;
              color: #78350f;
              letter-spacing: 0.05em;
              margin-top: 1px;
            }
            .receipt-trust-address {
              font-size: 0.72rem;
              color: #57534e;
              margin: 2px 0 5px;
            }
            .receipt-trust-reg-chips {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
            }
            .reg-chip {
              background: #f7f2ea;
              border: 1px solid #dfcebc;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 0.65rem;
              color: #44403c;
            }
            .reg-chip.gold-chip {
              background: #fef3c7;
              border-color: #f59e0b;
              color: #92400e;
              font-weight: 800;
            }
            .receipt-title-banner {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              margin: 12px 0 10px;
            }
            .title-banner-line {
              flex: 1;
              height: 1.5px;
              background: #b45309;
            }
            .title-banner-text {
              font-family: 'Cinzel', Georgia, serif;
              font-size: 0.8rem;
              font-weight: 900;
              letter-spacing: 0.06em;
              color: #78350f;
              background: #fef3c7;
              border: 1px solid #fde68a;
              padding: 3px 12px;
              border-radius: 9999px;
              text-align: center;
              white-space: nowrap;
            }
            .receipt-serial-strip {
              display: flex;
              justify-content: space-between;
              background: #faf5ee;
              border: 1px solid #ebdccb;
              border-radius: 5px;
              padding: 6px 12px;
              margin-bottom: 12px;
              font-size: 0.78rem;
            }
            .serial-col { display: flex; flex-direction: column; }
            .serial-label {
              font-size: 0.64rem;
              text-transform: uppercase;
              color: #78716c;
              font-weight: 700;
            }
            .serial-value { font-weight: 800; color: #1c1917; }
            .serial-col:first-child .serial-value {
              font-family: monospace;
              color: #9a3412;
              font-size: 0.9rem;
            }
            .receipt-acknowledgement {
              font-size: 0.78rem;
              color: #44403c;
              font-style: italic;
              margin-bottom: 6px;
            }
            .receipt-details-table {
              border: 1px solid #e7d8c9;
              border-radius: 5px;
              overflow: hidden;
              margin-bottom: 12px;
              background: #ffffff;
            }
            .receipt-table-row {
              display: flex;
              border-bottom: 1px solid #f2e8dc;
            }
            .receipt-table-row:last-child { border-bottom: none; }
            .receipt-col {
              padding: 6px 10px;
              font-size: 0.78rem;
              display: flex;
              align-items: center;
            }
            .receipt-col.label-col {
              width: 130px;
              flex-shrink: 0;
              background: #faf6f0;
              color: #78350f;
              font-weight: 700;
              border-right: 1px solid #f2e8dc;
            }
            .receipt-col.value-col {
              flex: 1;
              color: #1c1917;
              border-right: 1px solid #f2e8dc;
            }
            .receipt-col.value-col:last-child { border-right: none; }
            .receipt-amount-box {
              background: #fdf8ef;
              border: 2px dashed #b45309;
              border-radius: 6px;
              padding: 10px 14px;
              margin-bottom: 12px;
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            .amount-digit-section {
              display: flex;
              align-items: baseline;
              justify-content: space-between;
              border-bottom: 1px solid rgba(180, 83, 9, 0.2);
              padding-bottom: 4px;
            }
            .amount-currency-label {
              font-size: 0.76rem;
              font-weight: 800;
              color: #78350f;
              text-transform: uppercase;
            }
            .amount-number {
              font-size: 1.5rem;
              font-weight: 900;
              color: #9a3412;
              font-family: 'Outfit', sans-serif;
            }
            .amount-words-section {
              display: flex;
              align-items: baseline;
              gap: 6px;
              font-size: 0.78rem;
            }
            .words-label { font-weight: 700; color: #78350f; flex-shrink: 0; }
            .words-value { font-weight: 800; color: #1c1917; font-style: italic; }
            .receipt-tax-clause {
              display: flex;
              gap: 8px;
              align-items: flex-start;
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 5px;
              padding: 8px 10px;
              margin-bottom: 14px;
              font-size: 0.7rem;
              line-height: 1.4;
              color: #166534;
            }
            .tax-clause-text strong {
              color: #14532d;
              display: block;
              margin-bottom: 2px;
              font-size: 0.72rem;
            }
            .receipt-sign-row {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              margin-top: 14px;
              padding-top: 10px;
              border-top: 1.5px solid #ebdccb;
            }
            .seal-round-stamp {
              width: 86px;
              height: 86px;
              border: 2px dashed #b45309;
              border-radius: 50%;
              color: #b45309;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 3px;
              background: rgba(254, 243, 199, 0.25);
            }
            .seal-outer-ring {
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
            }
            .seal-top-text { font-size: 0.42rem; font-weight: 900; color: #b45309; }
            .seal-center-crest { display: flex; flex-direction: column; align-items: center; }
            .seal-star { font-size: 0.55rem; color: #d97706; }
            .seal-name { font-family: 'Cinzel', serif; font-weight: 900; font-size: 0.8rem; color: #78350f; }
            .seal-year { font-size: 0.48rem; font-weight: 800; color: #92400e; }
            .seal-bottom-text { font-size: 0.4rem; font-weight: 800; color: #b45309; }
            .seal-caption { font-size: 0.58rem; color: #78716c; font-style: italic; text-align: center; }
            .receipt-verification-box { text-align: center; }
            .verification-badge {
              display: inline-block;
              background: #fdf6ec;
              border: 1px solid #ebdccb;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 0.65rem;
              font-weight: 800;
              color: #78350f;
              margin-bottom: 2px;
            }
            .verification-text { font-size: 0.6rem; color: #78716c; line-height: 1.3; }
            .receipt-signature-box { text-align: center; min-width: 160px; }
            .signature-stylized {
              font-family: 'Brush Script MT', 'Segoe Script', cursive;
              font-size: 1.25rem;
              color: #1e3a8a;
              margin-bottom: -4px;
            }
            .sig-line {
              font-weight: 800;
              font-size: 0.78rem;
              border-top: 1.5px solid #292524;
              padding-top: 3px;
              color: #1c1917;
            }
            .sig-role { font-size: 0.68rem; font-weight: 700; color: #78350f; }
            .sig-org { font-size: 0.6rem; color: #78716c; }
            .receipt-cert-footer {
              margin-top: 12px;
              text-align: center;
              font-size: 0.62rem;
              color: #a8a29e;
              border-top: 1px solid #f2e8dc;
              padding-top: 6px;
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
            <span>Official 80G Tax Exemption Bill</span>
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
            <span>{isPrinting ? 'Preparing Bill...' : 'Print / Save PDF'}</span>
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

      {/* The Printable Official Tax Certificate Document */}
      <div className="receipt-certificate-printable" id="printable-receipt">
        {/* Subtle Ornamental Inner Border */}
        <div className="receipt-inner-frame">
          {/* Header Bar */}
          <div className="receipt-cert-header">
            <div className="receipt-trust-logo">
              <img
                src="/Rce.logo.png"
                alt="RCE Official Crest"
                className="receipt-logo-img"
              />
            </div>

            <div className="receipt-trust-info">
              <div className="receipt-org-badge">ESTD. 2021 • GOVERNMENT RECOGNIZED NGO</div>
              <h1 className="receipt-trust-title">RIGHT CLUB FOR EDUCATION</h1>
              <div className="receipt-trust-subtitle">RCE SOCIAL SERVICE & CHARITABLE TRUST</div>
              <p className="receipt-trust-address">
                Registered Public Charitable Trust • Head Office: Sivakasi & Chennai, Tamil Nadu, India
              </p>
              <div className="receipt-trust-reg-chips">
                <span className="reg-chip">
                  <strong>Trust Reg:</strong> TN/CH/2021/84920
                </span>
                <span className="reg-chip">
                  <strong>Trust PAN:</strong> AAATR8492G
                </span>
                <span className="reg-chip">
                  <strong>12A Reg:</strong> AAATR8492GE20210
                </span>
                <span className="reg-chip gold-chip">
                  <strong>80G URN:</strong> CIT(E)/CHN/80G/2021-22/A-412
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Title Strip */}
          <div className="receipt-title-banner">
            <div className="title-banner-line"></div>
            <div className="title-banner-text">
              DONATION RECEIPT & SECTION 80G TAX CERTIFICATE
            </div>
            <div className="title-banner-line"></div>
          </div>

          {/* Serial & Date Bar */}
          <div className="receipt-serial-strip">
            <div className="serial-col">
              <span className="serial-label">Receipt Voucher No:</span>
              <span className="serial-value">{receipt.receiptNo}</span>
            </div>
            <div className="serial-col text-center">
              <span className="serial-label">Assessment Period:</span>
              <span className="serial-value font-semibold">{financialYear}</span>
            </div>
            <div className="serial-col text-right">
              <span className="serial-label">Issue Date & Time:</span>
              <span className="serial-value">{formattedDate}, {formattedTime}</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="receipt-body-content">
            <div className="receipt-acknowledgement">
              Received with deep gratitude and thanks from:
            </div>

            {/* Donor & Contribution Particulars Table */}
            <div className="receipt-details-table">
              <div className="receipt-table-row">
                <div className="receipt-col label-col">Donor Full Name:</div>
                <div className="receipt-col value-col font-bold text-amber-950">
                  {receipt.donorName}
                </div>
                <div className="receipt-col label-col">Donor PAN:</div>
                <div className="receipt-col value-col font-mono font-bold text-amber-900">
                  {receipt.pan && receipt.pan !== 'N/A' ? receipt.pan.toUpperCase() : 'Not Provided'}
                </div>
              </div>

              <div className="receipt-table-row">
                <div className="receipt-col label-col">Donor Email:</div>
                <div className="receipt-col value-col">{receipt.email || 'N/A'}</div>
                <div className="receipt-col label-col">Contact Phone:</div>
                <div className="receipt-col value-col">{receipt.phone || 'N/A'}</div>
              </div>

              <div className="receipt-table-row">
                <div className="receipt-col label-col">Supported Cause:</div>
                <div className="receipt-col value-col font-semibold" style={{ gridColumn: 'span 3' }}>
                  {receipt.cause}
                </div>
              </div>

              <div className="receipt-table-row">
                <div className="receipt-col label-col">Payment Mode:</div>
                <div className="receipt-col value-col">{receipt.paymentMethod || 'UPI / Digital Payment'}</div>
                <div className="receipt-col label-col">Txn Reference:</div>
                <div className="receipt-col value-col font-mono text-xs">
                  {receipt.transactionId || 'UPI Verified / RCE Pay'}
                </div>
              </div>
            </div>

            {/* Amount Showcase Box */}
            <div className="receipt-amount-box">
              <div className="amount-digit-section">
                <span className="amount-currency-label">Total Amount Donated:</span>
                <span className="amount-number">₹{receipt.amount.toLocaleString('en-IN')}/-</span>
              </div>
              <div className="amount-words-section">
                <span className="words-label">Amount in Words:</span>
                <span className="words-value">{amountInWords}</span>
              </div>
            </div>

            {/* Statutory Tax Exemption Clause */}
            <div className="receipt-tax-clause">
              <div className="tax-clause-icon">
                <ShieldCheck size={24} className="text-amber-700" />
              </div>
              <div className="tax-clause-text">
                <strong>INCOME TAX BENEFIT UNDER SECTION 80G:</strong>
                <p>
                  Donations to <strong>Right Club for Education (RCE Charitable Trust)</strong> qualify for 
                  <strong> 50% tax deduction</strong> under Section 80G(5)(vi) of the Income Tax Act, 1961, 
                  vide Order No. <code>CIT(E)/CHN/80G/2021-22/A-412</code>. 
                  All contributions are strictly deployed towards educational support for underprivileged children, 
                  afforestation drives, public health camps, and rural relief missions.
                </p>
              </div>
            </div>

            {/* Signatures & Seal Row */}
            <div className="receipt-sign-row">
              {/* Official Round Stamped Seal */}
              <div className="receipt-seal-box">
                <div className="seal-round-stamp">
                  <div className="seal-outer-ring">
                    <div className="seal-top-text">RIGHT CLUB FOR EDUCATION</div>
                    <div className="seal-center-crest">
                      <span className="seal-star">★</span>
                      <span className="seal-name">RCE</span>
                      <span className="seal-year">2021</span>
                    </div>
                    <div className="seal-bottom-text">CHARITABLE TRUST • SIVAKASI</div>
                  </div>
                </div>
                <span className="seal-caption">Official Seal of Trust</span>
              </div>

              {/* Digital Verification & Audit Stamp */}
              <div className="receipt-verification-box">
                <div className="verification-badge">
                  <Award size={18} className="text-amber-700" />
                  <span>Digitally Generated & Verified</span>
                </div>
                <p className="verification-text">
                  Computer-generated statutory receipt.<br />
                  Valid for Indian Income Tax filing purposes.
                </p>
              </div>

              {/* Authorized Signatory */}
              <div className="receipt-signature-box">
                <div className="signature-stylized">
                  <span>V. Sundaresan</span>
                </div>
                <div className="sig-line">Dr. V. Sundaresan, Ph.D.</div>
                <div className="sig-role">Managing Trustee & Founder Patron</div>
                <div className="sig-org">Right Club for Education Trust</div>
              </div>
            </div>
          </div>

          {/* Certificate Footer Note */}
          <div className="receipt-cert-footer">
            <span>
              Right Club for Education (RCE) • "கல்வி மட்டுமே சமூக மாற்றத்திற்கான ஆயுதம்" • www.rceindia.org
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
