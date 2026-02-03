import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/server/config/db";
import { validateApiKey } from "@/lib/server/middleware/auth";
import * as storeController from "@/lib/server/controllers/store";

interface RouteContext {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
	await connectDB();

	const { id } = await context.params;
	const result = await storeController.getStore(id);
	return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request: NextRequest, context: RouteContext) {
	const authError = validateApiKey(request);
	if (authError) return authError;

	await connectDB();

	const { id } = await context.params;
	const body = await request.json();
	const result = await storeController.updateStore(id, body);
	return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
	const authError = validateApiKey(request);
	if (authError) return authError;

	await connectDB();

	const { id } = await context.params;
	const result = await storeController.deleteStore(id);
	return NextResponse.json(result.data, { status: result.status });
}
