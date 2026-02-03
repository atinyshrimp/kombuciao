import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/config/db";
import { validateApiKey } from "@/lib/server/middleware/auth";
import * as reportController from "@/lib/server/controllers/report";

interface RouteContext {
	params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
	const authError = validateApiKey(request);
	if (authError) return authError;

	await connectDB();

	const { id } = await context.params;
	const voterId = request.headers.get("kombuciao-voter-id");
	const body = await request.json();

	const result = await reportController.createVote(id, body, voterId);
	return NextResponse.json(result.data, { status: result.status });
}
