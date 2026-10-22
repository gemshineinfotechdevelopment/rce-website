# 🤝 RCE Social Service Club Web Portal

Macha, reference website **`mykutumb.com`**-ah nalla analyze panni, athe structure, spirit, and modern stylish aesthetic-la **RCE Social Service Club**-ku full-stack web application ready panniyachu! 🚀

---

## 🌟 Key Features Implemented (Inspired by MyKutumb)

1. **🎨 Modern Premium UI & Design System**:
   - Curated Indian Saffron (`#ea580c`), Warm Amber, and Deep Hope Forest Green (`#15803d`) palette.
   - Glassmorphism sticky navbar with desktop pill-style menu & responsive mobile drawer.
   - Google Fonts typography: **Outfit** (bold expressive headings) + **Plus Jakarta Sans** (crisp body text).
   - Live backend API connectivity status badge (`🟢 API Live`).

2. **🚀 Hero Section**:
   - Tagline: *"Dedicated to Culture, Service & Community Upliftment"*.
   - Live floating stat badges (12,400+ Trees Planted, 28,450+ Lives Impacted).
   - Quick trust badges: 80G Tax Exemption, Govt. Registered Trust, 100% Volunteer Driven.

3. **📊 Real-Time Impact Metrics (Live Sync)**:
   - 6-grid impact statistics fetched live from `/api/stats`.
   - "Live Sync" button to refresh metrics directly from backend.

4. **🏛️ About Us & 4 Pillars of Service**:
   - Story of the club, transparency checklist, and 5+ years experience badge.
   - 4 Pillars: **Vidhya** (Education), **Prakriti** (Environment), **Arogya** (Healthcare), **Seva** (Relief & Nutrition).

5. **🎯 Flagship Projects & Drives**:
   - Interactive category filter tabs: *All, Education, Environment, Healthcare, Relief, Empowerment, Culture & Youth*.
   - Real-time funding progress bars (e.g. ₹4,12,000 / ₹5,00,000 raised with percentage).
   - Direct "Donate" and "Volunteer" CTA buttons per project.

6. **📅 Upcoming Drives & Events Calendar**:
   - Dynamic date badges, location, coordinator details, and remaining slots countdown.
   - Instant RSVP / Volunteer registration.

7. **🤝 Interactive "Join Us" Modal (Signature MyKutumb Flow)**:
   - Choose role: *Volunteer, Active Member, Campus Ambassador, Mentor/Professional*.
   - Multi-step details submission.
   - Connected to backend `POST /api/join`.
   - Displays instant registration approval with Unique Member ID (e.g. `RCE-VOL-849201`) + direct WhatsApp group invite button.

8. **💖 Interactive "Donate" Modal with 80G Tax Exemption**:
   - Preset amounts (₹500, ₹1000, ₹2500, ₹5000, ₹10000) or custom amount.
   - Dynamic real-time impact explanation (e.g. *"₹1,000 plants & protects 5 native shade trees"*).
   - Simulated UPI QR Code scan & Direct Bank details (NEFT/IMPS).
   - Instant official digital **80G Tax Exemption receipt generation** with print option!

9. **💬 Voices of Change (Stories & Testimonials)**:
   - Verified feedback from students, volunteers, and medical partners.

10. **📷 Impact Photo Gallery**:
    - Filterable gallery with hover overlay and lightbox image modal.

11. **📞 Contact & 24/7 Emergency Helpline**:
    - Interactive inquiry form connected to `POST /api/contact`.
    - 24/7 emergency hotline for blood donation and food relief.

12. **🛡️ Rich Footer & Newsletter Subscription**:
    - Trust registration details (Trust Reg No, 80G Approval, 12A Certified).
    - Newsletter form connected to `POST /api/newsletter`.

---

## 🛠️ Tech Stack & Endpoints

- **Frontend**: React 19 + TypeScript + Vite + Lucide Icons + Custom CSS Design System
- **Backend**: Node.js + Express + MongoDB ready + In-memory fallback
- **Proxy**: Vite config proxies `/api` requests to `http://localhost:5000`

### 🌐 Backend API Endpoints:
- `GET /api/health` - Server health check
- `GET /api/stats` - Live impact statistics
- `GET /api/projects` - Filterable project directory
- `GET /api/events` - Upcoming drives & camps
- `GET /api/stories` - Beneficiary & volunteer stories
- `POST /api/join` - Volunteer & membership registration
- `POST /api/donate` - Donation records & 80G receipts
- `POST /api/contact` - User inquiries
- `POST /api/newsletter` - Monthly newsletter subscriptions

---

## 🏃‍♂️ How to Run

### Run Both Together:
```bash
npm run dev:all
```

### Run Separately:
- **Frontend** (Port 5173):
  ```bash
  npm run dev
  ```
  URL: `http://localhost:5173`

- **Backend** (Port 5000):
  ```bash
  npm run server
  ```
  URL: `http://localhost:5000`
