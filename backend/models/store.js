const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		address: { street: String, postcode: String, city: String },
		location: {
			// GeoJSON point
			type: { type: String, default: "Point" },
			coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
		},
		openingHours: { type: String, default: "" }, // e.g., "Mon-Fri 9-18"
	},
	{ timestamps: true }
);

module.exports = mongoose.model("store", StoreSchema);
