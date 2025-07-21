const storeCtrl = require("../controllers/store.js");
const express = require("express");
const router = express.Router();
const { validateApiKey } = require("../middleware/auth.js");

// Public routes
router.get("/", storeCtrl.listStores); // list all (optionally geo-filtered)
router.get("/stats", storeCtrl.getStats); // get stats about stores
router.get("/:id", storeCtrl.getStore);

// Protected routes
router.post("/", validateApiKey, storeCtrl.createStore); // add a new shop
router.put("/:id", validateApiKey, storeCtrl.updateStore); // update a shop
router.delete("/:id", validateApiKey, storeCtrl.deleteStore); // delete a shop

module.exports = router;
