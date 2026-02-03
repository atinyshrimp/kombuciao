import Report from "../models/report";
import Store from "../models/store";

export async function createReport(body: any) {
	const { storeId, flavors, description, voterId } = body;

	if (!storeId || !flavors || !Array.isArray(flavors) || flavors.length === 0) {
		return {
			status: 400,
			data: { ok: false, error: "Store ID and flavors are required" },
		};
	}

	try {
		const store = await Store.findById(storeId);
		if (!store)
			return { status: 404, data: { ok: false, error: "Store not found" } };

		const report = await Report.create({
			store: storeId,
			flavors,
			description,
			votes: [{ voterId, type: "confirm" }],
		});

		return { status: 201, data: { ok: true, data: report } };
	} catch (error) {
		console.error("Error creating report:", error);
		return {
			status: 500,
			data: { ok: false, error: "Failed to create report" },
		};
	}
}

export async function getReport(id: string) {
	if (!id)
		return { status: 400, data: { ok: false, error: "Report ID is required" } };

	try {
		const report = await Report.findById(id).populate(
			"store",
			"name address location"
		);
		if (!report)
			return { status: 404, data: { ok: false, error: "Report not found" } };

		return { status: 200, data: { ok: true, data: report } };
	} catch (error) {
		console.error("Error getting report:", error);
		return { status: 500, data: { ok: false, error: "Failed to get report" } };
	}
}

export async function listReports(query: any) {
	try {
		const { storeId, since, page = "1", pageSize = "10" } = query;

		const criteria: any = {};
		if (storeId) criteria.store = storeId;
		if (since) criteria.createdAt = { $gte: new Date(since) };

		const reports = await Report.find(criteria)
			.populate("store", "name address location")
			.skip((parseInt(page) - 1) * parseInt(pageSize))
			.limit(Number(pageSize))
			.sort("-updatedAt");

		const total = await Report.countDocuments(criteria);

		return { status: 200, data: { ok: true, data: reports, total } };
	} catch (error) {
		console.error("Error listing reports:", error);
		return {
			status: 500,
			data: { ok: false, error: "Failed to list reports" },
		};
	}
}

export async function deleteReport(id: string) {
	if (!id)
		return { status: 400, data: { ok: false, error: "Report ID is required" } };

	try {
		const report = await Report.findByIdAndDelete(id);
		if (!report)
			return { status: 404, data: { ok: false, error: "Not found" } };

		return { status: 200, data: { ok: true } };
	} catch (error) {
		console.error("Error deleting report:", error);
		return {
			status: 500,
			data: { ok: false, error: "Failed to delete report" },
		};
	}
}

export async function createVote(
	id: string,
	body: any,
	voterId: string | null
) {
	const { type } = body;

	if (!voterId)
		return { status: 401, data: { ok: false, error: "Voter ID is required" } };

	if (!id)
		return { status: 400, data: { ok: false, error: "Report ID is required" } };

	try {
		// Check if user has already voted on this report
		const alreadyVoted = await Report.findOne({
			_id: id,
			"votes.voterId": voterId,
		});

		if (alreadyVoted)
			return { status: 403, data: { ok: false, error: "Already voted" } };

		if (!type || !["confirm", "deny"].includes(type)) {
			return {
				status: 400,
				data: {
					ok: false,
					error: "Invalid vote type: only 'confirm' or 'deny' are allowed",
				},
			};
		}

		const updatedReport = await Report.findByIdAndUpdate(
			id,
			{ $push: { votes: { voterId: voterId, type: type } } },
			{ new: true }
		);

		if (!updatedReport)
			return { status: 404, data: { ok: false, error: "Not found" } };

		return { status: 200, data: { ok: true, data: updatedReport } };
	} catch (error) {
		console.error("Error creating vote:", error);
		return { status: 500, data: { ok: false, error: "Failed to create vote" } };
	}
}

export async function deleteVote(
	reportId: string,
	voteId: string,
	voterId: string | null
) {
	if (!reportId || !voteId || !voterId) {
		return {
			status: 400,
			data: {
				ok: false,
				error: "Report ID, vote ID and voter ID are required",
			},
		};
	}

	try {
		const report = await Report.findById(reportId);
		if (!report)
			return { status: 404, data: { ok: false, error: "Not found" } };

		const vote = report.votes.find((v: any) => v._id.toString() === voteId);
		if (!vote)
			return { status: 404, data: { ok: false, error: "Vote not found" } };

		if (voterId !== vote.voterId) {
			return {
				status: 403,
				data: { ok: false, error: "Unauthorized to delete this vote" },
			};
		}

		// If the report has only one vote, delete the report
		if (report.votes.length === 1) {
			await Report.findByIdAndDelete(reportId);
			return { status: 200, data: { ok: true, data: null } };
		}

		const updatedReport = await Report.findByIdAndUpdate(
			reportId,
			{ $pull: { votes: { _id: voteId } } },
			{ new: true }
		);

		return { status: 200, data: { ok: true, data: updatedReport } };
	} catch (error) {
		console.error("Error deleting vote:", error);
		return { status: 500, data: { ok: false, error: "Failed to delete vote" } };
	}
}
