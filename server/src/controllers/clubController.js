// In-memory store (persists during server runtime, compatible with or without MongoDB)
const volunteerApplications = [
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

const donationRecords = [
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

const contactMessages = [
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

const newsletterSubscribers = new Set(["arun.cse@rce.ac.in", "priya.biotech@rce.ac.in", "alumni.rce18@gmail.com", "volunteer@mykutumb.com"]);

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

const initialStories = [
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

// Public Read Controllers
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

const getProjects = (req, res) => {
  const { category } = req.query;
  let filtered = projectsList;
  if (category && category !== "All") {
    filtered = projectsList.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  res.json({ success: true, count: filtered.length, data: filtered });
};

const getEvents = (req, res) => {
  res.json({ success: true, count: eventsList.length, data: eventsList });
};

const getStories = (req, res) => {
  res.json({ success: true, count: initialStories.length, data: initialStories });
};

// Form Submission Controllers
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
    department: department || "General Studies",
    collegeId: collegeId || "N/A",
    yearOfStudy: yearOfStudy || "General",
    bloodGroup: bloodGroup || "O+ Positive",
    emergencyContact: emergencyContact || "Not provided",
    city: city || "Chennai",
    occupation: occupation || "Student",
    skills: skills || "Community Outreach",
    availability: availability || "Weekends",
    preferredDomain: preferredDomain || "General Volunteer",
    message: message || "",
    status: "Approved",
    joinedAt: new Date().toISOString()
  };

  volunteerApplications.unshift(applicationRecord);

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
  res.json({
    success: true,
    message: "Successfully subscribed to RCE monthly impact dispatch & drive invites!"
  });
};

// ==========================================
// ADMIN DASHBOARD / MANAGEMENT CONTROLLERS
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
    }
  });
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
  res.status(201).json({
    success: true,
    message: "New event created successfully!",
    data: newEvent
  });
};

const deleteEvent = (req, res) => {
  const { id } = req.params;
  eventsList = eventsList.filter(ev => ev.id !== id);
  res.json({ success: true, message: "Event deleted successfully." });
};

const createProject = (req, res) => {
  const { title, category, tagline, description, goal, raised, image, highlights, beneficiaries } = req.body;
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
    badge: "Active Initiative",
    featured: false,
    image: image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split(",").map(s => s.trim()) : ["Volunteer driven", "Community impact"])
  };

  projectsList.unshift(newProject);
  res.status(201).json({
    success: true,
    message: "New project created successfully!",
    data: newProject
  });
};

const deleteProject = (req, res) => {
  const { id } = req.params;
  projectsList = projectsList.filter(p => p.id !== id);
  res.json({ success: true, message: "Project deleted successfully." });
};

const updateStats = (req, res) => {
  const { livesImpacted, activeVolunteers, projectsCompleted, treesPlanted, mealsServed, medicalCamps } = req.body;
  if (livesImpacted !== undefined) currentStats.livesImpacted = Number(livesImpacted);
  if (activeVolunteers !== undefined) currentStats.activeVolunteers = Number(activeVolunteers);
  if (projectsCompleted !== undefined) currentStats.projectsCompleted = Number(projectsCompleted);
  if (treesPlanted !== undefined) currentStats.treesPlanted = Number(treesPlanted);
  if (mealsServed !== undefined) currentStats.mealsServed = Number(mealsServed);
  if (medicalCamps !== undefined) currentStats.medicalCamps = Number(medicalCamps);

  res.json({ success: true, message: "Stats updated successfully!", data: currentStats });
};

const updateVolunteerStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const volunteer = volunteerApplications.find(v => v.id === id);
  if (!volunteer) {
    return res.status(404).json({ success: false, message: "Volunteer not found" });
  }
  volunteer.status = status || volunteer.status;
  res.json({ success: true, message: `Volunteer status updated to ${volunteer.status}`, data: volunteer });
};

const deleteVolunteer = (req, res) => {
  const { id } = req.params;
  const index = volunteerApplications.findIndex(v => v.id === id);
  if (index !== -1) {
    volunteerApplications.splice(index, 1);
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
  res.json({ success: true, message: `Inquiry status updated to ${inquiry.status}`, data: inquiry });
};

const deleteInquiry = (req, res) => {
  const { id } = req.params;
  const index = contactMessages.findIndex(m => m.id === id);
  if (index !== -1) {
    contactMessages.splice(index, 1);
  }
  res.json({ success: true, message: "Inquiry record deleted." });
};

const deleteDonation = (req, res) => {
  const { receiptNo } = req.params;
  const index = donationRecords.findIndex(d => d.receiptNo === receiptNo);
  if (index !== -1) {
    donationRecords.splice(index, 1);
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
  getStats,
  getProjects,
  getEvents,
  getStories,
  joinClub,
  makeDonation,
  submitContact,
  subscribeNewsletter,
  getAdminData,
  createEvent,
  deleteEvent,
  createProject,
  deleteProject,
  updateStats,
  updateVolunteerStatus,
  deleteVolunteer,
  updateInquiryStatus,
  deleteInquiry,
  deleteDonation,
  adminLogin
};
