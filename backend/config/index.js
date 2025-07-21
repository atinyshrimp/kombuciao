const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.API_KEY || "";
const MONGODB_URI = process.env.MONGODB_URI || "";
const PORT = process.env.PORT || 8080;
const ENVIRONMENT = process.env.NODE_ENV || "development";

const CONFIG = {
	API_KEY,
	MONGODB_URI,
	PORT,
	ENVIRONMENT,
};

if (ENVIRONMENT === "development")
	console.log(`Running in ${ENVIRONMENT} mode\nConfiguration:`, CONFIG);

module.exports = CONFIG;
