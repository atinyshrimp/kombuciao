const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
	{
		voterId: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["confirm", "deny"],
			required: true,
		},
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
		description: {
			type: String,
			default: "",
		},
		votes: [voteSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
