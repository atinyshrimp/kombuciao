import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/config/db";
import { validateApiKey } from "@/lib/server/middleware/auth";
import * as reportController from "@/lib/server/controllers/report";

interface RouteContext {
	params: Promise<{ id: string; voteId: string }>;
}

export async function DELETE(request: NextRequest, context: RouteContext) {
	const authError = validateApiKey(request);
	if (authError) return authError;

	await connectDB();

	const { id, voteId } = await context.params;
	const voterId = request.headers.get("kombuciao-voter-id");

	const result = await reportController.deleteVote(id, voteId, voterId);
	return NextResponse.json(result.data, { status: result.status });
}
