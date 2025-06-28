const mongoose = require("mongoose");
const { MONGODB_URI } = require(".");

async function connectDB() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("MongoDB connected");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

module.exports = connectDB;
