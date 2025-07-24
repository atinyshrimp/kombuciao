const reportCtrl = require("../controllers/report.js");
const express = require("express");
const { validateApiKey } = require("../middleware/auth.js");
const router = express.Router();

// Public routes
router.get("/", reportCtrl.listReports); // list all reports (optionally filtered by storeId or since date)
router.get("/:id", reportCtrl.getReport); // get a specific report (optional, not in original code)

// Protected routes
router.post("/", validateApiKey, reportCtrl.createReport); // add a new report
router.post("/:id/vote", validateApiKey, reportCtrl.createVote); // create a vote for a report
router.delete("/:id/vote/:voteId", validateApiKey, reportCtrl.deleteVote); // delete a vote
router.delete("/:id", validateApiKey, reportCtrl.deleteReport); // delete a report

module.exports = router;
