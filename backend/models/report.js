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
	{ createdAt: true }
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
		votes: [voteSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
