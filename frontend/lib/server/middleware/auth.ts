import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.API_KEY || "";

/**
 * Middleware to validate API key from request headers.
 * Skips validation for same-origin requests.
 * @param request NextRequest object
 * @returns NextResponse with 401 status if unauthorized, otherwise null
 */
export function validateApiKey(request: NextRequest): NextResponse | null {
	// Skip API key validation for same-origin requests
	const origin = request.headers.get("origin");
	const host = request.headers.get("host");

	// Allow requests from the same origin (internal Next.js client-to-server calls)
	if (origin && host && (origin.includes(host) || origin.includes("localhost")))
		return null;

	// For external requests, validate API key
	const apiKey = request.headers.get("x-api-key");

	if (!apiKey || apiKey !== API_KEY) {
		return NextResponse.json(
			{ ok: false, error: "Unauthorized - Invalid API key" },
			{ status: 401 }
		);
	}

	return null; // null means authorized, proceed
}
