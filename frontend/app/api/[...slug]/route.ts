import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const API_KEY = process.env.API_KEY || "";

function getHeaders(request: NextRequest) {
	const headers: Record<string, string> = {
		"x-api-key": API_KEY,
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	const kombuciaoVoterId = request.headers.get("kombuciao-voter-id");
	if (kombuciaoVoterId) headers["Kombuciao-Voter-Id"] = kombuciaoVoterId;

	return headers;
}

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const slug = url.pathname.replace("/api", "");
	let endpoint = BACKEND_URL;
	if (slug.length > 0) endpoint += slug;

	const search = url.search;
	if (search) endpoint += search;

	const res = await fetch(endpoint, {
		method: "GET",
		headers: getHeaders(request),
	});
	const data = await res.json();
	return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
	const url = new URL(request.url);
	const slug = url.pathname.replace("/api", "");
	let endpoint = BACKEND_URL;
	if (slug.length > 0) endpoint += slug;

	const search = url.search;
	if (search) endpoint += search;

	const body = await request.json();

	const res = await fetch(endpoint, {
		method: "POST",
		headers: getHeaders(request),
		body: JSON.stringify(body),
	});
	const data = await res.json();
	return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
	const url = new URL(request.url);
	const slug = url.pathname.replace("/api", "");
	let endpoint = BACKEND_URL;
	if (slug.length > 0) endpoint += slug;

	const search = url.search;
	if (search) endpoint += search;

	const body = await request.json();
	const res = await fetch(endpoint, {
		method: "PUT",
		headers: getHeaders(request),
		body: JSON.stringify(body),
	});
	const data = await res.json();
	return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
	const url = new URL(request.url);
	const slug = url.pathname.replace("/api", "");
	let endpoint = BACKEND_URL;
	if (slug.length > 0) endpoint += slug;

	const search = url.search;
	if (search) endpoint += search;

	const res = await fetch(endpoint, {
		method: "DELETE",
		headers: getHeaders(request),
	});
	const data = await res.json();
	return NextResponse.json(data);
}
