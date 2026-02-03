import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/config/db";
import * as storeController from "@/lib/server/controllers/store";

export async function GET(request: NextRequest) {
	await connectDB();

	const searchParams = request.nextUrl.searchParams;
	const query = Object.fromEntries(searchParams.entries());

	const result = await storeController.getStats(query);
	return NextResponse.json(result.data, { status: result.status });
}
