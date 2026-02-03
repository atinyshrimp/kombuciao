import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/config/db";
import { validateApiKey } from "@/lib/server/middleware/auth";
import * as reportController from "@/lib/server/controllers/report";

export async function GET(request: NextRequest) {
	await connectDB();

	const searchParams = request.nextUrl.searchParams;
	const query = Object.fromEntries(searchParams.entries());

	const result = await reportController.listReports(query);
	return NextResponse.json(result.data, { status: result.status });
}

export async function POST(request: NextRequest) {
	const authError = validateApiKey(request);
	if (authError) return authError;

	await connectDB();

	const body = await request.json();
	const result = await reportController.createReport(body);
	return NextResponse.json(result.data, { status: result.status });
}
