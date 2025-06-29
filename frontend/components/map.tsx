"use client";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";
import { PARIS_COORDINATES } from "@/constants";
import { Store } from "@/types/store";
import { get } from "http";

// ---------- custom circular DivIcon factory ----------
const size = 34; // px diameter

function iconHTML(color: string, svg: string) {
	return `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 2px rgba(0,0,0,.5);">
            ${svg}
          </div>`;
}

function svgString(IconComponent: any) {
	// render icon into svg string (lucide provides .toString())
	return IconComponent({ size: 18, color: "white" }).toString();
}

const typeConfig: Record<string, { color: string; svg: string }> = {
	supermarket: {
		color: "#3b82f6",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
	},
	convenience: {
		color: "#f59e0b",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>`,
	},
	grocery: {
		color: "#22c55e",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple-icon lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
	},
	organic: {
		color: "#14b8a6",
		svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf-icon lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
	},
};

function getMarkerIcon(type: string = "grocery") {
	const cfg = typeConfig[type] || typeConfig["grocery"]; // default to supermarket if type not found
	return new L.DivIcon({
		html: iconHTML(cfg.color, cfg.svg),
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2],
		className: "marker-no-default",
	});
}

export default function StoreMap({
	stores,
	radius = 5000,
}: {
	stores: Store[] | null;
	radius?: number;
}) {
	if (!stores || stores.length === 0) {
		return (
			<div className="flex items-center justify-center h-full text-muted-foreground">
				No stores found
			</div>
		);
	}

	// default center = Paris
	const center = useMemo(() => {
		if (stores && stores.length && stores[0].location?.coordinates) {
			return [
				stores[0].location.coordinates[1],
				stores[0].location.coordinates[0],
			];
		}
		return PARIS_COORDINATES as L.LatLngExpression;
	}, [stores]);

	return (
		<MapContainer
			center={center as L.LatLngExpression}
			bounds={L.latLngBounds(
				stores.map((store) => [
					store.location.coordinates[1],
					store.location.coordinates[0],
				])
			)}
			className="absolute inset-0 z-0"
			scrollWheelZoom
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
				attribution={`&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
			/>

			<Circle
				center={center as L.LatLngExpression}
				radius={radius} // 5 km radius
				pathOptions={{
					color: "#3388ff",
					fillColor: "#3388ff",
					fillOpacity: 0.2,
				}}
			>
				<Popup className="text-sm">
					<p className="font-medium mb-1">{radius / 1000} km Radius</p>
					<p className="text-xs text-muted-foreground">
						Showing stores within {radius / 1000} km of your location
					</p>
				</Popup>
			</Circle>

			{stores.map((store) => (
				<Marker
					key={store._id}
					position={
						[
							store.location.coordinates[1],
							store.location.coordinates[0],
						] as L.LatLngExpression
					}
					icon={getMarkerIcon(
						store?.types && store.types.length > 0 ? store.types[0] : ""
					)} // use first type for icon
				>
					<Popup minWidth={200} className="text-sm">
						<p className="font-medium mb-1">{store.name}</p>
						{store.flavors && (
							<p className="mb-1">Flavors: {store.flavors.join(", ")}</p>
						)}
						{store.distance && (
							<p className="text-xs text-muted-foreground">
								À {(store.distance / 1000).toFixed(2)} km
							</p>
						)}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
