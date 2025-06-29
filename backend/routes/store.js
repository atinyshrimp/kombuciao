const storeCtrl = require("../controllers/store.js");
const express = require("express");
const router = express.Router();

router.post("/", storeCtrl.createStore); // add a new shop
router.get("/", storeCtrl.listStores); // list all (optionally geo-filtered)
router.get("/stats", storeCtrl.getStats); // get stats about stores
router.get("/:id", storeCtrl.getStore);
router.put("/:id", storeCtrl.updateStore); // update a shop
router.delete("/:id", storeCtrl.deleteStore); // delete a shop

module.exports = router;
