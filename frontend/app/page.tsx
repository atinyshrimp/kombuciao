"use client";

import { useState, useEffect } from "react";
import { LocateFixed, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import StoreCard, { StoreCardSkeleton } from "@/components/cards/StoreCard";

import { FLAVORS, PARIS_COORDINATES } from "@/constants";
import api from "@/lib/api";
import type { Store } from "@/types/store";

/**
 * Tailwind breakpoints: side panel sticks on md+; slides up on mobile.
 * Placeholder Map uses a grey box. Replace with Mapbox/Leaflet later.
 */
export default function HomePage() {
	const [showMobileList, setShowMobileList] = useState(false);
	const [search, setSearch] = useState("");
	const [radius, setRadius] = useState(5000); // 10 km default
	const [onlyAvailable, setOnlyAvailable] = useState(false);
	const [selectedFlavors, setSelectedFlavors] = useState<Option[]>([]);
	const [location, setLocation] = useState<[number, number]>(
		PARIS_COORDINATES as [number, number]
	);

	return (
		<div className="h-full w-full flex flex-col gap-5 md:flex-row bg-muted text-foreground">
			{/* ───────────────── LEFT PANEL (md+) ───────────────── */}
			<aside className="hidden md:flex md:w-80 lg:w-96 flex-col gap-4 p-4 border-r bg-background overflow-y-auto">
				<Header search={search} setSearch={setSearch} />
				<Filters
					radius={radius}
					setRadius={setRadius}
					onlyAvailable={onlyAvailable}
					setOnlyAvailable={setOnlyAvailable}
					selectedFlavors={selectedFlavors}
					setSelectedFlavors={setSelectedFlavors}
				/>
				<StoreList
					flavors={selectedFlavors.map((f) => f.value)}
					onlyAvailable={onlyAvailable}
					radius={radius}
					location={location}
				/>
			</aside>

			{/* ───────────────── MAP ───────────────── */}
			<section className="flex-1 relative h-full md:h-auto">
				<PlaceholderMap />
				{/* Mobile toggle */}
				<Button
					variant="secondary"
					className="md:hidden cursor-pointer absolute top-4 left-4 z-20 shadow-lg"
					onClick={() => setShowMobileList(true)}
				>
					Stores & Filters
				</Button>
			</section>

			{/* ───────────────── MOBILE DRAWER ───────────────── */}
			<Sheet open={showMobileList} onOpenChange={setShowMobileList}>
				<SheetContent side="bottom" className="p-4 pb-8">
					<SheetHeader>
						<div className="w-full h-1.5 rounded-full bg-muted-foreground/40 mx-auto mb-2" />
					</SheetHeader>
					<Header search={search} setSearch={setSearch} />
					<Filters
						radius={radius}
						setRadius={setRadius}
						onlyAvailable={onlyAvailable}
						setOnlyAvailable={setOnlyAvailable}
						selectedFlavors={selectedFlavors}
						setSelectedFlavors={setSelectedFlavors}
					/>
					<div className="h-[40vh] overflow-y-auto mt-4 pr-2">
						<StoreList
							flavors={selectedFlavors.map((f) => f.value)}
							onlyAvailable={onlyAvailable}
							radius={radius}
							location={location}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}

/* ───────────────── SUB‑COMPONENTS ───────────────── */

function Header({
	search,
	setSearch,
}: {
	search: string;
	setSearch: (v: string) => void;
}) {
	return (
		<div className="relative">
			<Input
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Entrer une adresse ou une ville"
				className="text-sm ps-9 peer"
			/>
			<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
				<SearchIcon size={16} aria-hidden="true" />
			</div>
		</div>
	);
}

interface FiltersProps {
	radius: number;
	setRadius: (v: number) => void;
	onlyAvailable: boolean;
	setOnlyAvailable: (v: boolean) => void;
	selectedFlavors: Option[];
	setSelectedFlavors: (v: Option[]) => void;
}

function Filters({
	radius,
	setRadius,
	onlyAvailable,
	setOnlyAvailable,
	selectedFlavors,
	setSelectedFlavors,
}: FiltersProps) {
	const [currentRadius, setCurrentRadius] = useState(radius);

	return (
		<Card className="p-4 space-y-4 bg-card">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">
					Afficher uniquement les magasins
					<br />
					avec des produits disponibles
				</span>
				<Switch
					className="cursor-pointer"
					checked={onlyAvailable}
					onCheckedChange={setOnlyAvailable}
				/>
			</div>

			<div>
				<label className="text-sm font-medium">
					Rayon : {currentRadius / 1000} km
				</label>
				<Slider
					min={500}
					max={30000}
					step={500}
					value={[currentRadius]}
					onValueChange={(v) => setCurrentRadius(v[0])}
					onValueCommit={(v) => setRadius(v[0])}
				/>
			</div>

			<div>
				<label className="text-sm font-medium">Saveurs</label>
				<div className="flex flex-wrap gap-2 mt-2">
					<MultipleSelector
						options={Object.entries(FLAVORS).map(([key, label]) => ({
							value: key,
							label,
						}))}
						value={selectedFlavors}
						onChange={setSelectedFlavors}
						placeholder="Sélectionner des saveurs"
						className="w-full"
						hidePlaceholderWhenSelected
					/>
				</div>
			</div>
		</Card>
	);
}

function StoreList({
	location,
	flavors,
	onlyAvailable,
	radius,
}: {
	location?: [number, number]; // [longitude, latitude]
	flavors?: string[] | null;
	onlyAvailable?: boolean;
	radius?: number;
}) {
	const [stores, setStores] = useState<Store[] | null>(null);
	const [loading, setLoading] = useState(true);

	async function fetchStores() {
		setLoading(true);
		try {
			let queryParams = new URLSearchParams();
			if (flavors)
				for (const flavor of flavors) {
					queryParams.append("flavor", flavor);
				}
			if (onlyAvailable) queryParams.append("onlyAvailable", "true");
			if (location) {
				queryParams.append("lng", location[0].toString());
				queryParams.append("lat", location[1].toString());
			}
			if (radius) queryParams.append("radius", radius.toString());

			const { ok, data, error } = await api.get(
				`/stores?${queryParams.toString()}`
			);
			if (!ok) throw new Error(error);
			setStores(data as Store[]);
		} catch (error) {
			if (error === "No stores with recent availability") setStores([]);
			console.error("Error fetching stores:", error);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		fetchStores();
	}, [location, flavors, onlyAvailable, radius]);

	// placeholder skeleton list
	const dummy = new Array(6).fill(0);

	if (loading) {
		return (
			<div className="space-y-3">
				{dummy.map((_, i) => (
					<StoreCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{(!stores || !stores.length) && (
				<Card className="p-4 text-center">
					<p className="text-sm text-muted-foreground">
						No stores found in this area.
					</p>
				</Card>
			)}
			{stores &&
				stores.map((store, i) => (
					<StoreCard key={store._id || i} store={store} />
				))}
		</div>
	);
}

function PlaceholderMap() {
	return (
		<div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900/90 rounded-lg animate-pulse" />
	);
}
