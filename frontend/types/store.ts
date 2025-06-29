export type Flavor =
	| "peche"
	| "citron"
	| "fruits_rouges"
	| "dragon"
	| "menthe"
	| "gingembre_hibiscus";

export interface Store {
	_id: string;
	name: string;
	address: {
		street: string;
		postCode: string;
		city: string;
	};
	location: {
		type: "Point";
		coordinates: [number, number]; // [longitude, latitude]
	};
	flavors: Flavor[];
	createdAt: string;
	updatedAt: string;
	distance?: number; // Distance in meters, optional for search results
	__v: number;
}
