import React, { useState } from 'react';
import { Printer, CheckCircle, ShieldCheck, X } from 'lucide-react';

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
          <title>RCE_Donation_Receipt_${receipt.receiptNo}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              background: #ffffff;
              font-family: 'Georgia', 'Times New Roman', serif;
              color: #241208;
              line-height: 1.45;
              padding: 4mm 6mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: A4 portrait;
              margin: 6mm;
            }

            /* Traditional Outer Ornamental Border */
            .traditional-bill-container {
              background: #fffdf9;
              border: 3.5px solid #6b2d07;
              outline: 1.5px solid #9a3412;
              outline-offset: -5px;
              padding: 18px 22px;
              position: relative;
              box-sizing: border-box;
            }

            /* Corner Ornaments */
            .corner-ornament {
              position: absolute;
              color: #9a3412;
              font-size: 16px;
              line-height: 1;
              z-index: 2;
            }
            .corner-tl { top: 6px; left: 8px; }
            .corner-tr { top: 6px; right: 8px; }
            .corner-bl { bottom: 6px; left: 8px; }
            .corner-br { bottom: 6px; right: 8px; }

            /* Top Motto Strip */
            .traditional-motto-strip {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1.5px solid #b45309;
              padding-bottom: 5px;
              margin-bottom: 12px;
              font-size: 0.72rem;
              font-weight: 700;
              color: #78350f;
              font-family: 'Plus Jakarta Sans', sans-serif;
              letter-spacing: 0.04em;
              text-transform: uppercase;
            }

            /* Header Section */
            .traditional-header-row {
              display: flex;
              align-items: center;
              gap: 16px;
              padding-bottom: 12px;
              border-bottom: 2px solid #78350f;
            }
            .traditional-logo-box {
              flex-shrink: 0;
            }
            .traditional-logo-img {
              width: 78px;
              height: 78px;
              object-fit: contain;
              border: 2px solid #78350f;
              border-radius: 50%;
              padding: 2px;
              background: #ffffff;
            }
            .traditional-trust-meta {
              flex: 1;
              text-align: center;
            }
            .trust-name-english {
              font-family: 'Cinzel', 'Playfair Display', Georgia, serif;
              font-size: 1.4rem;
              font-weight: 900;
              color: #78350f;
              letter-spacing: 0.03em;
              line-height: 1.15;
            }
            .trust-statutory-sub {
              font-size: 0.74rem;
              font-weight: 600;
              color: #57534e;
              margin-top: 3px;
            }
            .trust-address-line {
              font-size: 0.72rem;
              color: #44403c;
              margin: 3px 0 5px;
            }
            .traditional-tax-chips {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 6px;
              margin-top: 4px;
            }
            .tax-chip {
              background: #faf3e8;
              border: 1px solid #d4bda8;
              padding: 2px 7px;
              border-radius: 3px;
              font-size: 0.68rem;
              color: #382513;
              font-family: 'Plus Jakarta Sans', monospace;
            }
            .tax-chip.highlight-80g {
              background: #fef3c7;
              border-color: #d97706;
              color: #92400e;
              font-weight: 800;
            }

            /* Traditional Ribbon Banner */
            .traditional-banner-wrap {
              text-align: center;
              margin: 12px 0 10px;
              position: relative;
            }
            .traditional-banner-double-rule {
              border-top: 1.5px solid #78350f;
              border-bottom: 1.5px solid #78350f;
              padding: 6px 0;
              background: #faeedb;
            }
            .banner-main-title {
              font-family: 'Cinzel', Georgia, serif;
              font-size: 0.96rem;
              font-weight: 900;
              letter-spacing: 0.08em;
              color: #451a03;
            }
            .banner-sub-legal {
              font-size: 0.68rem;
              color: #78350f;
              font-weight: 700;
              margin-top: 1px;
              font-family: 'Plus Jakarta Sans', sans-serif;
            }

            /* Voucher Metadata Strip */
            .traditional-meta-strip {
              display: grid;
              grid-template-columns: 1.2fr 1fr 1.2fr;
              gap: 12px;
              background: #f9f4ec;
              border: 1px solid #dfcebc;
              padding: 8px 14px;
              margin-bottom: 14px;
              font-size: 0.78rem;
              border-radius: 3px;
            }
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            .meta-label {
              font-size: 0.65rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #78350f;
              font-weight: 700;
              font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .meta-val {
              font-size: 0.82rem;
              font-weight: 800;
              color: #1c1917;
            }
            .traditional-red-serial {
              color: #b91c1c !important;
              font-family: 'Georgia', monospace !important;
              font-size: 0.96rem !important;
              font-weight: 900 !important;
              letter-spacing: 0.04em;
            }

            /* Traditional Receipt Fill-in Ledger Lines */
            .traditional-fill-section {
              margin-bottom: 14px;
              font-size: 0.88rem;
              line-height: 1.9;
            }
            .fill-row {
              display: flex;
              align-items: baseline;
              margin-bottom: 6px;
            }
            .fill-label {
              color: #451a03;
              font-weight: 700;
              white-space: nowrap;
              margin-right: 8px;
            }
            .fill-line {
              flex: 1;
              border-bottom: 1.5px dotted #92400e;
              padding: 0 8px;
              color: #1c1917;
              font-weight: 700;
            }
            .fill-line.font-italic {
              font-style: italic;
              font-weight: 800;
              color: #431407;
            }
            .fill-grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-bottom: 6px;
            }
            .fill-grid-3 {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 14px;
              margin-bottom: 6px;
            }

            /* Rupee Box & 80G Tax Exemption Row */
            .traditional-amount-clause-row {
              display: grid;
              grid-template-columns: 240px 1fr;
              gap: 16px;
              margin: 14px 0 16px;
              align-items: stretch;
            }

            /* Classic Rupee Box */
            .traditional-rupee-box {
              border: 2.5px solid #78350f;
              outline: 1px solid #b45309;
              outline-offset: -3px;
              background: #faf2e3;
              padding: 10px 12px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: center;
            }
            .rupee-symbol-row {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              border-bottom: 1.5px solid #78350f;
              padding-bottom: 4px;
              margin-bottom: 4px;
            }
            .rupee-sign {
              font-size: 1.35rem;
              font-weight: 900;
              color: #78350f;
            }
            .rupee-figures {
              font-size: 1.45rem;
              font-weight: 900;
              color: #9a3412;
              font-family: 'Plus Jakarta Sans', monospace;
              letter-spacing: -0.02em;
            }
            .rupee-subject-note {
              font-size: 0.6rem;
              font-style: italic;
              color: #78716c;
              margin-top: 2px;
            }

            /* Statutory 80G Declaration */
            .traditional-80g-declaration {
              border: 1.5px solid #15803d;
              background: #f0fdf4;
              padding: 8px 12px;
              border-radius: 4px;
              font-size: 0.72rem;
              line-height: 1.45;
              color: #166534;
            }
            .declaration-heading {
              font-weight: 800;
              font-size: 0.74rem;
              color: #14532d;
              margin-bottom: 3px;
              display: flex;
              align-items: center;
              gap: 4px;
            }

            /* Traditional Signatures & Official Stamp Row */
            .traditional-signatures-row {
              display: grid;
              grid-template-columns: 1fr 140px 1.4fr;
              gap: 16px;
              margin-top: 16px;
              padding-top: 12px;
              border-top: 1.5px solid #78350f;
              align-items: flex-end;
            }
            .sig-col {
              text-align: center;
            }
            .sig-dotted-line {
              border-bottom: 1.5px dotted #78716c;
              height: 40px;
              margin-bottom: 6px;
            }
            .sig-caption-en {
              font-size: 0.72rem;
              font-weight: 700;
              color: #451a03;
            }
            .sig-sub-en {
              font-size: 0.64rem;
              color: #78716c;
              font-style: italic;
            }

            /* Classical Violet Rubber Stamp */
            .traditional-rubber-stamp {
              width: 96px;
              height: 96px;
              margin: 0 auto;
              border: 2px dashed #312e81;
              border-radius: 50%;
              padding: 4px;
              transform: rotate(-6deg);
              background: rgba(238, 242, 255, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .stamp-inner-ring {
              width: 100%;
              height: 100%;
              border: 1px solid #312e81;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 4px 2px;
              text-align: center;
              color: #312e81;
            }
            .stamp-arc-top {
              font-size: 0.44rem;
              font-weight: 900;
              letter-spacing: 0.05em;
            }
            .stamp-center-crest {
              display: flex;
              flex-direction: column;
              align-items: center;
              line-height: 1.1;
            }
            .stamp-star {
              font-size: 0.6rem;
              color: #4338ca;
            }
            .stamp-brand-name {
              font-family: 'Cinzel', serif;
              font-size: 0.78rem;
              font-weight: 900;
              letter-spacing: 0.06em;
            }
            .stamp-reg-code {
              font-size: 0.44rem;
              font-weight: 800;
            }
            .stamp-arc-bottom {
              font-size: 0.42rem;
              font-weight: 900;
            }
            .stamp-seal-caption {
              font-size: 0.58rem;
              font-style: italic;
              color: #4338ca;
              margin-top: 3px;
            }

            /* Managing Trustee Signatory Box */
            .trustee-sig-box {
              text-align: right;
            }
            .for-trust-label {
              font-size: 0.76rem;
              font-weight: 800;
              color: #451a03;
            }
            .for-trust-sub {
              font-size: 0.68rem;
              color: #78350f;
              font-style: italic;
              margin-bottom: 2px;
            }
            .fountain-signature {
              font-family: 'Brush Script MT', 'Segoe Script', cursive;
              font-size: 1.45rem;
              color: #1e3a8a;
              margin: 4px 0 -6px 0;
            }
            .trustee-line {
              border-top: 1.5px solid #292524;
              margin-top: 6px;
              padding-top: 4px;
              font-weight: 800;
              font-size: 0.8rem;
              color: #1c1917;
            }
            .trustee-title-text {
              font-size: 0.72rem;
              color: #78350f;
              font-weight: 700;
            }

            /* Traditional Footnote */
            .traditional-footnote {
              margin-top: 14px;
              text-align: center;
              font-size: 0.65rem;
              color: #78716c;
              border-top: 1px solid #dfcebc;
              padding-top: 6px;
              font-family: 'Plus Jakarta Sans', sans-serif;
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
            <span>Official 80G Donation Receipt & Tax Certificate</span>
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

      {/* The Printable Official Traditional Tax Certificate Document (100% English) */}
      <div className="receipt-certificate-printable" id="printable-receipt">
        <div className="traditional-bill-container">
          {/* Classical Corner Rosettes */}
          <span className="corner-ornament corner-tl">❖</span>
          <span className="corner-ornament corner-tr">❖</span>
          <span className="corner-ornament corner-bl">❖</span>
          <span className="corner-ornament corner-br">❖</span>

          {/* Top Invocational Motto Strip */}
          <div className="traditional-motto-strip">
            <span>ESTD: 2021</span>
            <span className="motto-english">Dedicated to Child Education, Community Welfare & Social Upliftment</span>
            <span>REG: TN/CH/2021/84920</span>
          </div>

          {/* Trust Header & Crest */}
          <div className="traditional-header-row">
            <div className="traditional-logo-box">
              <img
                src="/Rce.logo.png"
                alt="RCE Official Crest"
                className="traditional-logo-img"
              />
            </div>

            <div className="traditional-trust-meta">
              <h1 className="trust-name-english">RIGHT CLUB FOR EDUCATION CHARITABLE TRUST</h1>
              <div className="trust-statutory-sub">
                (A Public Charitable Trust Registered under the Indian Trusts Act, 1882)
              </div>
              <p className="trust-address-line">
                Head Office: 14/2, Gandhi Road, Sivakasi - 626123, Virudhunagar Dist., Tamil Nadu | Branch Office: Chennai, India
              </p>
              <div className="traditional-tax-chips">
                <span className="tax-chip">
                  <strong>Trust PAN:</strong> AAATR8492G
                </span>
                <span className="tax-chip">
                  <strong>12A Reg:</strong> AAATR8492GE20210
                </span>
                <span className="tax-chip highlight-80g">
                  <strong>80G Approval URN:</strong> CIT(E)/CHN/80G/2021-22/A-412
                </span>
                <span className="tax-chip">
                  <strong>Contact:</strong> +91 94421 84920
                </span>
              </div>
            </div>
          </div>

          {/* Traditional Ribbon Banner */}
          <div className="traditional-banner-wrap">
            <div className="traditional-banner-double-rule">
              <div className="banner-main-title">
                DONATION RECEIPT & SECTION 80G TAX CERTIFICATE
              </div>
              <div className="banner-sub-legal">
                (Under Section 80G(5)(vi) of the Income Tax Act, 1961 • Government of India)
              </div>
            </div>
          </div>

          {/* Voucher Metadata Strip */}
          <div className="traditional-meta-strip">
            <div className="meta-item">
              <span className="meta-label">Receipt Voucher No:</span>
              <span className="meta-val traditional-red-serial">№ {receipt.receiptNo}</span>
            </div>
            <div className="meta-item text-center">
              <span className="meta-label">Assessment Year:</span>
              <span className="meta-val font-semibold">{financialYear}</span>
            </div>
            <div className="meta-item text-right">
              <span className="meta-label">Issue Date & Time:</span>
              <span className="meta-val">{formattedDate}, {formattedTime}</span>
            </div>
          </div>

          {/* Traditional Receipt Fill-in Ledger Lines (100% English) */}
          <div className="traditional-fill-section">
            <div className="fill-row">
              <span className="fill-label">
                Received with thanks from:
              </span>
              <span className="fill-line donor-full-title">
                <strong>Sri / Smt / Selvi</strong> {receipt.donorName}
              </span>
            </div>

            <div className="fill-grid-3">
              <div className="fill-row">
                <span className="fill-label">Donor PAN:</span>
                <span className="fill-line font-mono">
                  {receipt.pan && receipt.pan !== 'N/A' ? receipt.pan.toUpperCase() : 'Not Furnished'}
                </span>
              </div>
              <div className="fill-row">
                <span className="fill-label">Contact Phone:</span>
                <span className="fill-line">{receipt.phone || 'N/A'}</span>
              </div>
              <div className="fill-row">
                <span className="fill-label">Email Address:</span>
                <span className="fill-line">{receipt.email || 'N/A'}</span>
              </div>
            </div>

            <div className="fill-row">
              <span className="fill-label">
                The sum of Rupees (in words):
              </span>
              <span className="fill-line font-italic">
                {amountInWords}
              </span>
            </div>

            <div className="fill-grid-2">
              <div className="fill-row">
                <span className="fill-label">
                  Payment Mode:
                </span>
                <span className="fill-line">{receipt.paymentMethod || 'UPI / Digital Payment'}</span>
              </div>
              <div className="fill-row">
                <span className="fill-label">
                  Transaction / UTR Ref:
                </span>
                <span className="fill-line font-mono">{receipt.transactionId || 'UPI Verified / RCE Pay'}</span>
              </div>
            </div>

            <div className="fill-row">
              <span className="fill-label">
                Towards / On Account of:
              </span>
              <span className="fill-line font-bold">
                {receipt.cause} (General Educational & Community Welfare Fund)
              </span>
            </div>
          </div>

          {/* Rupee Box & 80G Tax Exemption Row */}
          <div className="traditional-amount-clause-row">
            {/* Classic Rupee Box */}
            <div className="traditional-rupee-box">
              <div className="rupee-symbol-row">
                <span className="rupee-sign">₹</span>
                <span className="rupee-figures">{receipt.amount.toLocaleString('en-IN')} /-</span>
              </div>
              <div className="rupee-subject-note">Subject to realisation of Cheque / Online Transfer</div>
            </div>

            {/* Statutory 80G Tax Exemption Declaration */}
            <div className="traditional-80g-declaration">
              <div className="declaration-heading">
                <ShieldCheck size={16} className="text-emerald-700" />
                <span>INCOME TAX BENEFIT UNDER SECTION 80G(5)(vi):</span>
              </div>
              <p>
                Donations to <strong>Right Club for Education (RCE Charitable Trust)</strong> qualify for 
                <strong> 50% Income Tax deduction</strong> under Section 80G(5)(vi) of the Income Tax Act, 1961, 
                vide Order No. <code>CIT(E)/CHN/80G/2021-22/A-412</code> dated 14-09-2021. 
                All contributions are deployed exclusively towards educational support for underprivileged children, afforestation drives, free public health camps, and rural welfare relief missions in accordance with Trust objectives.
              </p>
            </div>
          </div>

          {/* Traditional Signatures & Official Stamp Row */}
          <div className="traditional-signatures-row">
            {/* Left: Donor / Receiver */}
            <div className="sig-col">
              <div className="sig-dotted-line"></div>
              <div className="sig-caption-en">Donor's Signature</div>
              <div className="sig-sub-en">Prepared / Verified by</div>
            </div>

            {/* Center: Official Violet Rubber Stamp */}
            <div className="sig-col">
              <div className="traditional-rubber-stamp">
                <div className="stamp-inner-ring">
                  <div className="stamp-arc-top">RIGHT CLUB FOR EDUCATION</div>
                  <div className="stamp-center-crest">
                    <span className="stamp-star">★</span>
                    <span className="stamp-brand-name">RCE</span>
                    <span className="stamp-reg-code">REG: TN/CH/2021/84920</span>
                  </div>
                  <div className="stamp-arc-bottom">CHARITABLE TRUST • SIVAKASI</div>
                </div>
              </div>
              <div className="stamp-seal-caption">Official Seal of Trust</div>
            </div>

            {/* Right: Managing Trustee */}
            <div className="sig-col trustee-sig-box">
              <div className="for-trust-label">For RIGHT CLUB FOR EDUCATION TRUST</div>
              <div className="for-trust-sub">(Authorized Signatory)</div>
              <div className="fountain-signature">V. Sundaresan</div>
              <div className="trustee-line">Dr. V. Sundaresan, Ph.D.</div>
              <div className="trustee-title-text">Managing Trustee & Founder Patron</div>
            </div>
          </div>

          {/* Traditional Footnote */}
          <div className="traditional-footnote">
            "Education is the most powerful weapon to change the world" • Right Club for Education Trust • Sivakasi & Chennai • www.rceindia.org
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
