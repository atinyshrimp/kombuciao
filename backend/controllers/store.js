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
		const { lat, lng, radius = 5000, page = 1, pageSize = 10 } = req.query;
		let query = {};

		let total = 0;
		if (lat && lng) {
			query.location = {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [parseFloat(lng), parseFloat(lat)],
					},
					$maxDistance: parseInt(radius, 10), // default to 5km if no radius provided
				},
			};

			total = await Store.aggregate([
				{
					$geoNear: {
						near: {
							type: "Point",
							coordinates: [parseFloat(lng), parseFloat(lat)],
						},
						distanceField: "dist.calculated",
						maxDistance: parseInt(radius),
						spherical: true,
					},
				},
				{ $count: "total" },
			]);
		} else total = await Store.countDocuments(query);

		const stores = await Store.find(query)
			.skip((page - 1) * pageSize)
			.limit(pageSize);

		if (!stores || stores.length === 0)
			return res.status(404).json({ ok: false, error: "No stores found" });

		res.json({ ok: true, data: stores, total });
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
