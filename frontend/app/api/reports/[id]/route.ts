import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/config/db";
import { validateApiKey } from "@/lib/server/middleware/auth";
import * as reportController from "@/lib/server/controllers/report";

interface RouteContext {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
	await connectDB();

	const { id } = await context.params;
	const result = await reportController.getReport(id);
	return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
	const authError = validateApiKey(request);
	if (authError) return authError;

	await connectDB();

	const { id } = await context.params;
	const result = await reportController.deleteReport(id);
	return NextResponse.json(result.data, { status: result.status });
}
