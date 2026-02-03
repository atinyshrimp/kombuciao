import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
	{
		voterId: { type: String, required: true },
		type: { type: String, enum: ["confirm", "deny"], required: true },
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

const reportSchema = new mongoose.Schema(
	{
		store: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "store",
			required: true,
		},
		flavors: [
			{
				type: String,
				enum: [
					"citron",
					"peche",
					"fruits_rouges",
					"dragon",
					"menthe",
					"gingembre_hibiscus",
				],
			},
		],
		description: { type: String, default: "" },
		votes: [voteSchema],
	},
	{ timestamps: true }
);

// Prevent model recompilation during hot reloads in development
export default mongoose.models.report || mongoose.model("report", reportSchema);
