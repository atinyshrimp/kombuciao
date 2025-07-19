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
		postCode?: string;
		city: string;
	};
	location: {
		type: "Point";
		coordinates: [number, number]; // [longitude, latitude]
	};
	flavors: Flavor[];
	openingHours?: string; // e.g., "Mon-Fri 9-18"
	createdAt: string;
	updatedAt: string;
	distance?: number; // Distance in meters, optional for search results
	types: string[];
	osmId: string; // e.g., "node/2659184738"
	__v: number;
}

export interface SearchResult {
	geometry: {
		coordinates: [number, number];
	};
	properties: {
		name: string;
		postcode: string;
		city: string;
		osm_id: number;
		housenumber: string;
		street: string;
	};
}

export interface Vote {
	_id: string;
	voterId: string;
	type: "confirm" | "deny";
	createdAt: string;
}

export interface Report {
	_id: string;
	store: Store;
	flavors: Flavor[];
	description: string;
	votes: Vote[];
	createdAt: string;
	updatedAt: string;
}
