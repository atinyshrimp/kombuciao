import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const slug = url.pathname.replace("/api", "");
	let endpoint = BACKEND_URL;
	if (slug.length > 0) endpoint += slug;

	const search = url.search;
	if (search) endpoint += search;

	const res = await fetch(endpoint, {
		method: "GET",
		headers: {
			"x-api-key": process.env.API_KEY!,
		},
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
		headers: {
			"Content-Type": "application/json",
			"x-api-key": process.env.API_KEY!,
		},
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
		headers: {
			"Content-Type": "application/json",
			"x-api-key": process.env.API_KEY!,
		},
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
		headers: {
			"x-api-key": process.env.API_KEY!,
		},
	});
	const data = await res.json();
	return NextResponse.json(data);
}
