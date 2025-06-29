const reportCtrl = require("../controllers/report.js");
const express = require("express");
const router = express.Router();

router.post("/", reportCtrl.createReport); // add a new report
router.get("/", reportCtrl.listReports); // list all reports (optionally filtered by storeId or since date)
router.post("/:id/confirm", reportCtrl.confirmReport); // confirm a report
router.post("/:id/deny", reportCtrl.denyReport); // deny a report
router.get("/:id", reportCtrl.getReport); // get a specific report (optional, not in original code)
router.delete("/:id", reportCtrl.deleteReport); // delete a report (optional, not in original code)

module.exports = router;
