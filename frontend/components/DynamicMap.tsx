"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PARIS_COORDINATES } from "@/constants";
import { Store } from "@/types/store";
import { useStoreContext } from "@/lib/store-context";

// Fix for default markers
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const size = 34;

function iconHTML(color: string, svg: string, isHovered = false) {
	return `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:${
		isHovered
			? "0 0 0 3px white, 0 0 6px rgba(0,0,0,.7)"
			: "0 0 2px rgba(0,0,0,.5)"
	};">
            ${svg}
          </div>`;
}

const typeConfig: Record<string, { color: string; svg: string }> = {
	supermarket: {
		color: "#3b82f6",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
	},
	convenience: {
		color: "#f59e0b",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>`,
	},
	grocery: {
		color: "#22c55e",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
	},
	organic: {
		color: "#14b8a6",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
	},
};

function getMarkerIcon(type: string, isHovered: boolean = false) {
	const config = typeConfig[type] || typeConfig.supermarket;
	return L.divIcon({
		html: iconHTML(config.color, config.svg, isHovered),
		className: "custom-marker-icon",
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2],
	});
}

export default function DynamicMap({
	stores,
	location,
	radius = 1000,
}: {
	stores: Store[] | null;
	location?: [number, number];
	radius?: number;
}) {
	const mapRef = useRef<L.Map | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const markersRef = useRef<Record<string, L.Marker>>({});
	const popupsRef = useRef<Record<string, L.Popup>>({});
	const circleRef = useRef<L.Circle | null>(null);
	const [isMapReady, setIsMapReady] = useState(false);

	// Get the hovered store from context
	const { hoveredStore, setHoveredStore, setSelectedStore } = useStoreContext();

	// Calculate center
	const center = useMemo(() => {
		if (location && location.length === 2) {
			return [location[0], location[1]] as [number, number];
		}
		return PARIS_COORDINATES as [number, number];
	}, [location]);

	// Initialize map once
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return;

		// Create map instance manually
		const map = L.map(containerRef.current, {
			center: PARIS_COORDINATES as [number, number],
			zoom: 13,
			scrollWheelZoom: true,
			attributionControl: true,
			zoomControl: true,
		});

		// Add tile layer
		L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
			attribution: `&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
		}).addTo(map);

		mapRef.current = map;
		setIsMapReady(true);

		return () => {
			if (mapRef.current) {
				try {
					mapRef.current.remove();
				} catch (e) {
					console.warn("Error removing map:", e);
				}
				mapRef.current = null;
			}
		};
	}, []);

	// Update map view when location changes
	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;
		mapRef.current.setView(center, mapRef.current.getZoom(), { animate: true });
	}, [center, isMapReady]);

	// Update circle when location or radius changes
	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;

		// Remove existing circle
		if (circleRef.current) {
			mapRef.current.removeLayer(circleRef.current);
		}

		// Add new circle
		const circle = L.circle(center, {
			radius,
			color: "#3388ff",
			fillColor: "#3388ff",
			fillOpacity: 0.2,
		}).addTo(mapRef.current);

		circle.bindPopup(`
            <div class="text-sm">
                <p class="font-medium mb-1">${radius / 1000} km Radius</p>
                <p class="text-xs text-muted-foreground">
                    Showing stores within ${radius / 1000} km of your location
                </p>
            </div>
        `);

		circleRef.current = circle;
	}, [center, radius, isMapReady]);

	// Handle hoveredStore changes from context
	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;

		// If we have a hovered store, show its popup and update icon
		if (hoveredStore && markersRef.current[hoveredStore]) {
			const marker = markersRef.current[hoveredStore];
			const popup = popupsRef.current[hoveredStore];

			// Update marker icon
			const store = stores?.find((s) => s._id === hoveredStore);
			if (store) {
				marker.setIcon(
					getMarkerIcon(
						store?.types && store.types.length > 0
							? store.types[0]
							: "supermarket",
						true
					)
				);
			}

			// Open popup
			if (popup && !popup.isOpen()) {
				marker.openPopup();
			}
		} else {
			// Reset all markers to default state
			for (const storeId in markersRef.current) {
				const store = stores?.find((s) => s._id === storeId);
				if (store) {
					markersRef.current[storeId].setIcon(
						getMarkerIcon(
							store?.types && store.types.length > 0
								? store.types[0]
								: "supermarket",
							false
						)
					);
				}
				// Close any open popups
				if (popupsRef.current[storeId] && popupsRef.current[storeId].isOpen()) {
					markersRef.current[storeId].closePopup();
				}
			}
		}
	}, [hoveredStore, stores, isMapReady]);

	// Update markers when stores change
	useEffect(() => {
		if (!mapRef.current || !isMapReady) return;

		// Clear existing markers
		for (const storeId in markersRef.current) {
			mapRef.current.removeLayer(markersRef.current[storeId]);
		}
		markersRef.current = {};
		popupsRef.current = {};

		// Add new markers
		if (stores && stores.length > 0) {
			const newMarkers: Record<string, L.Marker> = {};
			const newPopups: Record<string, L.Popup> = {};
			const markerList: L.Marker[] = [];

			stores.forEach((store) => {
				// Create marker
				const marker = L.marker(
					[store.location.coordinates[1], store.location.coordinates[0]],
					{
						icon: getMarkerIcon(
							store?.types && store.types.length > 0
								? store.types[0]
								: "supermarket",
							hoveredStore === store._id
						),
					}
				).addTo(mapRef.current!);

				// Create popup content
				const popupContent = `
                    <div class="text-sm" style="min-width: 200px;">
                        <p class="font-medium mb-1">${store.name}</p>
                        ${
													store.flavors
														? `<p class="mb-1">Flavors: ${store.flavors.join(
																", "
														  )}</p>`
														: ""
												}
                        ${
													store.distance
														? `<p class="text-xs text-muted-foreground">À ${(
																store.distance / 1000
														  ).toFixed(2)} km</p>`
														: ""
												}
                    </div>
                `;

				const popup = L.popup().setContent(popupContent);
				marker.bindPopup(popup);

				// Add hover and click event handlers
				marker.on("mouseover", () => setHoveredStore(store._id));
				marker.on("mouseout", () => setHoveredStore(null));
				marker.on("click", () => setSelectedStore(store._id));

				// Store the marker and popup
				newMarkers[store._id] = marker;
				newPopups[store._id] = popup;
				markerList.push(marker);
			});

			markersRef.current = newMarkers;
			popupsRef.current = newPopups;

			// Fit bounds to show all markers
			if (markerList.length > 0) {
				const group = new L.FeatureGroup(markerList);
				mapRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
			}
		}
	}, [stores, isMapReady, setHoveredStore]);

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 z-0 rounded-lg"
			style={{ height: "100%", width: "100%" }}
		/>
	);
}
