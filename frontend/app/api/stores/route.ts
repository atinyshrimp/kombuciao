import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/config/db";
import { validateApiKey } from "@/lib/server/middleware/auth";
import * as storeController from "@/lib/server/controllers/store";

export async function GET(request: NextRequest) {
	await connectDB();

	const searchParams = request.nextUrl.searchParams;
	const query = Object.fromEntries(searchParams.entries());

	const result = await storeController.listStores(query);
	return NextResponse.json(result.data, { status: result.status });
}

export async function POST(request: NextRequest) {
	const authError = validateApiKey(request);
	if (authError) return authError;

	await connectDB();

	const body = await request.json();
	const result = await storeController.createStore(body);
	return NextResponse.json(result.data, { status: result.status });
}
