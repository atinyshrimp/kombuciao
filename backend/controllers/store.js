const Store = require("../models/store.js");

async function createStore(req, res, next) {
	try {
		const { name, location } = req.body;
		if (!name || !location)
			return res
				.status(400)
				.json({ ok: false, error: "Name and location are required" });
		const store = new Store(req.body);
		await store.save();
		res.status(201).json({ ok: true, data: store });
	} catch (error) {
		console.error("Error creating store:", error);
		res.status(500).json({ ok: false, error: "Failed to create store" });
		next(error);
	}
}

async function listStores(req, res, next) {
	try {
		const {
			lat,
			lng,
			name,
			radius = 5000,
			page = 1,
			pageSize = 10,
			onlyAvailable = false,
			flavor,
		} = req.query;

		const skip = (page - 1) * pageSize;
		const limit = parseInt(pageSize, 10);
		const flavorArray = Array.isArray(flavor) ? flavor : flavor ? [flavor] : [];

		/* ---------- Base pipeline ---------- */
		const stages = [];

		/* 1️⃣  Geo filter (must be first) */
		if (lat && lng) {
			stages.push({
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [parseFloat(lng), parseFloat(lat)],
					},
					distanceField: "distance",
					maxDistance: parseInt(radius, 10),
					spherical: true,
				},
			});
		}

		/* 2️⃣  Name filter (optional) */
		if (name) {
			stages.push({ $match: { name: { $regex: name, $options: "i" } } });
		}

		/* 3️⃣  Lookup only recent reports */
		stages.push({
			$lookup: {
				from: "reports",
				let: { storeId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [{ $eq: ["$store", "$$storeId"] }],
							},
						},
					},
					{ $project: { flavors: 1 } },
				],
				as: "recentReports",
			},
		});

		/* 4️⃣  Keep stores that actually have reports */
		if (onlyAvailable)
			stages.push({ $match: { "recentReports.0": { $exists: true } } });

		/* 5️⃣  Merge flavours from recent reports */
		stages.push({
			$addFields: {
				flavors: {
					$reduce: {
						input: "$recentReports.flavors",
						initialValue: [],
						in: { $setUnion: ["$$value", "$$this"] },
					},
				},
			},
		});

		/* 6️⃣  Filter on specific flavor(s), if provided */
		if (flavorArray.length > 0) {
			stages.push({
				$match: {
					flavors: { $all: flavorArray },
				},
			});
		}

		/* 7️⃣  Remove recentReports from output */
		stages.push({
			$project: {
				recentReports: 0,
			},
		});

		/* 8️⃣  Facet for pagination + total */
		stages.push({
			$facet: {
				results: [{ $skip: skip }, { $limit: limit }],
				total: [{ $count: "value" }],
			},
		});

		/* ---------- Execute aggregation ---------- */
		const [response] = await Store.aggregate(stages);

		const stores = response?.results || [];
		const total = response?.total[0]?.value || 0;

		return res.json({ ok: true, data: stores, total });
	} catch (err) {
		next(err);
	}
}

async function getStore(req, res, next) {
	try {
		const storeId = req.params.id;
		if (!storeId)
			return res.status(400).json({ ok: false, error: "Store ID is required" });

		const store = await Store.findById(storeId);
		if (!store)
			return res.status(404).json({ ok: false, error: "Store not found" });

		res.json({ ok: true, data: store });
	} catch (error) {
		console.error("Error getting store:", error);
		res.status(500).json({ error: "Failed to get store" });
		next(error);
	}
}

async function updateStore(req, res, next) {
	try {
		const storeId = req.params.id;
		if (!storeId)
			return res.status(400).json({ ok: false, error: "Store ID is required" });

		const { location } = req.body;
		if (location)
			return res
				.status(400)
				.json({ ok: false, error: "Location cannot be updated" });

		const store = await Store.findByIdAndUpdate(storeId, req.body, {
			new: true,
		});
		if (!store)
			return res.status(404).json({ ok: false, error: "Store not found" });

		res.status(200).json({ ok: true, data: store });
	} catch (error) {
		console.error("Error updating store:", error);
		res.status(500).json({ ok: false, error: "Failed to update store" });
		next(error);
	}
}

async function deleteStore(req, res, next) {
	try {
		const storeId = req.params.id;
		if (!storeId)
			return res.status(400).json({ ok: false, error: "Store ID is required" });

		const store = await Store.findByIdAndDelete(storeId);
		if (!store)
			return res.status(404).json({ ok: false, error: "Store not found" });

		res.status(200).json({ ok: true });
	} catch (error) {
		console.error("Error deleting store:", error);
		res.status(500).json({ error: "Failed to delete store" });
		next(error);
	}
}

async function getStats(req, res, next) {
	try {
		const { lat, lng, radius = 5000 } = req.query;
		if ((!lat || !lng) && radius)
			return res
				.status(400)
				.json({ ok: false, error: "Radius requires lat and lng" });

		const stages = [];
		if (lat && lng) {
			stages.push({
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [parseFloat(lng), parseFloat(lat)],
					},
					distanceField: "distance",
					maxDistance: parseInt(radius, 10),
					spherical: true,
				},
			});
		}
		const totalStores = await Store.aggregate(
			stages.concat([{ $count: "count" }])
		);

		const storesWithAvailability = await Store.aggregate(
			stages.concat([
				{
					$lookup: {
						from: "reports",
						let: { storeId: "$_id" },
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [{ $eq: ["$store", "$$storeId"] }],
									},
								},
							},
						],
						as: "recentReports",
					},
				},
				{ $match: { "recentReports.0": { $exists: true } } },
				{ $count: "count" },
			])
		);

		res.json({
			ok: true,
			data: {
				totalStores: totalStores[0]?.count || 0,
				storesWithAvailability: storesWithAvailability[0]?.count || 0,
			},
		});
	} catch (error) {
		console.error("Error getting store stats:", error);
		res.status(500).json({ ok: false, error: "Failed to get store stats" });
		next(error);
	}
}

module.exports = {
	createStore,
	listStores,
	getStore,
	updateStore,
	deleteStore,
	getStats,
};
