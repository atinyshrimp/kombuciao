const { API_KEY } = require("../config");

const validateApiKey = (req, res, next) => {
	const apiKey = req.headers["x-api-key"];
	const validApiKey = API_KEY;

	if (!apiKey || apiKey !== validApiKey) {
		return res.status(401).json({
			error: "Unauthorized - Invalid API key",
		});
	}

	next();
};

module.exports = {
	validateApiKey,
};
