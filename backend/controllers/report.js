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

async function confirmReport(req, res, next) {
	try {
		const { voterId } = req.body;
		if (!voterId)
			return res.status(401).json({ ok: false, error: "User ID is required" });

		const reportId = req.params.id;
		if (!reportId)
			return res
				.status(400)
				.json({ ok: false, error: "Report ID is required" });

		// Check if user has already confirmed this report
		const alreadyVoted = await Report.findOne({
			_id: reportId,
			"votes.voterId": voterId,
		});
		if (alreadyVoted)
			return res.status(403).json({ ok: false, error: "Already voted" });

		const updatedReport = await Report.findByIdAndUpdate(
			reportId,
			{ $push: { votes: { voterId: voterId, type: "confirm" } } },
			{ new: true }
		);
		if (!updatedReport) return res.status(404).json({ error: "Not found" });

		res.status(200).json({ ok: true, data: updatedReport });
	} catch (e) {
		next(e);
	}
}

async function denyReport(req, res, next) {
	try {
		const { voterId } = req.body;
		if (!voterId)
			return res.status(401).json({ ok: false, error: "User ID is required" });

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

		const updatedReport = await Report.findByIdAndUpdate(
			reportId,
			{ $push: { votes: { voterId: voterId, type: "deny" } } },
			{ new: true }
		);
		if (!updatedReport)
			return res.status(404).json({ ok: false, error: "Not found" });

		res.status(200).json({ ok: true, data: updatedReport });
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

module.exports = {
	createReport,
	getReport,
	listReports,
	confirmReport,
	denyReport,
	deleteReport,
};
