const mongoose = require("mongoose");

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
		confirms: { type: Number, default: 0 },
		denies: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
