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
		} = req.query;
		let query = {};

		// let total = 0;
		const stages = [];
		if (lat && lng) {
			stages.push({
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [parseFloat(lng), parseFloat(lat)],
					},
					distanceField: "dist.calculated",
					maxDistance: parseInt(radius),
					spherical: true,
				},
			});
		}

		if (name) query.name = { $regex: name, $options: "i" };

		if (Object.keys(query).length > 0) stages.push({ $match: query });
		// stages.push({ $sort: { createdAt: -1 } });
		stages.push({ $skip: (page - 1) * pageSize });
		stages.push({ $limit: parseInt(pageSize) });

		console.log("Aggregation stages:", JSON.stringify(stages, null, 2));
		const stores = await Store.aggregate(stages);

		console.log(
			"Aggregation stages for total count:",
			JSON.stringify(stages.slice(0, -2).push({ $count: "total" }), null, 2)
		);

		const totalStages = stages.slice(0, -2).concat([{ $count: "total" }]);
		console.log("Total stages:", JSON.stringify(totalStages, null, 2));

		const total = await Store.aggregate(totalStages);

		if (!stores || stores.length === 0)
			return res.status(404).json({ ok: false, error: "No stores found" });

		res.json({ ok: true, data: stores, total: total[0]?.total || 0 });
	} catch (error) {
		console.error("Error listing stores:", error);
		res.status(500).json({ error: "Failed to list stores" });
		next(error);
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

module.exports = {
	createStore,
	listStores,
	getStore,
	updateStore,
	deleteStore,
};
