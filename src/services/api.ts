// API service connecting to backend on port 5024 (or relative path in production)

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:5024');

export interface ClubStats {
  livesImpacted: number;
  activeVolunteers: number;
  projectsCompleted: number;
  treesPlanted: number;
  mealsServed: number;
  medicalCamps: number;
  citiesCovered: number;
  satisfactionRate: number;
  recentDonationsCount?: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  goal: number;
  raised: number;
  volunteersEnrolled: number;
  beneficiaries: string;
  badge: string;
  featured: boolean;
  image: string;
  highlights: string[];
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  category: string;
  status: string;
  studentsImpacted?: string;
  beneficiaries?: string;
  image?: string;
  description: string;
  highlights?: string[];
  leader?: string;
  chiefGuest?: string;
  slotsTotal?: number;
  slotsBooked?: number;
  formUrl?: string;
  registrationUrl?: string;
}

export interface StoryItem {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatar: string;
  impactTag: string;
}

export const getSafeImageUrl = (
  url?: string,
  fallback = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
): string => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (
    trimmed.startsWith('file:') ||
    trimmed.startsWith('C:') ||
    trimmed.startsWith('c:') ||
    trimmed.includes(':\\') ||
    trimmed.includes('Users\\') ||
    trimmed.includes('Users/')
  ) {
    return fallback;
  }
  return trimmed;
};

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  year: string;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  category?: string;
  description?: string;
  duration?: string;
  location?: string;
  featured?: boolean;
  createdAt?: string;
}

export const extractYouTubeId = (url = ''): string => {
  if (!url) return '';
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) return match[1];
  if (/^[\w-]{11}$/.test(clean)) return clean;
  return clean;
};

export const getYouTubeThumbnail = (videoId: string): string => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (videoId: string, autoplay = false): string => {
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
};

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Miyawaki Afforestation: 12,400 Native Trees Planted',
    youtubeUrl: 'https://www.youtube.com/watch?v=0h9VqFq5b5I',
    youtubeId: '0h9VqFq5b5I',
    category: 'Environment',
    description: 'Witness 450+ passionate youth volunteers transform dry wasteland into a lush biodiverse Miyawaki urban forest in Chennai.',
    duration: '04:12',
    location: 'Kattivakkam, Chennai',
    featured: true,
  },
  {
    id: 'vid-2',
    title: 'Vidhya Connect: Free STEM Labs & Weekend Mentorship',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    category: 'Education',
    description: 'Bringing high quality science experiments, math kits, and university mentors to 1,200+ rural government school students.',
    duration: '05:30',
    location: 'Tiruvallur District',
    featured: false,
  },
  {
    id: 'vid-3',
    title: 'Arogya Mega Blood Donation & Eye Screening Camp',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    youtubeId: 'L_LUpnjgPso',
    category: 'Healthcare',
    description: 'Over 680 emergency blood units mobilized for government hospitals, alongside free cataract surgeries and medicine kits.',
    duration: '03:45',
    location: 'Kanchipuram Outskirts',
    featured: false,
  },
  {
    id: 'vid-4',
    title: 'Annapoorna Relief: 45,000 Nutritious Meals Served',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    youtubeId: 'jNQXAC9IVRw',
    category: 'Relief & Hunger',
    description: 'Delivering freshly cooked hot meals every weekend to hospital attendants, elderly shelters, and migrant worker communities.',
    duration: '04:55',
    location: 'Central Chennai',
    featured: false,
  },
];

export const DEFAULT_EVENTS: ClubEvent[] = [
  {
    "id": "ev-1793342059111",
    "title": "பழவம் குறுங்காடு !!!",
    "date": "2024-06-11",
    "time": "10:00 AM - 01:00 PM",
    "location": "PSR ENGINEERING COLLEGE",
    "category": "Green Forest",
    "status": "Conducted",
    "studentsImpacted": "1,200+ Students Benefited",
    "image": "/api/uploads/pazhavam-kurungadu-award.jpg",
    "highlights": [
      "தமிழ்நாடு அரசு & விருதுநகர் மாவட்ட நிர்வாகத்தின் சிறப்புப் பாராட்டு விருது",
      "பழவம் பகுதியில் பல்லுயிர் பெருக்கும் குறுங்காடு (Miyawaki Forest) உருவாக்கம்",
      "RCE ஐந்து ரூபாய் பாடசாலை தன்னார்வலர்களின் தீவிர பசுமைப் பணிக்கு அங்கீகாரம்"
    ],
    "leader": "RCE பசுமைப் படை (Green Wing)",
    "chiefGuest": "",
    "description": "சிவகாசி மற்றும் சுற்றுவட்டாரப் பகுதிகளில் பசுமையை மீட்டெடுக்கும் உன்னத நோக்கில் Right Club for Education (₹5 ரூபாய் பாடசாலை) முன்னெடுத்த 'பழவம் குறுங்காடு' அடர்வனத் திட்டத்தை பாராட்டி தமிழ்நாடு அரசு மற்றும் மாவட்ட நிர்வாகத்தின் சார்பில் சிறப்பு விருது வழங்கி கௌரவிக்கப்பட்டது.",
    "slotsTotal": 100,
    "slotsBooked": 0,
    "formUrl": ""
  },
  {
    "id": "ev-rce-1",
    "title": "₹5 ரூபாய் பாடசாலை (Rs. 5 School) - Evening Learning Centers",
    "date": "2025-06-15",
    "time": "05:30 PM - 07:30 PM Daily",
    "location": "Sivakasi & Rural Hubs, Tamil Nadu",
    "category": "₹5 Paadasaalai",
    "status": "Ongoing Flagship",
    "studentsImpacted": "1,200+ Students Daily",
    "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    "description": "Right Club for Education's revolutionary daily evening study hub where rural & underprivileged children receive structured coaching, homework assistance, spoken English, and holistic mentoring for just ₹5 token fee.",
    "highlights": [
      "Daily evening tutoring for grades 1 to 10",
      "Spoken English & Vedic Math workshops",
      "12+ village learning centers operating actively",
      "Free notebooks & study stationery provided"
    ],
    "leader": "RCE Paadasaalai Mentors Team",
    "chiefGuest": "Elders & Village Education Committee",
    "slotsTotal": 100,
    "slotsBooked": 0
  },
  {
    "id": "ev-rce-2",
    "title": "மாநில அளவிலான கல்வி மேளா (State-Level Kalvi Mela & Science Expo)",
    "date": "2025-10-12",
    "time": "09:30 AM - 05:00 PM",
    "location": "Town Hall Ground, Virudhunagar District",
    "category": "Kalvi Mela",
    "status": "Conducted",
    "studentsImpacted": "2,800+ Students & 45 Schools",
    "image": "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    "description": "Grand educational festival featuring working science models by students, an extensive educational book exhibition, robotics demo counters, and career pathways pavilion for government school children.",
    "highlights": [
      "Over 120 working science models exhibited",
      "Free career guidance handbooks gifted to 10th & 12th students",
      "Interactive STEM experiments & astronomy telescope viewing",
      "Merit awards & certificates for innovative child inventors"
    ],
    "leader": "RCE Kalvi Mela Organizing Board",
    "chiefGuest": "District Educational Officer (DEO) & Eminent Scientists",
    "slotsTotal": 100,
    "slotsBooked": 0
  },
  {
    "id": "ev-rce-3",
    "title": "சிறந்த நல்லாசிரியர் விருது (Best Good Teacher Award Ceremony) - 2025",
    "date": "2025-09-05",
    "time": "10:00 AM - 02:00 PM",
    "location": "Kamarajar Memorial Auditorium, Tamil Nadu",
    "category": "Teachers Award",
    "status": "Conducted",
    "studentsImpacted": "85+ Dedicated Teachers Honored",
    "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    "description": "Happy Teachers day !!!\n\nசெப்டம்பர் 5 ஆம் தேதி ஆசிரியர் தினத்தை முன்னிட்டு Right Club for Education (₹5 ரூபாய் பாடசாலை, சிவகாசி) பெருமையுடன் நடத்தும் ஆறாம் ஆண்டு சிறந்த நல்லாசிரியர் விருது வழங்கும் விழா!!! தாங்கள் தங்களது நல்லாசிரியர்களை தேர்தெடுக்கும் நல்வாய்ப்பு இதோ! தங்களது நல்லாசிரியர்களை தேர்ந்தெடுக்க கீழே உள்ள படிவத்தை பூர்த்தி செய்து எங்களுக்கு அனுப்பவும்.\nஆசிரியரின் கல்வி மற்றும் சமூக சேவைகள் குறித்து சிறந்த நல்லாசிரியர்கள் தேர்ந்தெடுக்கப்படுவர்.  \n\n12/09/2025 தேதிக்குள் இந்த படிவத்தை பூர்த்தி செய்து அனுப்பவும். வரும் 14/09/2025 அன்று தேர்ந்தெடுக்கப்பட்ட ஆசிரியர்களுக்கு சிறப்பு விருந்தினர்களால் விருதுகள் வழங்கப்படும்.\n\nநன்றி !!!!\n\nRCE 🚩\n(₹5 ரூபாய் பாடசாலை, சிவகாசி)",
    "highlights": [
      "Special memento & citation presented to 85 inspiring educators",
      "Keynote talks on value-based child education",
      "Documentary screening on unsung rural school teachers",
      "Attended by 600+ educators, students, and parents"
    ],
    "leader": "RCE Executive Council",
    "chiefGuest": "Retd. Vice Chancellor & Distinguished Educationists",
    "slotsTotal": 100,
    "slotsBooked": 0,
    "formUrl": "https://forms.gle/MdXLG6yPZrSRVejm6"
  },
  {
    "id": "ev-rce-4",
    "title": "5-ஆம் ஆண்டு வெள்ளை மாரத்தான் – 2025 (5th Annual RCE White Marathon & Clean Sivakasi)",
    "date": "2025-08-24",
    "time": "06:00 AM - 10:00 AM",
    "location": "சிவகாசி மாநகர் & முக்கிய வீதிகள் (Sivakasi City)",
    "category": "Education Awareness",
    "status": "Conducted",
    "studentsImpacted": "2,500+ பள்ளி & கல்லூரி மாணவ மாணவியர், பொதுமக்கள்",
    "image": "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
    "description": "24-08-2025 ஞாயிற்றுக்கிழமை நமது சிவகாசி மாநகரில் நமது 'ஐந்து ரூபாய் பாடசாலை' (Right Club for Education) மூலமாக ஐந்தாம் ஆண்டு மாரத்தான் (5th Annual White Marathon 2025) மிக எழுச்சியாக நடைபெற்றது.\n\nஇந்நிகழ்வில் 2,500-க்கும் மேற்பட்ட பள்ளி மற்றும் கல்லூரி மாணவ மாணவியர்கள், குழந்தைகள் மற்றும் பெரியவர்கள் என ஏழு பிரிவுகளில் ஆண்கள் மற்றும் பெண்கள் என தனித்தனியாக உற்சாகத்துடன் பங்கேற்றனர்.\n\n🏁 கொடியசைத்து துவக்கி வைத்தவர்கள்:\nஇந்த மாபெரும் நிகழ்வை உயர்திரு. மாவட்ட காவல் கண்காணிப்பாளர் (SP) அவர்களும், சிவகாசி லவ்லி உரிமையாளர் திரு. செந்தில் அவர்களும் கொடியசைத்து துவக்கி வைத்தனர்.\n\nஇந்நிகழ்வில் உயர்திரு. காவல் துணை கண்காணிப்பாளர் (DSP), காவல் ஆய்வாளர், துணை ஆய்வாளர், மருத்துவர்கள் திரு. சண்முகராஜன், திரு. மதன் மற்றும் திருமதி. திலகபாமா மற்றும் போக்குவரத்து சீரமைப்பு தன்னார்வலர்கள் அனைவரும் கலந்து கொண்டு சிறப்பித்தனர்.\n\n🌱 'தூய்மையான சிவகாசி' பசுமைத் தூய்மை இயக்கம்:\nஓட்டப்பந்தயத்தில் பொதுமக்களுக்கு அளித்த 5,000 தண்ணீர் பாட்டில்களில், சாலை மற்றும் சாக்கடைகளில் வீசிச் சென்ற 3,000-க்கும் மேற்பட்ட காலி பாட்டில்களை நமது RCE குழு மற்றும் போக்குவரத்து சீரமைப்பு தன்னார்வலர்கள் உடனுக்குடன் ஒருங்கிணைந்து முழுமையாகச் சேகரித்து அகற்றினர். இதன் மூலம் எங்களின் தலையாய குறிக்கோளான '#தூய்மையான_சிவகாசி' கொள்கை முன்னெடுக்கப்பட்டது.\n\nபங்களித்த மாணவச் செல்வங்கள், பொதுமக்கள் மற்றும் உறுதுணையாக நின்ற அனைவருக்கும் நெஞ்சார்ந்த நன்றிகள்!",
    "highlights": [
      "2,500+ பள்ளி, கல்லூரி மாணவ மாணவியர் மற்றும் பொதுமக்கள் 7 பிரிவுகளில் பங்கேற்பு",
      "மாவட்ட காவல் கண்காணிப்பாளர் (SP) & சிவகாசி லவ்லி உரிமையாளர் திரு. செந்தில் கொடியசைத்து துவக்கினர்",
      "காவல் அதிகாரிகள், மருத்துவர்கள் திரு. சண்முகராஜன், திரு. மதன் & திருமதி. திலகபாமா பங்கேற்பு",
      "தூய்மையான சிவகாசி: சாலையில் வீசப்பட்ட 3,000+ பிளாஸ்டிக் தண்ணீர் பாட்டில்களை சேகரித்து அகற்றிய RCE",
      "ஏழு பிரிவுகளில் ஆண்கள் மற்றும் பெண்களுக்கு தனித்தனியாக போட்டிகள் & பரிசளிப்பு"
    ],
    "leader": "RCE ஐந்து ரூபாய் பாடசாலை & போக்குவரத்து சீரமைப்பு தன்னார்வலர்கள்",
    "chiefGuest": "மாவட்ட காவல் கண்காணிப்பாளர் (SP) & திரு. செந்தில் (சிவகாசி லவ்லி)",
    "slotsTotal": 2500,
    "slotsBooked": 0,
    "formUrl": ""
  },
  {
    "id": "ev-rce-5",
    "title": "இலவச கல்வி உபகரணங்கள் வழங்கும் விழா (Free School Kits & Bags Distribution)",
    "date": "2025-06-08",
    "time": "09:00 AM - 01:30 PM",
    "location": "Panchayat Union Middle School, Rural Enclave",
    "category": "Kit Distribution",
    "status": "Conducted",
    "studentsImpacted": "3,200+ School Kits Distributed",
    "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    "description": "Comprehensive school reopening kit distribution providing durable school backpacks, geometry kits, long-size notebooks, pens, and water bottles to deserving government school students.",
    "highlights": [
      "High quality waterproof school bags & stationery kits",
      "Full academic year notebook bundles for 3,200+ students",
      "18 rural government schools reached across Virudhunagar district",
      "Zero financial burden on underprivileged daily-wage parents"
    ],
    "leader": "RCE Student Welfare Team",
    "chiefGuest": "Village Panchayat President & School Headmistress",
    "slotsTotal": 100,
    "slotsBooked": 0
  },
  {
    "id": "ev-rce-6",
    "title": "அரசு பள்ளி மாணவர்களுக்கான உயர்கல்வி வழிகாட்டு முகாம் (Higher Education Guidance Conclave)",
    "date": "2025-04-20",
    "time": "10:00 AM - 04:00 PM",
    "location": "District Community Auditorium",
    "category": "Career Guidance",
    "status": "Conducted",
    "studentsImpacted": "950+ 12th Standard Students Guided",
    "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    "description": "Expert career guidance camp for rural 11th and 12th standard government school students covering government college admissions, 7.5% reservation guidance, entrance exam coaching, and scholarships.",
    "highlights": [
      "Guidance on Engineering, Medicine, Arts & Science college admissions",
      "Detailed session on Tamil Nadu Government 7.5% quota & scholarships",
      "One-on-one counseling with professors and career advisors",
      "Free college admission handbook distributed to every student"
    ],
    "leader": "RCE Higher Education Cell",
    "chiefGuest": "University Professors & Career Counselors",
    "slotsTotal": 100,
    "slotsBooked": 0
  },
  {
    "id": "ev-rce-mou-psr",
    "title": "Inauguration & MoU Signing Ceremony Between RCE and PSR Engineering College for Corporate Social Activities",
    "date": "2024-08-01",
    "time": "10:00 AM - 01:00 PM",
    "location": "PSR Engineering College (PSREC), Sivakasi",
    "category": "MoU & CSR Collaboration",
    "status": "Conducted",
    "studentsImpacted": "College Students & Community Outreach",
    "image": "/api/uploads/Screenshot2026-10-30121327-1793342628230-2346.png",
    "description": "Right Club for Education (RCE) and PSR Engineering College Join Hands for Corporate Social Activities.\n\nOn 1st August, 2024, Right Club for Education (RCE) and PSR Engineering College celebrated the inauguration and signing of a Memorandum of Understanding (MoU) to collaborate on various corporate social activities.\n\nThe ceremony was held at PSREC, where esteemed members from both RCE and PSR Engineering College gathered to formalize this strategic partnership. The event began with a warm welcome address by Mr. M Venkatesh, followed by insightful speeches from key dignitaries.\n\nDuring the ceremony, Mr. T Chandrarajan, Advisor of RCE, emphasized the importance of collaborative efforts in driving social change and expressed gratitude to PSR Engineering College for their partnership.\n\nDr. P Kannan, Head, Department of Management Studies of PSR Engineering College, highlighted the institution's dedication to social responsibility and encouraged students and faculty members to actively participate in the initiatives and contribute to the cause.\n\nTogether, let's create a brighter future!",
    "highlights": [
      "MoU Signing: Collaboration on Corporate Social Activities & Welfare",
      "Health and Wellness: Health camps, awareness programs & fitness activities",
      "Environmental Conservation: Tree plantation drives & sustainability projects",
      "Drug Awareness: Rallies and educational campaigns against drug abuse",
      "Corporate Social Responsibility (CSR): Active student & faculty volunteerism"
    ],
    "leader": "RCE & PSR Engineering College Joint Committee",
    "chiefGuest": "Mr. T Chandrarajan (Advisor, RCE), Dr. P Kannan (HOD - Management Studies, PSREC) & Mr. M Venkatesh",
    "slotsTotal": 300,
    "slotsBooked": 0,
    "formUrl": ""
  },
  {
    "id": "ev-rce-gandhi-jayanti-2023",
    "title": "காந்திஜி பிறந்த நாள் கொண்டாட்டம் - 'காலமெல்லாம் காந்தி' பேச்சுப் போட்டி (Gandhi Jayanti Celebrations)",
    "date": "2023-10-02",
    "time": "09:30 AM - 01:30 PM",
    "location": "சிவகாசி ஆர்ட்ஸ் கிளப் N.R.K. ராஜரத்தினம் திலகவதி கலையரங்கம், சிவகாசி",
    "category": "Youth & Culture (இளைஞர் & கலாச்சாரம்)",
    "status": "Conducted",
    "studentsImpacted": "150+ பள்ளி, கல்லூரி மாணவர்கள் & பொதுமக்கள்",
    "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    "description": "The Right Club For Education சார்பாக தேசத்தந்தை, அகிம்சை ஆசான் மகாத்மா காந்தியடிகளின் பிறந்தநாள் விழா அக்டோபர் 2, 2023 அன்று மிகச் சிறப்பாகக் கொண்டாடப்பட்டது.\n\nஇதற்காக பள்ளி, கல்லூரி மாணவர்களுக்கும், பொதுமக்களுக்கும் 'காலமெல்லாம் காந்தி' என்ற தலைப்பில் பேச்சுப்போட்டி நடத்தப்பட்டது. இப்போட்டிக்கு நடுவராக திருமதி. பொற்கொடி (கல்லூரி தமிழ் பேராசிரியை) இருந்தார். சிவகாசி ஆர்ட்ஸ் கிளப் N.R.K. ராஜரத்தினம் திலகவதி கலையரங்கத்தில் வைத்து நடைபெற்ற இப்போட்டியில் குழந்தைகள் மிகுந்த ஆர்வமுடன் கலந்து கொண்டனர். இப்போட்டியில் கலந்து கொண்ட குழந்தைகள் காந்திஜி போல் வேடம் புனைந்து காந்தி பற்றிய கருத்துக்களை இயல்பாகவும் அழகாகவும் எடுத்துரைத்தனர்.\n\n🏆 RCE மகாத்மா காந்தியடிகள் பிறந்த நாள் பேச்சுப்போட்டி வெற்றியாளர்களின் பட்டியல்:\n\n• 1st - 4th Grade:\n  I பரிசு - R. Mithran\n  II பரிசு - K. Marivel\n  III பரிசு - S. Shylesh Guhan\n\n• 5th - 8th Grade:\n  I பரிசு - B. Niranchan\n  II பரிசு - S. Shibanya\n  III பரிசு - S. SanjayAnanth\n\n• 9th - 12th Grade:\n  I பரிசு - K. Loha Sree\n  II பரிசு - S. Annamalai Prabhu\n\n• Public (பொதுப் பிரிவு):\n  வெற்றியாளர் - T. Mala Thinagaraj\n\nபோட்டிக்கான ஏற்பாடுகளை RCE அமைப்பினர் சிறப்பாகச் செய்திருந்தனர். கலந்து கொண்ட அனைவருக்கும் நன்றி!",
    "highlights": [
      "'காலமெல்லாம் காந்தி' என்ற தலைப்பில் மாநில அளவிலான பேச்சுப்போட்டி",
      "குழந்தைகள் காந்திஜி போல் வேடம் புனைந்து கொள்கை முழக்கம்",
      "1 முதல் 12-ம் வகுப்பு மாணவர்கள் மற்றும் பொதுப்பிரிவு போட்டியாளர்கள் பங்கேற்பு",
      "வெற்றி பெற்ற மாணவச் செல்வங்களுக்கு சிறப்புப் பரிசுகள் & சான்றிதழ்கள்",
      "நடுவர்: திருமதி. பொற்கொடி (கல்லூரி தமிழ் பேராசிரியை)"
    ],
    "leader": "RCE பண்பாட்டு விழா ஒருங்கிணைப்புக் குழு",
    "chiefGuest": "திருமதி. பொற்கொடி (கல்லூரி தமிழ் பேராசிரியை - நடுவர்)",
    "slotsTotal": 200,
    "slotsBooked": 0,
    "formUrl": ""
  },
  {
    "id": "ev-rce-white-marathon-2024",
    "title": "4th Annual White Mini Marathon: A Celebration of Health and Community Spirit!",
    "date": "2024-08-18",
    "time": "06:00 AM - 10:30 AM",
    "location": "Sivakasi Arts Club & Major Streets, Sivakasi",
    "category": "Education Awareness",
    "status": "Conducted",
    "studentsImpacted": "3,500+ Students & Community Residents",
    "image": "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
    "description": "We are thrilled to announce the successful completion of the 4th Annual White Mini Marathon, which took place on August 18th, 2024, at Sivakasi Arts Club.\n\nThe event brought together an enthusiastic crowd of over 3,500 students, teachers, and community members, all united in the mission of promoting a Drug-Free Sivakasi and supporting World Breastfeeding Awareness.\n\n🏁 Event Flagged Off By:\nThe marathon was flagged off at 6 AM by Dr. Venkatesh Babu IRS, alongside Mrs. Thilagabama, whose support and encouragement set the tone for an energetic and impactful event. Their presence signified the importance of health, wellness, and unity in addressing these crucial social issues. Participants donned white attire symbolizing purity and health as they ran through key civic routes of Sivakasi.\n\n🎯 Dual Social Awareness Goals:\n• Drug-Free Sivakasi: Raising awareness about the dangers of drug abuse and fostering a healthier, safer environment for future generations.\n• World Breastfeeding Awareness: Advocating for the importance of breastfeeding and supporting maternal & child health in our community.\n\n🏅 Awards & Recognition:\nThe event culminated in a festive prize distribution ceremony where top finishers were honored with special prizes, and every participant received a certificate of appreciation.\n\nHeartfelt gratitude to our sponsors, dedicated volunteers, and runners for making this community movement a resounding success!",
    "highlights": [
      "Over 3,500 students, teachers, and citizens ran united in white attire",
      "Flagged off at 6 AM by Dr. Venkatesh Babu IRS & Mrs. Thilagabama",
      "Drug-Free Sivakasi: Intensive youth awareness rally against substance abuse",
      "World Breastfeeding Awareness: Promoting maternal and child wellness",
      "Trophies, special prizes for top finishers and certificates for all runners"
    ],
    "leader": "RCE Marathon Organizing Wing",
    "chiefGuest": "Dr. Venkatesh Babu IRS & Mrs. Thilagabama",
    "slotsTotal": 3500,
    "slotsBooked": 0,
    "formUrl": ""
  },
  {
    "id": "ev-rce-teachers-award-2024",
    "title": "சிறந்த நல்லாசிரியர் விருது வழங்கும் விழா – ஐந்து ரூபாய் பாடசாலை – 2024 (Best Good Teacher Award)",
    "date": "2024-09-15",
    "time": "10:00 AM - 01:30 PM",
    "location": "சிவகாசி திரு. NRKR ஆர்ட்ஸ் கிளப் மைதானம், சிவகாசி",
    "category": "Teachers Award",
    "status": "Conducted",
    "studentsImpacted": "15+ சிறந்த ஆசிரியர்கள் & RCE கல்வியாளர்கள் கௌரவிப்பு",
    "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    "description": "Right Club for Education (₹5 ரூபாய் பாடசாலை) சார்பாக 15.09.2024 அன்று ஆசிரியர் தின விழாவைக் கொண்டாடும் விதமாக சிறந்த நல்லாசிரியர் விருது வழங்கும் விழா மிகச் சிறப்பாக நடத்தப்பட்டது.\n\nசெப்டம்பர் 2-ல் துவங்கி 10-ம் தேதி வரை Online Form மாணவர்களுக்கும் பொதுமக்களுக்கும் இணையத்தில் அனுப்பி ஆசிரியர்களின் திறமை மற்றும் பொது நலத் தொண்டு அடிப்படையில் பல துறைகளைச் சார்ந்த 15 ஆசிரியர்கள் தேர்வு செய்யப்பட்டனர்.\n\n🏆 விருதுகள் & கௌரவிப்பு:\nஇவர்களுக்கு ஓய்வு பெற்ற தமிழ் ஆசிரியர் திரு. சந்திரபோஸ் மற்றும் RCE ஐந்து ரூபாய் பாடசாலையின் ஆலோசகர் திரு. சந்திரராஜன் ஐயா அவர்களும் இணைந்து விருதுகள் வழங்கி சிறப்பு செய்தனர்.\n\nமேலும் RCE குழுமத்தில் மாணவர்களின் நலனுக்காக அர்ப்பணிப்புடன் செயலாற்றி வரும் ஆசிரியர்களுக்கும் சிறப்பு விருதுகள் வழங்கப்பட்டன.\n\nஇந்நிகழ்வை சிவகாசி திரு. NRKR ஆர்ட்ஸ் கிளப் மைதானத்தில் RCE (ஐந்து ரூபாய் பாடசாலை) குழும உறுப்பினர்கள் மிகச் சிறப்பாக ஏற்பாடு செய்திருந்தனர்.",
    "highlights": [
      "ஆசிரியர் தின விழாவை முன்னிட்டு 2024 சிறந்த நல்லாசிரியர் விருது வழங்கும் விழா",
      "மாணவர்கள் மற்றும் பொதுமக்கள் பரிந்துரையின் அடிப்படையில் 15 சிறந்த ஆசிரியர்கள் தேர்வு",
      "ஓய்வுபெற்ற தமிழாசிரியர் திரு. சந்திரபோஸ் & RCE ஆலோசகர் திரு. சந்திரராஜன் ஐயா விருது வழங்கினர்",
      "RCE ஐந்து ரூபாய் பாடசாலை மாணவர் நலனுக்காக பணியாற்றும் ஆசிரியர்களுக்கும் சிறப்பு விருதுகள்",
      "சிவகாசி திரு. NRKR ஆர்ட்ஸ் கிளப் மைதானத்தில் கல்விப் பெருமக்கள் சூழ நடைபெற்ற விழா"
    ],
    "leader": "RCE ஐந்து ரூபாய் பாடசாலை குழுமம்",
    "chiefGuest": "ஓய்வுபெற்ற தமிழாசிரியர் திரு. சந்திரபோஸ் & RCE ஆலோசகர் திரு. சந்திரராஜன் ஐயா",
    "slotsTotal": 150,
    "slotsBooked": 0,
    "formUrl": "https://forms.gle/MdXLG6yPZrSRVejm6"
  },
  {
    "id": "ev-rce-anbumani-ramadoss-meeting",
    "title": "Honored to Meet Dr. Anbumani Ramadoss MP: Recognition of RCE's Mission",
    "date": "2024-07-28",
    "time": "11:00 AM - 01:00 PM",
    "location": "Tamil Nadu",
    "category": "Leadership & Honors",
    "status": "Conducted",
    "studentsImpacted": "RCE Youth Leadership & Social Service Outreach",
    "image": "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80",
    "description": "It was an honor for Right Club for Education (RCE) to meet Dr. Anbumani Ramadoss MP, whose motivational words emboldened our RCE leaders to create lasting positive change across our communities.\n\nHis recognition of our RCE team’s tireless efforts—from our daily ₹5 Paadasaalai rural centers to social awareness campaigns and tree planting drives—was a heartwarming testament to the dedication of our youth volunteers.\n\nA special thank you to Mrs. Thilagabama for her unwavering support and guidance. Your encouragement has been invaluable to our mission.\n\nTogether, let’s continue to build a brighter and more educated society!\n\n– Right Club for Education",
    "highlights": [
      "Honorary interaction with Dr. Anbumani Ramadoss MP",
      "Commendation for RCE's grassroots education and social welfare programs",
      "Motivational exchange empowering young social service leaders",
      "Special acknowledgment and thanks to Mrs. Thilagabama for steadfast support"
    ],
    "leader": "RCE Executive Delegation",
    "chiefGuest": "Dr. Anbumani Ramadoss MP & Mrs. Thilagabama",
    "slotsTotal": 50,
    "slotsBooked": 0,
    "formUrl": ""
  },
  {
    "id": "ev-rce-drug-free-sivakasi-2024",
    "title": "Drug-Free Sivakasi: Right Club for Education's Awareness Programs (Campus & School Conclaves)",
    "date": "2024-08-17",
    "time": "Full Series: Aug 17 - Aug 19, 2024",
    "location": "ANJAC College, SFR College for Women & Govt Schools, Sivakasi",
    "category": "Education Awareness",
    "status": "Conducted",
    "studentsImpacted": "2,500+ School & College Students Benefited",
    "image": "/api/uploads/Screenshot2026-10-30121105-1793342482386-9330.png",
    "description": "In an inspiring effort to promote a Drug-Free Sivakasi, Right Club for Education (₹5 School) conducted a series of special events from August 17th to 19th, 2024. These programs aimed at raising awareness among students and the general public about the dangers of drug abuse and the importance of living a healthy, drug-free life.\n\nKey Highlights of the Event Series:\n\n• Session with Government School Students (17th August 2024):\nThe event series began with an awareness program for government school students in Sivakasi. This interactive session focused on educating young minds about the dangers of drug addiction and the steps they can take to stay away from harmful substances.\n\n• Morning Session at Ayya Nadar Janaki Ammal College (19th August 2024):\nLed by Mr. Venkatesh Babu IRS, who spoke to college students about the risks associated with drug use and the importance of making informed, healthy choices in life. His discussion emphasized vigilance and prevention as key factors in living a drug-free life.\n\n• Afternoon Session at The Standard Fireworks Rajaratnam College for Women (SFRC):\nIn the afternoon, Mr. Venkatesh Babu IRS addressed the students of SFR College for Women, focusing on the role that individuals and communities can play in building a drug-free society. He elaborated on various methods to prevent drug abuse and encouraged students to take an active role in the movement.\n\nThese programs are a vital step toward a larger mission—building a healthier, drug-free community in Sivakasi. Heartfelt thanks to all participants, college administrations, and special guests for their steadfast support!\n\n– Right Club for Education (₹5 School)",
    "highlights": [
      "3-day anti-drug awareness conclave across Sivakasi educational institutions",
      "Inspiring keynote sessions by Mr. Venkatesh Babu IRS at ANJAC & SFR College for Women",
      "Interactive counseling & awareness session for government school children",
      "Strategic focus on youth vigilance, healthy choices, and civic prevention",
      "Organized by Right Club for Education (₹5 School) in collaboration with college administrations"
    ],
    "leader": "Right Club for Education (₹5 School) Team",
    "chiefGuest": "Mr. Venkatesh Babu IRS & College Principals",
    "slotsTotal": 2500,
    "slotsBooked": 0,
    "formUrl": ""
  },
  {
    "id": "ev-rce-kalvi-mela-2024",
    "title": "கல்வி மேளா – 2024 (State-Level Kalvi Mela 2024 - 16 Competitions)",
    "date": "2024-11-09",
    "time": "09:00 AM - 05:30 PM (2-Day Grand Festival: 09 & 10 Nov 2024)",
    "location": "சுப சங்கமம் திருமண மண்டபம், சிவகாசி",
    "category": "Kalvi Mela",
    "status": "Conducted",
    "studentsImpacted": "650+ மாணவர்கள் & சிவகாசி பள்ளிகள்",
    "image": "/api/uploads/Screenshot2026-10-30115215-1793341376498-9113.png",
    "description": "Right Club for Education (₹5 ரூபாய் பாடசாலை) கல்விமேளா – 2024 என்ற பிரம்மாண்ட கலை மற்றும் இலக்கியத் திருவிழாவை 09.11.2024 மற்றும் 10.11.2024 ஆகிய இரண்டு நாட்கள் சிவகாசி சுப சங்கமம் திருமண மண்டபத்தில் மிகச் சிறப்பாக நடத்தியது.\n\nஇந்நிகழ்வில் சிவகாசியைச் சேர்ந்த பல்வேறு அரசு மற்றும் தனியார் பள்ளிகள் உற்சாகமாகக் கலந்துகொண்டன. மாணவர்களின் பன்முகத் திறமையை வெளிப்படுத்தும் வகையில் கட்டுரை, ஓவியம், பேச்சு, நடனம், நாடகம், முக ஓவியம், மௌன நாடகம் உள்ளிட்ட 16 வகையான போட்டிகள் நடத்தப்பட்டன.\n\nஒவ்வொரு போட்டிக்கும் மூன்று பரிசுகள் வீதம் 16 போட்டிகளுக்கும் பரிசுகள் மற்றும் சான்றிதழ்கள் வழங்கப்பட்டன.\n\n🏆 ஒட்டுமொத்த சாம்பியன்ஷிப் புள்ளிகளின் அடிப்படையில் வெற்றியாளர்கள்:\n• முதல் பரிசு (Champion): சிவகாசி இந்து நாடார் பெண்கள் மேல்நிலைப் பள்ளி\n• இரண்டாம் பரிசு (Runner-up): செண்பக விநாயகர் மெட்ரிகுலேஷன் பள்ளி\n\nசிவகாசியின் 650 மாணவச் செல்வங்கள் கலந்து கொண்டு திறமைகளை வெளிப்படுத்திய இந்நிகழ்வை RCE உறுப்பினர்கள் மிகச் சிறப்பாக ஏற்பாடு செய்திருந்தனர்.",
    "highlights": [
      "இரு நாட்கள் நடைபெற்ற மாபெரும் கல்விமேளா – 2024 திருவிழா",
      "கட்டுரை, ஓவியம், பேச்சு, நடனம், நாடகம், முக ஓவியம், மௌன நாடகம் உள்ளிட்ட 16 போட்டிகள்",
      "சிவகாசியின் பல்வேறு பள்ளிகளைச் சேர்ந்த 650+ மாணவ, மாணவியர் பங்கேற்பு",
      "ஒட்டுமொத்த சாம்பியன்ஷிப் முதல் பரிசு: சிவகாசி இந்து நாடார் பெண்கள் மேல்நிலைப் பள்ளி",
      "ஒட்டுமொத்த சாம்பியன்ஷிப் இரண்டாம் பரிசு: செண்பக விநாயகர் மெட்ரிகுலேஷன் பள்ளி"
    ],
    "leader": "RCE கல்விமேளா ஒருங்கிணைப்புக் குழு",
    "chiefGuest": "சிவகாசி கல்விப் பெருமக்கள் & சிறப்பு நடுவர் குழுவினர்",
    "slotsTotal": 650,
    "slotsBooked": 0,
    "formUrl": ""
  }
];

export interface PillarItem {
  id: string;
  title: string;
  description: string;
}

export interface BrandContent {
  name: string;
  subtitle: string;
  mission: string;
  trustReg: string;
  taxExemption80G: string;
  reg12A: string;
  pan: string;
}

export interface HeroContent {
  tag: string;
  titlePrefix: string;
  titleGradient: string;
  titleSuffix: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
  trustBadge1: string;
  trustBadge2: string;
  trustBadge3: string;
  imageUrl: string;
  badgeTagline: string;
  statTreesLabel?: string;
  statLivesLabel?: string;
}

export interface AboutContent {
  tag: string;
  title: string;
  titleGradient: string;
  subtitle: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  checklist1: string;
  checklist2: string;
  checklist3: string;
  yearsExperience: string;
  yearsExperienceLabel?: string;
  drivesExperience: string;
  imageUrl: string;
  pillarsTitle?: string;
  pillars: PillarItem[];
}

export interface ContactContent {
  tag?: string;
  title?: string;
  titleGradient?: string;
  subtitle?: string;
  officeAddress: string;
  phone: string;
  email: string;
  hours: string;
  emergencyHotline: string;
}

export interface SiteContent {
  brand: BrandContent;
  hero: HeroContent;
  about: AboutContent;
  contact: ContactContent;
}

export interface JoinPayload {
  fullName: string;
  email: string;
  phone: string;
  roleType: string;
  department?: string;
  collegeId?: string;
  yearOfStudy?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  city: string;
  occupation: string;
  skills: string;
  availability: string;
  preferredDomain?: string;
  message?: string;
}

export interface VolunteerApplicationRecord extends JoinPayload {
  id: string;
  status: string;
  joinedAt: string;
}

export interface DonatePayload {
  donorName: string;
  email: string;
  phone: string;
  pan?: string;
  city?: string;
  amount: number;
  cause: string;
  paymentMethod: string;
}

export interface DonationRecord {
  receiptNo: string;
  donorName: string;
  email: string;
  phone: string;
  pan: string;
  city?: string;
  amount: number;
  cause: string;
  paymentMethod: string;
  transactionId?: string;
  taxBenefit: string;
  timestamp: string;
  status: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category?: string;
  priority?: string;
  message: string;
}

export interface ContactMessageRecord extends ContactPayload {
  id: string;
  status: string;
  receivedAt?: string;
  date?: string;
}

export interface AdminData {
  stats: ClubStats;
  volunteerApplications: VolunteerApplicationRecord[];
  donationRecords: DonationRecord[];
  contactMessages: ContactMessageRecord[];
  newsletterSubscribers: string[];
  projects: ProjectItem[];
  events: ClubEvent[];
  stories?: StoryItem[];
  gallery?: GalleryItem[];
  videos?: VideoItem[];
  siteContent?: SiteContent;
}

// Fallback Default Site Content (used when offline)
export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: 'RCE',
    subtitle: 'RIGHT CLUB FOR EDUCATION',
    mission: 'A people-driven social movement inspired by compassion and collective civic action. Bridging resources to the vulnerable and fostering responsible young leaders.',
    trustReg: 'TN/CH/2021/84920',
    taxExemption80G: 'CIT(E)/CHN/80G/2021-22/A-412',
    reg12A: 'AAATR8492GE20210',
    pan: 'AAATR8492G',
  },
  hero: {
    tag: 'A People-Driven Social Movement',
    titlePrefix: 'Dedicated to ',
    titleGradient: 'Culture, Service',
    titleSuffix: ' & Community Upliftment',
    description: 'RCE Social Service Club unites passionate youth, students, and mentors to bring tangible grassroots change. From educating underprivileged children and organizing mega medical camps, to restoring water bodies and planting native urban forests.',
    primaryCta: 'Join As Volunteer',
    secondaryCta: 'Support A Cause',
    tertiaryCta: 'Active Drives',
    trustBadge1: '80G Tax Exemption',
    trustBadge2: 'Govt. Registered NGO',
    trustBadge3: '100% Volunteer Driven',
    imageUrl: '/hero-banner.jpeg',
    badgeTagline: '✨ Service Above Self • RCE Chapter',
    statTreesLabel: 'Saplings Planted',
    statLivesLabel: 'Lives Impacted',
  },
  about: {
    tag: 'About RCE Movement',
    title: 'Empowering Youth to Serve with ',
    titleGradient: 'Heart & Integrity',
    subtitle: 'Just like Kutumb (Family), RCE is founded on the philosophy that true community development begins when we treat every citizen as family.',
    storyHeading: 'From a Small Campus Initiative to a Statewide Movement',
    storyParagraph1: 'RCE Social Service Club began with a handful of passionate students who believed that youth energy should not be confined within classrooms. We witnessed rural children struggling with textbooks, seniors suffering without basic eye care, and barren public plots longing for shade.',
    storyParagraph2: 'Today, RCE connects thousands of students, working professionals, doctors, and community elders. We do not just hand out charity; we build self-sustaining educational ecosystems, plant trees that live for decades, and empower families with dignity.',
    checklist1: '100% of public donations go directly into on-ground drive supplies',
    checklist2: 'Full financial transparency with publicly published expenditure audits',
    checklist3: 'Active chapters across universities, colleges, and residential welfare bodies',
    yearsExperience: '5+',
    yearsExperienceLabel: 'Years of Active Service',
    drivesExperience: '180+ Successful Drives',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    pillarsTitle: 'Our 4 Core Pillars of Service',
    pillars: [
      {
        id: 'pillar-1',
        title: 'Vidhya (Education)',
        description: 'Bridging the educational divide by supporting government schools, setting up smart digital labs, and conducting free weekend tutoring.',
      },
      {
        id: 'pillar-2',
        title: 'Prakriti (Environment)',
        description: 'Championing high-density Miyawaki urban forests, lake restoration, rainwater harvesting drives, and single-use plastic eradication.',
      },
      {
        id: 'pillar-3',
        title: 'Arogya (Healthcare)',
        description: 'Zero-cost screening camps for eyes, cardiac health, diabetes, and maintaining an emergency volunteer blood donation grid.',
      },
      {
        id: 'pillar-4',
        title: 'Seva (Relief & Nutrition)',
        description: 'Immediate flood and disaster relief packages, weekend nutritious meal distributions to attendants outside public hospitals.',
      },
    ],
  },
  contact: {
    tag: 'Connect With Us',
    title: 'Have Questions or a ',
    titleGradient: 'Cause to Champion?',
    subtitle: 'Every great initiative begins with a conversation. Let us know how we can collaborate.',
    officeAddress: 'RCE Youth Movement Hub, 42 Community Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040',
    phone: '+91 (044) 2894-8800 / +91 98401 22334',
    email: 'contact@rceclub.org / volunteer@rceclub.org',
    hours: 'Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: On-Ground Field Drives',
    emergencyHotline: '+91 99400 99999',
  },
};

// ==========================================
// PUBLIC API CALLS
// ==========================================

export const fetchSiteContent = async (): Promise<SiteContent> => {
  try {
    const res = await fetch(`${API_BASE}/api/content`);
    if (!res.ok) throw new Error('Failed to fetch site content');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using default site content:', error);
    return DEFAULT_SITE_CONTENT;
  }
};

export const updateSiteContentApi = async (payload: Partial<SiteContent>) => {
  const res = await fetch(`${API_BASE}/api/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update site content');
  return data;
};

export const fetchGallery = async (): Promise<GalleryItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock gallery:', error);
    return [];
  }
};

export const createGalleryItemApi = async (payload: Partial<GalleryItem>) => {
  const res = await fetch(`${API_BASE}/api/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add gallery photo');
  return data;
};

export const updateGalleryItemApi = async (id: string, payload: Partial<GalleryItem>) => {
  const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update photo');
  return data;
};

export const deleteGalleryItemApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete photo');
  return data;
};

export const fetchClubStats = async (): Promise<ClubStats> => {
  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using fallback stats:', error);
    return {
      livesImpacted: 28450,
      activeVolunteers: 1420,
      projectsCompleted: 185,
      treesPlanted: 12400,
      mealsServed: 45200,
      medicalCamps: 68,
      citiesCovered: 14,
      satisfactionRate: 98,
    };
  }
};

export const fetchClubProjects = async (category = 'All'): Promise<ProjectItem[]> => {
  try {
    const url = category === 'All' ? `${API_BASE}/api/projects` : `${API_BASE}/api/projects?category=${encodeURIComponent(category)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock projects:', error);
    return [];
  }
};

export const fetchClubEvents = async (): Promise<ClubEvent[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return DEFAULT_EVENTS;
  } catch (error) {
    console.warn('Backend unavailable, using default educational events:', error);
    return DEFAULT_EVENTS;
  }
};

export const fetchClubStories = async (): Promise<StoryItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/stories`);
    if (!res.ok) throw new Error('Failed to fetch stories');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend unavailable, using mock stories:', error);
    return [];
  }
};

export const createClubStoryApi = async (payload: Partial<StoryItem>) => {
  const res = await fetch(`${API_BASE}/api/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create story');
  return data;
};

export const updateClubStoryApi = async (id: string, payload: Partial<StoryItem>) => {
  const res = await fetch(`${API_BASE}/api/stories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update story');
  return data;
};

export const deleteClubStoryApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/stories/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete story');
  return data;
};

// ==========================================
// YOUTUBE VIDEOS API CALLS
// ==========================================

export const fetchClubVideos = async (): Promise<VideoItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/api/videos`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        localStorage.setItem('rce_club_videos', JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (error) {
    console.warn('Backend unavailable, using saved or default videos:', error);
  }

  const local = localStorage.getItem('rce_club_videos');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback to DEFAULT_VIDEOS
    }
  }
  return DEFAULT_VIDEOS;
};

export const createClubVideoApi = async (payload: Partial<VideoItem>) => {
  let createdVideo: VideoItem | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      createdVideo = data.data;
    }
  } catch (e) {
    console.warn('Backend offline, saving video to local state:', e);
  }

  const cleanId = payload.youtubeId || extractYouTubeId(payload.youtubeUrl || '');
  if (!createdVideo) {
    createdVideo = {
      id: `vid-${Date.now()}`,
      title: payload.title || 'Community Service Highlight',
      youtubeUrl: payload.youtubeUrl || `https://www.youtube.com/watch?v=${cleanId}`,
      youtubeId: cleanId,
      category: payload.category || 'General',
      description: payload.description || '',
      duration: payload.duration || '04:00',
      location: payload.location || 'Chennai',
      featured: Boolean(payload.featured),
      createdAt: new Date().toISOString(),
    };
  }

  const current = await fetchClubVideos();
  const updated = [createdVideo, ...current.filter((v) => v.id !== createdVideo?.id)];
  localStorage.setItem('rce_club_videos', JSON.stringify(updated));
  return { success: true, data: createdVideo };
};

export const updateClubVideoApi = async (id: string, payload: Partial<VideoItem>) => {
  let updatedVideo: VideoItem | null = null;
  try {
    const res = await fetch(`${API_BASE}/api/videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      updatedVideo = data.data;
    }
  } catch (e) {
    console.warn('Backend offline, updating video in local state:', e);
  }

  const current = await fetchClubVideos();
  const cleanId = payload.youtubeId || (payload.youtubeUrl ? extractYouTubeId(payload.youtubeUrl) : undefined);
  const updated = current.map((v) => {
    if (v.id === id) {
      const merged = { ...v, ...payload, ...(cleanId ? { youtubeId: cleanId } : {}) };
      if (!updatedVideo) updatedVideo = merged;
      return merged;
    }
    return v;
  });
  localStorage.setItem('rce_club_videos', JSON.stringify(updated));
  return { success: true, data: updatedVideo };
};

export const deleteClubVideoApi = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/videos/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      // deleted on backend
    }
  } catch (e) {
    console.warn('Backend offline, removing from local state:', e);
  }

  const current = await fetchClubVideos();
  const updated = current.filter((v) => v.id !== id);
  localStorage.setItem('rce_club_videos', JSON.stringify(updated));
  return { success: true };
};

export const submitJoinApplication = async (payload: JoinPayload) => {
  const res = await fetch(`${API_BASE}/api/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Submission failed');
  return data;
};

export const submitDonation = async (payload: DonatePayload) => {
  const res = await fetch(`${API_BASE}/api/donate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Donation submission failed');
  return data;
};

export const submitContactForm = async (payload: ContactPayload) => {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Message failed to send');
  return data;
};

export const submitNewsletter = async (email: string) => {
  const res = await fetch(`${API_BASE}/api/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Subscription failed');
  return data;
};

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
};

// ==========================================
// FILE / IMAGE UPLOAD API CALL
// ==========================================

export const uploadImageApi = async (file: File): Promise<string> => {
  // 1. Try uploading via FormData (multipart/form-data)
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      const url = data.url || data.data?.url;
      if (url) return url;
    }
  } catch (err) {
    console.warn('FormData upload failed, trying base64 fallback:', err);
  }

  // 2. Fallback: Read as Base64 and send JSON, or return Data URL directly
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, filename: file.name }),
        });
        if (res.ok) {
          const data = await res.json();
          const url = data.url || data.data?.url;
          if (url) return resolve(url);
        }
      } catch (e) {
        console.warn('Backend upload offline, using client-side data URL:', e);
      }
      // Safety fallback: return Base64 data URL
      resolve(base64);
    };
    reader.onerror = () => {
      resolve('');
    };
    reader.readAsDataURL(file);
  });
};

// ==========================================
// ADMIN DASHBOARD API CALLS
// ==========================================

export const fetchAdminData = async (): Promise<AdminData> => {
  const res = await fetch(`${API_BASE}/api/admin/submissions`);
  if (!res.ok) throw new Error('Failed to fetch admin submissions data');
  const json = await res.json();
  return json.data;
};

export const createClubEvent = async (payload: Partial<ClubEvent>) => {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create event');
  return data;
};

export const updateClubEvent = async (id: string, payload: Partial<ClubEvent>) => {
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update event');
  return data;
};

export const deleteClubEvent = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/events/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete event');
  return data;
};

export const createClubProject = async (payload: Partial<ProjectItem>) => {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create project');
  return data;
};

export const updateClubProject = async (id: string, payload: Partial<ProjectItem>) => {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update project');
  return data;
};

export const deleteClubProject = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/projects/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete project');
  return data;
};

export const updateClubStats = async (payload: Partial<ClubStats>) => {
  const res = await fetch(`${API_BASE}/api/stats/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update stats');
  return data;
};

export const updateVolunteerStatusApi = async (id: string, status: string) => {
  const res = await fetch(`${API_BASE}/api/admin/volunteers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update volunteer status');
  return data;
};

export const deleteVolunteerApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/admin/volunteers/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete volunteer');
  return data;
};

export const updateInquiryStatusApi = async (id: string, status: string) => {
  const res = await fetch(`${API_BASE}/api/admin/inquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update inquiry status');
  return data;
};

export const deleteInquiryApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/api/admin/inquiries/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete inquiry');
  return data;
};

export const deleteDonationApi = async (receiptNo: string) => {
  const res = await fetch(`${API_BASE}/api/admin/donations/${receiptNo}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete donation');
  return data;
};

export const adminLoginApi = async (passcode: string, username = 'RCE Admin') => {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode, username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Authentication failed');
  return data;
};
