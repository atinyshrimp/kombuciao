"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { PARIS_COORDINATES } from "@/constants";
import { Store } from "@/types/store";
import StatsCard from "./cards/StatsCard";

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import("./DynamicMap"), {
	ssr: false,
	loading: () => <PlaceholderMap />,
});

export default function StoreMap({
	stores,
	location,
	radius = 1000,
}: {
	stores: Store[] | null;
	location?: [number, number];
	radius?: number;
}) {
	// Calculate center
	const center = useMemo(() => {
		if (location && location.length === 2) {
			return [location[0], location[1]] as [number, number];
		}
		return PARIS_COORDINATES as [number, number];
	}, [location]);

	return (
		<div className="relative w-full h-full">
			<StatsCard stores={stores || []} center={center} radius={radius} />
			<MapComponent stores={stores} location={location} radius={radius} />
		</div>
	);
}

function PlaceholderMap() {
	return (
		<div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900/90 rounded-lg animate-pulse" />
	);
}

export { PlaceholderMap };
