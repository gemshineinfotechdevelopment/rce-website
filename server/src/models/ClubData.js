const mongoose = require("mongoose");

const ClubDataSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "rce_master",
    },
    siteContent: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    currentStats: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    projectsList: {
      type: Array,
      default: [],
    },
    eventsList: {
      type: Array,
      default: [],
    },
    storiesList: {
      type: Array,
      default: [],
    },
    galleryList: {
      type: Array,
      default: [],
    },
    videosList: {
      type: Array,
      default: [],
    },
    volunteerApplications: {
      type: Array,
      default: [],
    },
    donationRecords: {
      type: Array,
      default: [],
    },
    contactMessages: {
      type: Array,
      default: [],
    },
    newsletterSubscribers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "club_data",
  }
);

// Individual Collections for detailed MongoDB queries & inspection
const VolunteerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    fullName: String,
    email: String,
    phone: String,
    roleType: String,
    department: String,
    collegeId: String,
    yearOfStudy: String,
    bloodGroup: String,
    emergencyContact: String,
    city: String,
    address: String,
    preferredDomain: String,
    skills: String,
    experienceLevel: String,
    status: { type: String, default: "Pending Review" },
    message: String,
    joinedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true, collection: "volunteers" }
);

const DonationSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true, unique: true },
    donorName: String,
    email: String,
    phone: String,
    pan: String,
    amount: Number,
    cause: String,
    paymentMethod: String,
    transactionId: String,
    status: { type: String, default: "Verified" },
    city: String,
    address: String,
    isTaxReceiptRequested: { type: Boolean, default: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true, collection: "donations" }
);

const ContactMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    status: { type: String, default: "New" },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true, collection: "contact_messages" }
);

const ClubData = mongoose.model("ClubData", ClubDataSchema);
const Volunteer = mongoose.model("Volunteer", VolunteerSchema);
const Donation = mongoose.model("Donation", DonationSchema);
const ContactMessage = mongoose.model("ContactMessage", ContactMessageSchema);

module.exports = {
  ClubData,
  Volunteer,
  Donation,
  ContactMessage,
};

