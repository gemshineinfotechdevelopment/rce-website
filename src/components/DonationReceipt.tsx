import React from 'react';
import { Printer, CheckCircle, ShieldCheck, Award } from 'lucide-react';

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

  const handlePrint = () => {
    window.print();
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
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
          {showCloseBtn && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-receipt-action btn-receipt-close"
            >
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
