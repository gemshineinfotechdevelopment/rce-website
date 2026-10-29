const express = require("express");
const router = express.Router();
const { getHealthStatus } = require("../controllers/statusController");
const {
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
  adminLogin
} = require("../controllers/clubController");
bb
// Health check endpoint
router.get("/health", getHealthStatus);

// Message endpoint
router.get("/message", (req, res) => {
  res.json({
    message: "Vanakkam! RCE Social Service Club Backend is active on port " + (process.env.PORT || 5000),
  });
});


// ==========================================
// Public Content & Site Data Endpoints
// ==========================================
router.get("/content", getSiteContent);
router.post("/content", updateSiteContent);
router.put("/content", updateSiteContent);

router.get("/stats", getStats);
router.get("/projects", getProjects);
router.get("/events", getEvents);
router.get("/stories", getStories);
router.get("/gallery", getGallery);
router.get("/videos", getVideos);
router.post("/videos", createVideo);
router.put("/videos/:id", updateVideo);
router.delete("/videos/:id", deleteVideo);

// Public User Form Submissions
router.post("/join", joinClub);
router.post("/donate", makeDonation);
router.post("/contact", submitContact);
router.post("/newsletter", subscribeNewsletter);

// ==========================================
// Admin Management Endpoints
// ==========================================
router.post("/admin/login", adminLogin);
router.get("/admin/submissions", getAdminData);

// Volunteer Records
router.patch("/admin/volunteers/:id", updateVolunteerStatus);
router.delete("/admin/volunteers/:id", deleteVolunteer);

// Inquiries & Messages
router.patch("/admin/inquiries/:id", updateInquiryStatus);
router.delete("/admin/inquiries/:id", deleteInquiry);

// Donations
router.delete("/admin/donations/:receiptNo", deleteDonation);

// Events / Drives Management (CRUD)
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.patch("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Projects Management (CRUD)
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.patch("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Testimonial Stories Management (CRUD)
router.post("/stories", createStory);
router.put("/stories/:id", updateStory);
router.patch("/stories/:id", updateStory);
router.delete("/stories/:id", deleteStory);

// Gallery Photos Management (CRUD)
router.post("/gallery", createGalleryItem);
router.put("/gallery/:id", updateGalleryItem);
router.patch("/gallery/:id", updateGalleryItem);
router.delete("/gallery/:id", deleteGalleryItem);

// Stats Update
router.post("/stats/update", updateStats);

module.exports = router;
