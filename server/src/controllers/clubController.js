const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { ClubData } = require("../models/ClubData");

const DATA_FILE = path.join(__dirname, "../data/clubData.json");

// Default Website CMS Details
const defaultSiteContent = {
  brand: {
    name: "RCE CLUB",
    subtitle: "SERVICE • CULTURE • YOUTH",
    mission: "A people-driven social movement inspired by compassion and collective civic action. Bridging resources to the vulnerable and fostering responsible young leaders.",
    trustReg: "TN/CH/2021/84920",
    taxExemption80G: "CIT(E)/CHN/80G/2021-22/A-412",
    reg12A: "AAATR8492GE20210",
    pan: "AAATR8492G"
  },
  hero: {
    tag: "A People-Driven Social Movement",
    titlePrefix: "Dedicated to ",
    titleGradient: "Culture, Service",
    titleSuffix: " & Community Upliftment",
    description: "RCE Social Service Club unites passionate youth, students, and mentors to bring tangible grassroots change. From educating underprivileged children and organizing mega medical camps, to restoring water bodies and planting native urban forests.",
    primaryCta: "Join As Volunteer",
    secondaryCta: "Support A Cause",
    tertiaryCta: "Active Drives",
    trustBadge1: "80G Tax Exemption",
    trustBadge2: "Govt. Registered NGO",
    trustBadge3: "100% Volunteer Driven",
    imageUrl: "/hero-banner.jpeg",
    badgeTagline: "✨ Service Above Self • RCE Chapter",
    statTreesLabel: "Saplings Planted",
    statLivesLabel: "Lives Impacted"
  },
  about: {
    tag: "About RCE Movement",
    title: "Empowering Youth to Serve with ",
    titleGradient: "Heart & Integrity",
    subtitle: "Just like Kutumb (Family), RCE is founded on the philosophy that true community development begins when we treat every citizen as family.",
    storyHeading: "From a Small Campus Initiative to a Statewide Movement",
    storyParagraph1: "RCE Social Service Club began with a handful of passionate students who believed that youth energy should not be confined within classrooms. We witnessed rural children struggling with textbooks, seniors suffering without basic eye care, and barren public plots longing for shade.",
    storyParagraph2: "Today, RCE connects thousands of students, working professionals, doctors, and community elders. We do not just hand out charity; we build self-sustaining educational ecosystems, plant trees that live for decades, and empower families with dignity.",
    checklist1: "100% of public donations go directly into on-ground drive supplies",
    checklist2: "Full financial transparency with publicly published expenditure audits",
    checklist3: "Active chapters across universities, colleges, and residential welfare bodies",
    yearsExperience: "5+",
    yearsExperienceLabel: "Years of Active Service",
    drivesExperience: "180+ Successful Drives",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    pillarsTitle: "Our 4 Core Pillars of Service",
    pillars: [
      {
        id: "pillar-1",
        title: "Vidhya (Education)",
        description: "Bridging the educational divide by supporting government schools, setting up smart digital labs, and conducting free weekend tutoring."
      },
      {
        id: "pillar-2",
        title: "Prakriti (Environment)",
        description: "Championing high-density Miyawaki urban forests, lake restoration, rainwater harvesting drives, and single-use plastic eradication."
      },
      {
        id: "pillar-3",
        title: "Arogya (Healthcare)",
        description: "Zero-cost screening camps for eyes, cardiac health, diabetes, and maintaining an emergency volunteer blood donation grid."
      },
      {
        id: "pillar-4",
        title: "Seva (Relief & Nutrition)",
        description: "Immediate flood and disaster relief packages, weekend nutritious meal distributions to attendants outside public hospitals."
      }
    ]
  },
  contact: {
    tag: "Connect With Us",
    title: "Have Questions or a ",
    titleGradient: "Cause to Champion?",
    subtitle: "Every great initiative begins with a conversation. Let us know how we can collaborate.",
    officeAddress: "RCE Youth Movement Hub, 42 Community Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040",
    phone: "+91 (044) 2894-8800 / +91 98401 22334",
    email: "contact@rceclub.org / volunteer@rceclub.org",
    hours: "Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: On-Ground Field Drives",
    emergencyHotline: "+91 99400 99999"
  }
};

let siteContent = JSON.parse(JSON.stringify(defaultSiteContent));

let volunteerApplications = [
  {
    id: "RCE-VOL-849201",
    fullName: "Arunachalam S",
    email: "arun.cse@rce.ac.in",
    phone: "+91 98401 23456",
    roleType: "Active Member",
    department: "Computer Science & Engineering",
    collegeId: "22CS104",
    yearOfStudy: "3rd Year",
    bloodGroup: "O+ Positive",
    emergencyContact: "+91 94441 55667",
    city: "Chennai",
    occupation: "Student",
    skills: "Web Development, Event Photography, Social Media",
    availability: "Weekends & College Evenings",
    preferredDomain: "Child Education & Vidhya Connect",
    message: "Passionate about teaching coding & digital literacy to rural school children.",
    status: "Approved",
    joinedAt: "2026-10-18T10:30:00.000Z"
  },
  {
    id: "RCE-VOL-712390",
    fullName: "Priya Dharshini K",
    email: "priya.biotech@rce.ac.in",
    phone: "+91 97890 65432",
    roleType: "Volunteer",
    department: "Biotechnology",
    collegeId: "23BT045",
    yearOfStudy: "2nd Year",
    bloodGroup: "B+ Positive",
    emergencyContact: "+91 99400 11223",
    city: "Kanchipuram",
    occupation: "Student",
    skills: "Medical Screening Support, First Aid, Logistics",
    availability: "Sunday Drives Only",
    preferredDomain: "Arogya Free Health & Eye Camps",
    message: "Volunteered at Red Cross earlier. Eager to assist doctors in village medical camps.",
    status: "Approved",
    joinedAt: "2026-10-19T14:15:00.000Z"
  },
  {
    id: "RCE-VOL-552109",
    fullName: "Vigneshwaran M",
    email: "vicky.mech@rce.ac.in",
    phone: "+91 91760 99887",
    roleType: "Campus Ambassador",
    department: "Mechanical Engineering",
    collegeId: "21ME088",
    yearOfStudy: "4th Year",
    bloodGroup: "A+ Positive",
    emergencyContact: "+91 98840 77665",
    city: "Tambaram, Chennai",
    occupation: "Student Leader",
    skills: "Crowd Management, Transport, Audio/Stage Setup",
    availability: "Flexible & Emergency Call",
    preferredDomain: "Green Earth Miyawaki Afforestation",
    message: "Can coordinate college transport buses and mobilize 50+ junior student volunteers.",
    status: "Pending Review",
    joinedAt: "2026-10-21T09:40:00.000Z"
  }
];

let donationRecords = [
  {
    receiptNo: "80G-2026-00412",
    donorName: "Dr. Sundararajan Ramanathan",
    email: "dr.sundar@medicare.in",
    phone: "+91 98410 88776",
    pan: "ABCDE1234F",
    city: "Chennai",
    amount: 25000,
    cause: "Child Education & Vidhya Connect",
    paymentMethod: "UPI / Net Banking",
    transactionId: "UPI/329481928410",
    taxBenefit: "Eligible for 80G Indian Income Tax Exemption (50% Deduction)",
    timestamp: "2026-10-15T11:20:00.000Z",
    status: "Verified & Received"
  },
  {
    receiptNo: "80G-2026-00413",
    donorName: "Ananya Narayanan",
    email: "ananya.n@gmail.com",
    phone: "+91 99620 44332",
    pan: "BNXPN5544K",
    city: "Bangalore",
    amount: 10000,
    cause: "Green Earth: Miyawaki Groves",
    paymentMethod: "Credit Card / Razorpay",
    transactionId: "TXN_774910294",
    taxBenefit: "Eligible for 80G Indian Income Tax Exemption (50% Deduction)",
    timestamp: "2026-10-18T16:45:00.000Z",
    status: "Verified & Received"
  },
  {
    receiptNo: "80G-2026-00414",
    donorName: "RCE Alumni Batch 2018",
    email: "alumni.rce18@gmail.com",
    phone: "+91 94440 12890",
    pan: "AAATR8492G",
    city: "Coimbatore",
    amount: 50000,
    cause: "Annapoorna Hospital Food Drive",
    paymentMethod: "Direct Bank Transfer / NEFT",
    transactionId: "NEFT/SBIN8492019",
    taxBenefit: "Eligible for 80G Indian Income Tax Exemption (50% Deduction)",
    timestamp: "2026-10-20T08:10:00.000Z",
    status: "Verified & Received"
  }
];

let contactMessages = [
  {
    id: "MSG-101",
    name: "Kavitha Rajan (Headmistress)",
    email: "gths.poonamallee@tngov.in",
    phone: "+91 94442 33221",
    subject: "Request for Vidhya Connect Weekend Math & Science Coaching",
    category: "Assistance Request",
    priority: "High",
    message: "Our Government High School at Poonamallee has 120 10th-standard students. We would be immensely grateful if RCE student volunteers could conduct weekend coaching sessions for them.",
    status: "New",
    date: "2026-10-21T15:20:00.000Z"
  },
  {
    id: "MSG-102",
    name: "Manoj Kumar (Rotary Club)",
    email: "manoj@rotarychennaicentral.org",
    phone: "+91 98841 00998",
    subject: "Joint Mega Blood Donation & Eye Screening Camp Proposal",
    category: "Partnership / CSR",
    priority: "Normal",
    message: "We would like to partner with RCE Social Service Club to sponsor 300 cataract surgeries and co-host a mega blood drive on Campus next month.",
    status: "In Progress",
    date: "2026-10-20T12:00:00.000Z"
  }
];

let newsletterSubscribers = new Set(["arun.cse@rce.ac.in", "priya.biotech@rce.ac.in", "alumni.rce18@gmail.com", "volunteer@mykutumb.com"]);

let currentStats = {
  livesImpacted: 28450,
  activeVolunteers: 1420,
  projectsCompleted: 185,
  treesPlanted: 12400,
  mealsServed: 45200,
  medicalCamps: 68,
  citiesCovered: 14,
  satisfactionRate: 98,
};

let projectsList = [
  {
    id: "proj-1",
    title: "Vidhya Connect: Youth & Child Education",
    category: "Education",
    tagline: "Empowering 1,500+ rural & underprivileged students with after-school tutoring and study kits",
    description: "Providing quality learning kits, digital tabs, mentorship, and weekend coaching for government school students across Tamil Nadu to reduce dropout rates.",
    goal: 500000,
    raised: 412000,
    volunteersEnrolled: 84,
    beneficiaries: "1,500+ Students",
    badge: "Flagship Initiative",
    featured: true,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    highlights: ["Free STEM toolkits", "English fluency workshops", "High school scholarship grants"]
  },
  {
    id: "proj-2",
    title: "Green Earth: 25,000 Miyawaki Plantation",
    category: "Environment",
    tagline: "Restoring local biodiversity, urban green pockets, and rejuvenating dried water bodies",
    description: "Transforming barren public grounds, school perimeters, and lakeshores into dense native oxygen groves using the proven Miyawaki afforestation method.",
    goal: 350000,
    raised: 295000,
    volunteersEnrolled: 230,
    beneficiaries: "12+ Local Ecosystems",
    badge: "Eco Champion",
    featured: true,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    highlights: ["Native indigenous saplings", "Drip irrigation maintenance", "Community sapling gifting"]
  },
  {
    id: "proj-3",
    title: "Arogya: Community Eye & Health Camps",
    category: "Healthcare",
    tagline: "Free preventive screenings, pediatric checkups, and prescription glasses distribution",
    description: "Partnering with top doctors to bring mobile screening vans, free cataract diagnostics, pediatric anemia screenings, and basic medications to remote hamlets.",
    goal: 400000,
    raised: 375000,
    volunteersEnrolled: 62,
    beneficiaries: "4,200+ Villagers",
    badge: "Critical Need",
    featured: true,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    highlights: ["Free spectacles given", "Full general health review", "Zero-cost referral treatments"]
  },
  {
    id: "proj-4",
    title: "Annapoorna: Zero-Hunger Weekend Drives",
    category: "Relief",
    tagline: "Nutritious warm meals distributed to hospital attendants and homeless shelters",
    description: "Every Saturday & Sunday morning, our volunteer team prepares wholesome, hygienic meals and delivers them to government hospital attenders and night shelters.",
    goal: 250000,
    raised: 218000,
    volunteersEnrolled: 110,
    beneficiaries: "45,000+ Meals Served",
    badge: "Weekly Active",
    featured: false,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    highlights: ["100% hygienic prep", "Eco-friendly packaging", "Zero food wastage network"]
  },
  {
    id: "proj-5",
    title: "Kala Uday: Youth Talent & Sports Wing",
    category: "Culture & Youth",
    tagline: "Fostering arts, traditional crafts, leadership workshops, and youth sports",
    description: "Creating a vibrant platform for youth to discover civic leadership, public speaking, folk arts, and district-level sports tournaments.",
    goal: 200000,
    raised: 165000,
    volunteersEnrolled: 95,
    beneficiaries: "3,000+ Young Leaders",
    badge: "Inspiring Youth",
    featured: false,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    highlights: ["Inter-college youth summit", "Folk art revival camps", "Sports equipment grants"]
  },
  {
    id: "proj-6",
    title: "Shakthi: Women Skill Development Hub",
    category: "Empowerment",
    tagline: "Vocational tailoring, organic product crafting, and digital commerce skills",
    description: "Training rural and single mothers in certified tailoring, handloom weaving, financial literacy, and online micro-business setup to gain economic independence.",
    goal: 300000,
    raised: 280000,
    volunteersEnrolled: 48,
    beneficiaries: "620+ Women Entrepreneurs",
    badge: "Empowerment",
    featured: false,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    highlights: ["Free sewing machines gifted", "Micro-loans guidance", "Self-help group network"]
  }
];

let eventsList = [
  {
    id: "ev-1",
    title: "Mega Tree Plantation Drive: Mission Green 5,000",
    date: "2026-11-08",
    time: "07:30 AM - 11:30 AM",
    location: "Lakeview Biodiversity Park, Sector 4",
    category: "Environment",
    status: "Upcoming",
    slotsTotal: 150,
    slotsBooked: 118,
    description: "Join hands with 100+ fellow volunteers to plant 1,500 native saplings with tree guards and drip systems.",
    leader: "Karthik R. (Green Wing Head)"
  },
  {
    id: "ev-2",
    title: "Free Community Eye & Diabetes Screening Camp",
    date: "2026-11-15",
    time: "09:00 AM - 03:00 PM",
    location: "Govt. Higher Secondary School Campus",
    category: "Healthcare",
    status: "Upcoming",
    slotsTotal: 60,
    slotsBooked: 44,
    description: "Volunteers will assist doctors with registration, token management, vision charts, and free spectacle distribution.",
    leader: "Dr. Ananya S. & RCE Medical Team"
  },
  {
    id: "ev-3",
    title: "Vidhya Connect: Book & Science Fair for Kids",
    date: "2026-11-22",
    time: "10:00 AM - 04:00 PM",
    location: "Community Center Hall, West Zone",
    category: "Education",
    status: "Upcoming",
    slotsTotal: 80,
    slotsBooked: 52,
    description: "A fun interactive science exhibition and stationery distribution drive for 400+ middle school children.",
    leader: "Preethi M. (Education Coordinator)"
  },
  {
    id: "ev-4",
    title: "Annual Social Impact Conclave & Volunteer Awards",
    date: "2026-12-05",
    time: "05:00 PM - 08:30 PM",
    location: "City Auditorium, Main Hall",
    category: "Youth & Culture",
    status: "Upcoming",
    slotsTotal: 300,
    slotsBooked: 215,
    description: "Celebrating 5 years of relentless community service, recognizing our top youth changemakers and partners.",
    leader: "RCE Executive Board"
  }
];

let storiesList = [
  {
    id: "story-1",
    name: "Kavitha M.",
    role: "Mother of 8th Grade Student",
    location: "Rural Tiruvallur",
    quote: "Through Vidhya Connect's weekend mentoring, my daughter is scoring above 90% in Mathematics today. The books and tablet made all the difference.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    impactTag: "Education Beneficiary"
  },
  {
    id: "story-2",
    name: "Senthil Nathan",
    role: "Senior Volunteer (3 Years)",
    location: "Chennai Hub",
    quote: "Being a part of RCE transformed how I see my weekends. When you plant trees and feed families, you gain a sense of purpose no corporate job can give.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    impactTag: "Youth Volunteer"
  },
  {
    id: "story-3",
    name: "Dr. Rajeshwar Rao",
    role: "Visiting Ophthalmologist",
    location: "Healthcare Camps",
    quote: "In the last 6 months alone, RCE camps screened over 2,000 seniors and identified 320 cataract cases who were given zero-cost treatment.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
    impactTag: "Medical Partner"
  }
];

let galleryList = [
  {
    id: "g-1",
    title: "Miyawaki Urban Forest Drive",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    location: "Kattivakkam Lake",
    year: "2026",
  },
  {
    id: "g-2",
    title: "Vidhya Connect Book Distribution",
    category: "Education",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    location: "Govt Model High School",
    year: "2026",
  },
  {
    id: "g-3",
    title: "Free Community Eye Screening",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    location: "Rural Health Center",
    year: "2026",
  },
  {
    id: "g-4",
    title: "Annapoorna Food Aid Distribution",
    category: "Relief",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    location: "GH Attendant Shelters",
    year: "2026",
  },
  {
    id: "g-5",
    title: "Youth Leadership & Sports Fest",
    category: "Youth",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    location: "District Stadium",
    year: "2026",
  },
  {
    id: "g-6",
    title: "Women Sewing Machine Donation",
    category: "Empowerment",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    location: "Shakthi Skill Center",
    year: "2026",
  },
];

function extractYoutubeId(url = "") {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : (url.trim().length === 11 ? url.trim() : url);
}

let videosList = [
  {
    id: "vid-1",
    title: "Miyawaki Afforestation: 12,400 Native Trees Planted",
    youtubeUrl: "https://www.youtube.com/watch?v=0h9VqFq5b5I",
    youtubeId: "0h9VqFq5b5I",
    category: "Environment",
    description: "Witness 450+ passionate youth volunteers transform dry wasteland into a lush biodiverse Miyawaki urban forest in Chennai.",
    duration: "04:12",
    location: "Kattivakkam, Chennai",
    featured: true,
    createdAt: "2026-10-20T10:00:00.000Z"
  },
  {
    id: "vid-2",
    title: "Vidhya Connect: Free STEM Labs & Weekend Mentorship",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    youtubeId: "ScMzIvxBSi4",
    category: "Education",
    description: "Bringing high quality science experiments, math kits, and university mentors to 1,200+ rural government school students.",
    duration: "05:30",
    location: "Tiruvallur District",
    featured: false,
    createdAt: "2026-10-18T10:00:00.000Z"
  },
  {
    id: "vid-3",
    title: "Arogya Mega Blood Donation & Eye Screening Camp",
    youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    youtubeId: "L_LUpnjgPso",
    category: "Healthcare",
    description: "Over 680 emergency blood units mobilized for government hospitals, alongside free cataract surgeries and medicine kits.",
    duration: "03:45",
    location: "Kanchipuram Outskirts",
    featured: false,
    createdAt: "2026-10-15T10:00:00.000Z"
  },
  {
    id: "vid-4",
    title: "Annapoorna Relief: 45,000 Nutritious Meals Served",
    youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    youtubeId: "jNQXAC9IVRw",
    category: "Relief & Hunger",
    description: "Delivering freshly cooked hot meals every weekend to hospital attendants, elderly shelters, and migrant worker communities.",
    duration: "04:55",
    location: "Central Chennai",
    featured: false,
    createdAt: "2026-10-10T10:00:00.000Z"
  }
];

// Persistence Helpers: MongoDB (Primary) + Local File (Backup)
async function saveDataToDB() {
  try {
    if (mongoose.connection.readyState !== 1) {
      return; // DB not connected yet, skipping
    }
    const state = {
      siteContent,
      currentStats,
      projectsList,
      eventsList,
      storiesList,
      galleryList,
      videosList,
      volunteerApplications,
      donationRecords,
      contactMessages,
      newsletterSubscribers: Array.from(newsletterSubscribers),
    };
    await ClubData.findOneAndUpdate(
      { key: "rce_master" },
      { $set: state },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.warn("⚠️ Could not write to MongoDB:", err.message);
  }
}

async function syncWithDatabase() {
  try {
    if (mongoose.connection.readyState !== 1) return;
    const existing = await ClubData.findOne({ key: "rce_master" });
    if (existing) {
      if (existing.siteContent) siteContent = existing.siteContent;
      if (existing.currentStats) currentStats = existing.currentStats;
      if (existing.projectsList?.length) projectsList = existing.projectsList;
      if (existing.eventsList?.length) eventsList = existing.eventsList;
      if (existing.storiesList?.length) storiesList = existing.storiesList;
      if (existing.galleryList?.length) galleryList = existing.galleryList;
      if (existing.videosList?.length) videosList = existing.videosList;
      if (existing.volunteerApplications?.length) volunteerApplications = existing.volunteerApplications;
      if (existing.donationRecords?.length) donationRecords = existing.donationRecords;
      if (existing.contactMessages?.length) contactMessages = existing.contactMessages;
      if (existing.newsletterSubscribers?.length) {
        newsletterSubscribers = new Set(existing.newsletterSubscribers);
      }
      console.log("✅ Successfully synced and loaded live club data from MongoDB (rce_website)");
      // Keep local file backup in sync with MongoDB
      saveDataToFile(false);
    } else {
      console.log("🌱 Seeding initial club data into MongoDB database (rce_website)...");
      await saveDataToDB();
      console.log("✅ MongoDB initial seed complete!");
    }
  } catch (err) {
    console.warn("⚠️ MongoDB sync notice:", err.message);
  }
}

// Auto-trigger sync as soon as MongoDB connects
mongoose.connection.on("connected", () => {
  syncWithDatabase();
});

function saveDataToFile(syncToDB = true) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const state = {
      siteContent,
      currentStats,
      projectsList,
      eventsList,
      storiesList,
      galleryList,
      videosList,
      volunteerApplications,
      donationRecords,
      contactMessages,
      newsletterSubscribers: Array.from(newsletterSubscribers),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
    if (syncToDB) {
      saveDataToDB().catch(() => {});
    }
  } catch (err) {
    console.warn("⚠️ Could not write clubData.json:", err.message);
  }
}

function loadDataFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf8");
      const state = JSON.parse(raw);
      if (state.siteContent) siteContent = state.siteContent;
      if (state.currentStats) currentStats = state.currentStats;
      if (state.projectsList) projectsList = state.projectsList;
      if (state.eventsList) eventsList = state.eventsList;
      if (state.storiesList) storiesList = state.storiesList;
      if (state.galleryList) galleryList = state.galleryList;
      if (state.videosList && state.videosList.length > 0) videosList = state.videosList;
      if (state.volunteerApplications) volunteerApplications = state.volunteerApplications;
      if (state.donationRecords) donationRecords = state.donationRecords;
      if (state.contactMessages) contactMessages = state.contactMessages;
      if (state.newsletterSubscribers) {
        newsletterSubscribers = new Set(state.newsletterSubscribers);
      }
      console.log("✅ Successfully loaded persisted club data from clubData.json");
    }
  } catch (err) {
    console.warn("⚠️ Could not read clubData.json:", err.message);
  }
}

// Initial load from file (instant startup, doesn't block)
loadDataFromFile();

// ==========================================
// SITE CONTENT / CMS CONTROLLERS
// ==========================================

const getSiteContent = (req, res) => {
  res.json({
    success: true,
    data: siteContent
  });
};

const updateSiteContent = (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== "object") {
    return res.status(400).json({ success: false, message: "Invalid content payload" });
  }

  // Merge brand
  if (updates.brand) {
    siteContent.brand = { ...siteContent.brand, ...updates.brand };
  }
  // Merge hero
  if (updates.hero) {
    siteContent.hero = { ...siteContent.hero, ...updates.hero };
  }
  // Merge about
  if (updates.about) {
    siteContent.about = { ...siteContent.about, ...updates.about };
  }
  // Merge contact
  if (updates.contact) {
    siteContent.contact = { ...siteContent.contact, ...updates.contact };
  }

  saveDataToFile();

  res.json({
    success: true,
    message: "Public website content updated successfully!",
    data: siteContent
  });
};

// ==========================================
// GALLERY CONTROLLERS
// ==========================================

const getGallery = (req, res) => {
  res.json({
    success: true,
    count: galleryList.length,
    data: galleryList
  });
};

const createGalleryItem = (req, res) => {
  const { title, category, image, location, year } = req.body;
  if (!title || !image) {
    return res.status(400).json({ success: false, message: "Photo title and image URL are required" });
  }

  const newItem = {
    id: "g-" + Date.now(),
    title: title.trim(),
    category: category || "Environment",
    image: image.trim(),
    location: location || "Chennai Hub",
    year: year || new Date().getFullYear().toString()
  };

  galleryList.unshift(newItem);
  saveDataToFile();

  res.status(201).json({
    success: true,
    message: "Photo added to impact gallery!",
    data: newItem
  });
};

const updateGalleryItem = (req, res) => {
  const { id } = req.params;
  const index = galleryList.findIndex(g => g.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Gallery item not found" });
  }

  galleryList[index] = {
    ...galleryList[index],
    ...req.body,
    id: galleryList[index].id // preserve id
  };

  saveDataToFile();

  res.json({
    success: true,
    message: "Gallery photo details updated successfully!",
    data: galleryList[index]
  });
};

const deleteGalleryItem = (req, res) => {
  const { id } = req.params;
  galleryList = galleryList.filter(g => g.id !== id);
  saveDataToFile();

  res.json({
    success: true,
    message: "Photo removed from gallery."
  });
};

// ==========================================
// YOUTUBE VIDEOS CONTROLLERS
// ==========================================

const getVideos = (req, res) => {
  res.json({
    success: true,
    count: videosList.length,
    data: videosList
  });
};

const createVideo = (req, res) => {
  const { title, youtubeUrl, youtubeId, category, description, duration, location, featured } = req.body;
  if (!title || (!youtubeUrl && !youtubeId)) {
    return res.status(400).json({ success: false, message: "Video title and YouTube link/ID are required" });
  }

  const cleanId = youtubeId || extractYoutubeId(youtubeUrl);
  const newVideo = {
    id: `vid-${Date.now()}`,
    title: title.trim(),
    youtubeUrl: youtubeUrl ? youtubeUrl.trim() : `https://www.youtube.com/watch?v=${cleanId}`,
    youtubeId: cleanId,
    category: category || "General",
    description: description || "",
    duration: duration || "03:45",
    location: location || "Chennai",
    featured: Boolean(featured),
    createdAt: new Date().toISOString()
  };

  videosList.unshift(newVideo);
  saveDataToFile();

  res.status(201).json({
    success: true,
    message: "YouTube video added to showcase!",
    data: newVideo
  });
};

const updateVideo = (req, res) => {
  const { id } = req.params;
  const index = videosList.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Video not found" });
  }

  const { youtubeUrl, youtubeId } = req.body;
  let cleanId = youtubeId || (youtubeUrl ? extractYoutubeId(youtubeUrl) : videosList[index].youtubeId);

  videosList[index] = {
    ...videosList[index],
    ...req.body,
    youtubeId: cleanId,
    id: videosList[index].id
  };

  saveDataToFile();

  res.json({
    success: true,
    message: "Video details updated successfully!",
    data: videosList[index]
  });
};

const deleteVideo = (req, res) => {
  const { id } = req.params;
  videosList = videosList.filter(v => v.id !== id);
  saveDataToFile();

  res.json({
    success: true,
    message: "Video removed from showcase."
  });
};

// ==========================================
// TESTIMONIAL STORIES CONTROLLERS
// ==========================================

const getStories = (req, res) => {
  res.json({ success: true, count: storiesList.length, data: storiesList });
};

const createStory = (req, res) => {
  const { name, role, location, quote, avatar, impactTag } = req.body;
  if (!name || !quote) {
    return res.status(400).json({ success: false, message: "Name and quote are required" });
  }

  const newStory = {
    id: "story-" + Date.now(),
    name: name.trim(),
    role: role || "Supporter & Beneficiary",
    location: location || "Chennai",
    quote: quote.trim(),
    avatar: avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    impactTag: impactTag || "Community Voice"
  };

  storiesList.unshift(newStory);
  saveDataToFile();

  res.status(201).json({
    success: true,
    message: "Impact story published!",
    data: newStory
  });
};

const updateStory = (req, res) => {
  const { id } = req.params;
  const index = storiesList.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Story not found" });
  }

  storiesList[index] = {
    ...storiesList[index],
    ...req.body,
    id: storiesList[index].id
  };

  saveDataToFile();

  res.json({
    success: true,
    message: "Story updated successfully!",
    data: storiesList[index]
  });
};

const deleteStory = (req, res) => {
  const { id } = req.params;
  storiesList = storiesList.filter(s => s.id !== id);
  saveDataToFile();

  res.json({
    success: true,
    message: "Story removed."
  });
};

// ==========================================
// STATS CONTROLLERS
// ==========================================

const getStats = (req, res) => {
  res.json({
    success: true,
    data: {
      ...currentStats,
      activeVolunteers: currentStats.activeVolunteers + volunteerApplications.length,
      recentDonationsCount: donationRecords.length,
    }
  });
};

const updateStats = (req, res) => {
  const {
    livesImpacted,
    activeVolunteers,
    projectsCompleted,
    treesPlanted,
    mealsServed,
    medicalCamps,
    citiesCovered,
    satisfactionRate
  } = req.body;

  if (livesImpacted !== undefined) currentStats.livesImpacted = Number(livesImpacted);
  if (activeVolunteers !== undefined) currentStats.activeVolunteers = Number(activeVolunteers);
  if (projectsCompleted !== undefined) currentStats.projectsCompleted = Number(projectsCompleted);
  if (treesPlanted !== undefined) currentStats.treesPlanted = Number(treesPlanted);
  if (mealsServed !== undefined) currentStats.mealsServed = Number(mealsServed);
  if (medicalCamps !== undefined) currentStats.medicalCamps = Number(medicalCamps);
  if (citiesCovered !== undefined) currentStats.citiesCovered = Number(citiesCovered);
  if (satisfactionRate !== undefined) currentStats.satisfactionRate = Number(satisfactionRate);

  saveDataToFile();

  res.json({ success: true, message: "Stats updated successfully!", data: currentStats });
};

// ==========================================
// PROJECTS CONTROLLERS
// ==========================================

const getProjects = (req, res) => {
  const { category } = req.query;
  let filtered = projectsList;
  if (category && category !== "All") {
    filtered = projectsList.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ success: true, count: filtered.length, data: filtered });
};

const createProject = (req, res) => {
  const { title, category, tagline, description, goal, raised, image, highlights, beneficiaries, badge } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "Project title is required." });
  }

  const newProject = {
    id: "proj-" + Date.now(),
    title: title.trim(),
    category: category || "Education",
    tagline: tagline || "Empowering communities through grassroots action",
    description: description || "Social service initiative organized by RCE Club.",
    goal: Number(goal) || 100000,
    raised: Number(raised) || 0,
    volunteersEnrolled: 0,
    beneficiaries: beneficiaries || "1,000+ Beneficiaries",
    badge: badge || "Active Initiative",
    featured: false,
    image: image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split(",").map(s => s.trim()) : ["Volunteer driven", "Community impact"])
  };

  projectsList.unshift(newProject);
  saveDataToFile();

  res.status(201).json({
    success: true,
    message: "New project created successfully!",
    data: newProject
  });
};

const updateProject = (req, res) => {
  const { id } = req.params;
  const index = projectsList.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const existing = projectsList[index];
  const { title, category, tagline, description, goal, raised, image, highlights, beneficiaries, badge } = req.body;

  projectsList[index] = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    category: category !== undefined ? category : existing.category,
    tagline: tagline !== undefined ? tagline : existing.tagline,
    description: description !== undefined ? description : existing.description,
    goal: goal !== undefined ? Number(goal) : existing.goal,
    raised: raised !== undefined ? Number(raised) : existing.raised,
    image: image !== undefined ? image : existing.image,
    beneficiaries: beneficiaries !== undefined ? beneficiaries : existing.beneficiaries,
    badge: badge !== undefined ? badge : existing.badge,
    highlights: highlights !== undefined
      ? (Array.isArray(highlights) ? highlights : highlights.split(",").map(s => s.trim()))
      : existing.highlights
  };

  saveDataToFile();

  res.json({
    success: true,
    message: "Project updated successfully!",
    data: projectsList[index]
  });
};

const deleteProject = (req, res) => {
  const { id } = req.params;
  projectsList = projectsList.filter(p => p.id !== id);
  saveDataToFile();

  res.json({ success: true, message: "Project deleted successfully." });
};

// ==========================================
// EVENTS CONTROLLERS
// ==========================================

const getEvents = (req, res) => {
  res.json({ success: true, count: eventsList.length, data: eventsList });
};

const createEvent = (req, res) => {
  const { title, date, time, location, category, slotsTotal, description, leader } = req.body;
  if (!title || !date) {
    return res.status(400).json({ success: false, message: "Event title and date are required." });
  }

  const newEvent = {
    id: "ev-" + Date.now(),
    title: title.trim(),
    date,
    time: time || "09:00 AM - 01:00 PM",
    location: location || "Chennai Community Grounds",
    category: category || "Environment",
    status: "Upcoming",
    slotsTotal: Number(slotsTotal) || 100,
    slotsBooked: 0,
    description: description || "Community volunteer drive organized by RCE Social Service Club.",
    leader: leader || "RCE Event Coordinator"
  };

  eventsList.unshift(newEvent);
  saveDataToFile();

  res.status(201).json({
    success: true,
    message: "New event created successfully!",
    data: newEvent
  });
};

const updateEvent = (req, res) => {
  const { id } = req.params;
  const index = eventsList.findIndex(ev => ev.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  const existing = eventsList[index];
  const { title, date, time, location, category, slotsTotal, slotsBooked, description, leader, status } = req.body;

  eventsList[index] = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    date: date !== undefined ? date : existing.date,
    time: time !== undefined ? time : existing.time,
    location: location !== undefined ? location : existing.location,
    category: category !== undefined ? category : existing.category,
    status: status !== undefined ? status : existing.status,
    slotsTotal: slotsTotal !== undefined ? Number(slotsTotal) : existing.slotsTotal,
    slotsBooked: slotsBooked !== undefined ? Number(slotsBooked) : existing.slotsBooked,
    description: description !== undefined ? description : existing.description,
    leader: leader !== undefined ? leader : existing.leader
  };

  saveDataToFile();

  res.json({
    success: true,
    message: "Drive / Event updated successfully!",
    data: eventsList[index]
  });
};

const deleteEvent = (req, res) => {
  const { id } = req.params;
  eventsList = eventsList.filter(ev => ev.id !== id);
  saveDataToFile();

  res.json({ success: true, message: "Event deleted successfully." });
};

// ==========================================
// FORM SUBMISSION CONTROLLERS
// ==========================================

const joinClub = (req, res) => {
  const {
    fullName,
    email,
    phone,
    roleType,
    department,
    collegeId,
    yearOfStudy,
    bloodGroup,
    emergencyContact,
    city,
    occupation,
    skills,
    availability,
    preferredDomain,
    message
  } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please provide Full Name, Email, and Phone number."
    });
  }

  const applicationId = "RCE-" + (roleType ? roleType.toUpperCase().slice(0, 3) : "VOL") + "-" + Math.floor(100000 + Math.random() * 900000);

  const applicationRecord = {
    id: applicationId,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    roleType: roleType || "Volunteer",
    department: department || "General Citizen",
    collegeId: collegeId || "N/A",
    yearOfStudy: yearOfStudy || "N/A",
    bloodGroup: bloodGroup || "O+ Positive",
    emergencyContact: emergencyContact || "Not provided",
    city: city || "Chennai",
    occupation: occupation || "General Citizen",
    skills: skills || "Community Outreach",
    availability: availability || "Weekends",
    preferredDomain: preferredDomain || "General Volunteer",
    message: message || "",
    status: "Approved",
    joinedAt: new Date().toISOString()
  };

  volunteerApplications.unshift(applicationRecord);
  saveDataToFile();

  res.status(201).json({
    success: true,
    message: "Welcome to RCE Family! Your application has been approved.",
    applicationId: applicationId,
    data: applicationRecord
  });
};

const makeDonation = (req, res) => {
  const { donorName, email, phone, pan, amount, cause, paymentMethod } = req.body;

  const donationAmount = Number(amount);
  if (!donationAmount || donationAmount < 50) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid donation amount (minimum ₹50)."
    });
  }

  const receiptNo = "RCE-REC-" + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
  const donationRecord = {
    receiptNo,
    donorName: donorName || "Noble Donor",
    email: email || "donor@community.org",
    phone: phone || "Not provided",
    pan: pan ? pan.toUpperCase() : "N/A",
    amount: donationAmount,
    cause: cause || "General Community Welfare",
    paymentMethod: paymentMethod || "UPI",
    taxBenefit: "Eligible for 80G Indian Income Tax Exemption (50% Deduction)",
    timestamp: new Date().toISOString(),
    status: "Verified & Received"
  };

  donationRecords.unshift(donationRecord);

  // Update raised in related project if matched
  const project = projectsList.find(p => p.category.toLowerCase().includes((cause || "").toLowerCase()));
  if (project) {
    project.raised += donationAmount;
  }

  saveDataToFile();

  res.status(201).json({
    success: true,
    message: "Thank you for your generous contribution! Receipt generated.",
    receipt: donationRecord
  });
};

const submitContact = (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields (Name, Email, Message)."
    });
  }

  const contactRecord = {
    id: "MSG-" + Date.now().toString().slice(-6),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject || "General Inquiry",
    message: message.trim(),
    receivedAt: new Date().toISOString()
  };

  contactMessages.unshift(contactRecord);
  saveDataToFile();

  res.json({
    success: true,
    message: "Thank you for reaching out! Our club volunteer will connect with you within 24 hours.",
    ticketId: contactRecord.id
  });
};

const subscribeNewsletter = (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Please provide a valid email address." });
  }

  newsletterSubscribers.add(email.trim().toLowerCase());
  saveDataToFile();

  res.json({
    success: true,
    message: "Successfully subscribed to RCE monthly impact dispatch & drive invites!"
  });
};

// ==========================================
// ADMIN DASHBOARD CONTROLLERS
// ==========================================

const getAdminData = (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        ...currentStats,
        activeVolunteers: currentStats.activeVolunteers + volunteerApplications.length,
        recentDonationsCount: donationRecords.length,
      },
      volunteerApplications,
      donationRecords,
      contactMessages,
      newsletterSubscribers: Array.from(newsletterSubscribers),
      projects: projectsList,
      events: eventsList,
      stories: storiesList,
      gallery: galleryList,
      videos: videosList,
      siteContent: siteContent
    }
  });
};

const updateVolunteerStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const volunteer = volunteerApplications.find(v => v.id === id);
  if (!volunteer) {
    return res.status(404).json({ success: false, message: "Volunteer not found" });
  }
  volunteer.status = status || volunteer.status;
  saveDataToFile();

  res.json({ success: true, message: `Volunteer status updated to ${volunteer.status}`, data: volunteer });
};

const deleteVolunteer = (req, res) => {
  const { id } = req.params;
  const index = volunteerApplications.findIndex(v => v.id === id);
  if (index !== -1) {
    volunteerApplications.splice(index, 1);
    saveDataToFile();
  }
  res.json({ success: true, message: "Volunteer record removed." });
};

const updateInquiryStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const inquiry = contactMessages.find(m => m.id === id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: "Inquiry not found" });
  }
  inquiry.status = status || inquiry.status;
  saveDataToFile();

  res.json({ success: true, message: `Inquiry status updated to ${inquiry.status}`, data: inquiry });
};

const deleteInquiry = (req, res) => {
  const { id } = req.params;
  const index = contactMessages.findIndex(m => m.id === id);
  if (index !== -1) {
    contactMessages.splice(index, 1);
    saveDataToFile();
  }
  res.json({ success: true, message: "Inquiry record deleted." });
};

const deleteDonation = (req, res) => {
  const { receiptNo } = req.params;
  const index = donationRecords.findIndex(d => d.receiptNo === receiptNo);
  if (index !== -1) {
    donationRecords.splice(index, 1);
    saveDataToFile();
  }
  res.json({ success: true, message: "Donation record deleted." });
};

const adminLogin = (req, res) => {
  const { passcode, username } = req.body;
  const validPasscodes = ["rce@admin", "admin123", "2026", "rce2026", "admin"];
  if (validPasscodes.includes(passcode?.trim())) {
    return res.json({
      success: true,
      message: "Admin authenticated successfully",
      token: "rce-admin-token-" + Date.now(),
      adminUser: username || "RCE Club Administrator"
    });
  }
  return res.status(401).json({
    success: false,
    message: "Invalid Admin Passcode. Default access: rce@admin or admin123"
  });
};

module.exports = {
  getSiteContent,
  updateSiteContent,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getStats,
  getProjects,
  getEvents,
  getStories,
  createStory,
  updateStory,
  deleteStory,
  joinClub,
  makeDonation,
  submitContact,
  subscribeNewsletter,
  getAdminData,
  createEvent,
  updateEvent,
  deleteEvent,
  createProject,
  updateProject,
  deleteProject,
  updateStats,
  updateVolunteerStatus,
  deleteVolunteer,
  updateInquiryStatus,
  deleteInquiry,
  deleteDonation,
  adminLogin,
  syncWithDatabase
};
