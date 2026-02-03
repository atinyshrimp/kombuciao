import Store from "../models/store";

export async function createStore(body: any) {
	const { name, location } = body;
	if (!name || !location) {
		return {
			status: 400,
			data: { ok: false, error: "Name and location are required" },
		};
	}

	try {
		const store = new Store(body);
		await store.save();
		return { status: 201, data: { ok: true, data: store } };
	} catch (error) {
		console.error("Error creating store:", error);
		return {
			status: 500,
			data: { ok: false, error: "Failed to create store" },
		};
	}
}

export async function listStores(query: any) {
	try {
		const {
			lat,
			lng,
			name,
			radius = "5000",
			page = "1",
			pageSize = "10",
			onlyAvailable = "false",
			flavor,
		} = query;

		const skip = (parseInt(page) - 1) * parseInt(pageSize);
		const limit = parseInt(pageSize, 10);
		const flavorArray = Array.isArray(flavor) ? flavor : flavor ? [flavor] : [];

		/* ---------- Base pipeline ---------- */
		const stages: any[] = [];

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
		if (name)
			stages.push({ $match: { name: { $regex: name, $options: "i" } } });

		/* 3️⃣  Lookup only recent reports */
		stages.push({
			$lookup: {
				from: "reports",
				let: { storeId: "$_id" },
				pipeline: [
					{ $match: { $expr: { $and: [{ $eq: ["$store", "$$storeId"] }] } } },
					{ $project: { flavors: 1 } },
				],
				as: "recentReports",
			},
		});

		/* 4️⃣  Keep stores that actually have reports */
		if (onlyAvailable === "true")
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
		if (flavorArray.length > 0)
			stages.push({ $match: { flavors: { $all: flavorArray } } });

		/* 7️⃣  Remove recentReports from output */
		stages.push({ $project: { recentReports: 0 } });

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

		return { status: 200, data: { ok: true, data: stores, total } };
	} catch (error) {
		console.error("Error listing stores:", error);
		return { status: 500, data: { ok: false, error: "Failed to list stores" } };
	}
}

export async function getStore(id: string) {
	if (!id)
		return { status: 400, data: { ok: false, error: "Store ID is required" } };

	try {
		const store = await Store.findById(id);
		if (!store)
			return { status: 404, data: { ok: false, error: "Store not found" } };

		return { status: 200, data: { ok: true, data: store } };
	} catch (error) {
		console.error("Error getting store:", error);
		return { status: 500, data: { ok: false, error: "Failed to get store" } };
	}
}

export async function updateStore(id: string, body: any) {
	if (!id)
		return { status: 400, data: { ok: false, error: "Store ID is required" } };

	const { location } = body;
	if (location) {
		return {
			status: 400,
			data: { ok: false, error: "Location cannot be updated" },
		};
	}

	try {
		const store = await Store.findByIdAndUpdate(id, body, { new: true });
		if (!store)
			return { status: 404, data: { ok: false, error: "Store not found" } };

		return { status: 200, data: { ok: true, data: store } };
	} catch (error) {
		console.error("Error updating store:", error);
		return {
			status: 500,
			data: { ok: false, error: "Failed to update store" },
		};
	}
}

export async function deleteStore(id: string) {
	if (!id)
		return { status: 400, data: { ok: false, error: "Store ID is required" } };

	try {
		const store = await Store.findByIdAndDelete(id);
		if (!store)
			return { status: 404, data: { ok: false, error: "Store not found" } };

		return { status: 200, data: { ok: true } };
	} catch (error) {
		console.error("Error deleting store:", error);
		return {
			status: 500,
			data: { ok: false, error: "Failed to delete store" },
		};
	}
}

export async function getStats(query: any) {
	try {
		const { lat, lng, radius = "5000" } = query;
		if ((!lat || !lng) && radius !== "5000") {
			return {
				status: 400,
				data: { ok: false, error: "Radius requires lat and lng" },
			};
		}

		const stages: any[] = [];
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
								$match: { $expr: { $and: [{ $eq: ["$store", "$$storeId"] }] } },
							},
						],
						as: "recentReports",
					},
				},
				{ $match: { "recentReports.0": { $exists: true } } },
				{ $count: "count" },
			])
		);

		return {
			status: 200,
			data: {
				ok: true,
				data: {
					totalStores: totalStores[0]?.count || 0,
					storesWithAvailability: storesWithAvailability[0]?.count || 0,
				},
			},
		};
	} catch (error) {
		console.error("Error getting store stats:", error);
		return {
			status: 500,
			data: { ok: false, error: "Failed to get store stats" },
		};
	}
}
