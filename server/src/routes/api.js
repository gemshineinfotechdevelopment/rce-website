const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../controllers/statusController");
const {
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
} = require("../controllers/clubController");

// Health check endpoint
router.get("/health", getHealthStatus);

// Message endpoint
router.get("/message", (req, res) => {
  res.json({
    message: "Vanakkam! RCE Social Service Club Backend is active on port " + (process.env.PORT || 5000),
  });
});

// Public Endpoints
router.get("/stats", getStats);
router.get("/projects", getProjects);
router.get("/events", getEvents);
router.get("/stories", getStories);
router.post("/join", joinClub);
router.post("/donate", makeDonation);
router.post("/contact", submitContact);
router.post("/newsletter", subscribeNewsletter);

// Admin Management Endpoints
router.post("/admin/login", adminLogin);
router.get("/admin/submissions", getAdminData);
router.patch("/admin/volunteers/:id", updateVolunteerStatus);
router.delete("/admin/volunteers/:id", deleteVolunteer);
router.patch("/admin/inquiries/:id", updateInquiryStatus);
router.delete("/admin/inquiries/:id", deleteInquiry);
router.delete("/admin/donations/:receiptNo", deleteDonation);
router.post("/events", createEvent);
router.delete("/events/:id", deleteEvent);
router.post("/projects", createProject);
router.delete("/projects/:id", deleteProject);
router.post("/stats/update", updateStats);

module.exports = router;
