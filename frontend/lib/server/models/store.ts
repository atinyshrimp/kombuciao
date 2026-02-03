import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		address: { street: String, postcode: String, city: String },
		location: {
			// GeoJSON point
			type: { type: String, default: "Point" },
			coordinates: { type: [Number] }, // [lng, lat]
		},
		openingHours: { type: String, default: "" }, // e.g., "Mon-Fri 9-18"
		types: { type: [String], default: [] }, // e.g., ["cafe", "shop"]
		osmId: {
			type: String,
			index: true,
			unique: true,
			required: true,
			default: "",
		}, // e.g., "node/2659184738"
	},
	{ timestamps: true }
);

// Prevent model recompilation during hot reloads in development
export default mongoose.models.store || mongoose.model("store", StoreSchema);
