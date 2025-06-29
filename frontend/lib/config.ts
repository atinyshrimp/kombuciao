"use client";

function getEnvironment() {
	// Check if we're in a browser environment
	if (typeof window === "undefined") {
		return "production"; // Default for server-side
	}

	if (window.location.href.indexOf("app-staging") !== -1) return "staging";
	if (
		window.location.href.indexOf("localhost") !== -1 ||
		window.location.href.indexOf("127.0.0.1") !== -1
	)
		return "development";
	return "production";
}

// Only call getEnvironment() when needed, not at module load time
const getApiURL = () => {
	const environment = getEnvironment();
	if (environment === "development") return "http://localhost:8080";
	if (environment === "production") return "";
	return "";
};

// Export functions instead of values to avoid server-side execution
export { getEnvironment, getApiURL };

// If you need the values as constants, export them like this:
export const environment =
	typeof window !== "undefined" ? getEnvironment() : "production";
export const apiURL = typeof window !== "undefined" ? getApiURL() : "";
