// controllers/report.controller.js
const Report = require("../models/report.js");
const Store = require("../models/store.js");

async function createReport(req, res, next) {
	try {
		const { storeId, flavors, description, voterId } = req.body;
		if (!storeId || !flavors || !Array.isArray(flavors) || flavors.length === 0)
			return res
				.status(400)
				.json({ ok: false, error: "Store ID and flavors are required" });

		const store = await Store.findById(storeId);
		if (!store)
			return res.status(404).json({ ok: false, error: "Store not found" });

		const report = await Report.create({
			store: storeId,
			flavors,
			description,
			votes: [{ voterId, type: "confirm" }],
		});
		res.status(201).json({ ok: true, data: report });
	} catch (e) {
		next(e);
	}
}

async function getReport(req, res, next) {
	try {
		const reportId = req.params.id;
		if (!reportId)
			return res
				.status(400)
				.json({ ok: false, error: "Report ID is required" });
		const report = await Report.findById(reportId).populate(
			"store",
			"name address location"
		);
		if (!report)
			return res.status(404).json({ ok: false, error: "Report not found" });
		res.status(200).json({ ok: true, data: report });
	} catch (e) {
		next(e);
	}
}

async function listReports(req, res, next) {
	try {
		const { storeId, since, page = 1, pageSize = 10 } = req.query;
		const criteria = {};
		if (storeId) criteria.store = storeId;
		if (since) criteria.createdAt = { $gte: new Date(since) };

		const reports = await Report.find(criteria)
			.populate("store", "name address location")
			.skip((page - 1) * pageSize)
			.limit(Number(pageSize))
			.sort("-updatedAt");
		const total = await Report.countDocuments(criteria);
		res.status(200).json({
			ok: true,
			data: reports,
			total,
		});
	} catch (e) {
		next(e);
	}
}

async function deleteReport(req, res, next) {
	try {
		const reportId = req.params.id;
		if (!reportId)
			return res
				.status(400)
				.json({ ok: false, error: "Report ID is required" });
		const report = await Report.findByIdAndDelete(reportId);
		if (!report) return res.status(404).json({ ok: false, error: "Not found" });
		res.status(200).json({ ok: true });
	} catch (e) {
		next(e);
	}
}

async function createVote(req, res, next) {
	try {
		const { type } = req.body;
		const voterId = req.headers["kombuciao-voter-id"];
		if (!voterId)
			return res.status(401).json({ ok: false, error: "Voter ID is required" });

		const reportId = req.params.id;
		if (!reportId)
			return res
				.status(400)
				.json({ ok: false, error: "Report ID is required" });

		// Check if user has already denied this report
		const alreadyVoted = await Report.findOne({
			_id: reportId,
			"votes.voterId": voterId,
		});
		if (alreadyVoted)
			return res.status(403).json({ ok: false, error: "Already voted" });

		if (!type || !["confirm", "deny"].includes(type))
			return res.status(400).json({
				ok: false,
				error: "Invalid vote type: only 'confirm' or 'deny' are allowed",
			});

		const updatedReport = await Report.findByIdAndUpdate(
			reportId,
			{ $push: { votes: { voterId: voterId, type: type } } },
			{ new: true }
		);
		if (!updatedReport)
			return res.status(404).json({ ok: false, error: "Not found" });

		res.status(200).json({ ok: true, data: updatedReport });
	} catch (e) {
		next(e);
	}
}

async function deleteVote(req, res, next) {
	try {
		const reportId = req.params.id;
		const voteId = req.params.voteId;
		const voterId = req.headers["kombuciao-voter-id"];

		if (!reportId || !voteId || !voterId)
			return res.status(400).json({
				ok: false,
				error: "Report ID, vote ID and voter ID are required",
			});

		const report = await Report.findById(reportId);
		if (!report) return res.status(404).json({ ok: false, error: "Not found" });

		const vote = report.votes.find((v) => v._id.toString() === voteId);
		if (!vote)
			return res.status(404).json({ ok: false, error: "Vote not found" });

		if (voterId !== vote.voterId)
			return res
				.status(403)
				.json({ ok: false, error: "Unauthorized to delete this vote" });

		// If the report has only one vote, delete the report
		if (report.votes.length === 1) {
			await Report.findByIdAndDelete(reportId);
			return res.status(200).json({ ok: true, data: null });
		}

		const updatedReport = await Report.findByIdAndUpdate(
			reportId,
			{ $pull: { votes: { _id: voteId } } },
			{ new: true }
		);

		res.status(200).json({ ok: true, data: updatedReport });
	} catch (e) {
		next(e);
	}
}

module.exports = {
	createReport,
	getReport,
	listReports,
	deleteReport,
	createVote,
	deleteVote,
};
