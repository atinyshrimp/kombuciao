"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchIcon, MapPin, Filter, List } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Option } from "@/components/ui/multiselect";
import StoreCard, { StoreCardSkeleton } from "@/components/cards/StoreCard";

import { FLAVORS, PARIS_COORDINATES } from "@/constants";
import api from "@/app/api";
import type { Store, SearchResult } from "@/types/store";
import StorePagination from "@/components/features/StorePagination";
import { StoreProvider } from "@/lib/store-context";
import StoreDetailSheet from "@/components/features/StoreDetailSheet";
import FlavorSelector from "@/components/features/FlavorSelector";
import StoreMap from "@/components/map";
import { formatNumber } from "@/lib/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatsCardMobile } from "@/components/cards/StatsCard";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

export default function HomePage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Initialize state from URL params or defaults
	const [showMobileList, setShowMobileList] = useState(false);
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [radius, setRadius] = useState(
		parseInt(searchParams.get("radius") || "1000")
	);
	const [onlyAvailable, setOnlyAvailable] = useState(
		searchParams.get("onlyAvailable") === "true"
	);
	const [selectedFlavors, setSelectedFlavors] = useState<Option[]>(() => {
		const flavors = searchParams.getAll("flavor");
		return flavors.map((flavor) => ({
			value: flavor,
			label: FLAVORS[flavor as keyof typeof FLAVORS] || flavor,
		}));
	});
	const [location, setLocation] = useState<[number, number]>(() => {
		const lng = searchParams.get("lng") || PARIS_COORDINATES[1].toString();
		const lat = searchParams.get("lat") || PARIS_COORDINATES[0].toString();
		return [parseFloat(lng), parseFloat(lat)];
	});
	const [stores, setStores] = useState<Store[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(
		parseInt(searchParams.get("page") || "1")
	);
	const [totalPages, setTotalPages] = useState(1);

	// Function to update URL with current filter state
	const updateURL = (
		newParams: Record<string, string | string[] | number | boolean>
	) => {
		const params = new URLSearchParams();

		// Add current params
		Object.entries(newParams).forEach(([key, value]) => {
			if (value === null || value === undefined || value === "") return;

			if (Array.isArray(value)) {
				value.forEach((v) => params.append(key, v.toString()));
			} else if (typeof value === "boolean") {
				if (value) params.set(key, "true");
			} else {
				params.set(key, value.toString());
			}
		});

		// Update URL without triggering navigation
		const newURL = `${window.location.pathname}?${params.toString()}`;
		router.replace(newURL, { scroll: false });
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Update URL whenever filters change
	useEffect(() => {
		const urlParams: Record<string, string | string[] | number | boolean> = {
			page: currentPage,
		};

		if (radius !== 1000) urlParams.radius = radius;
		if (onlyAvailable) urlParams.onlyAvailable = true;
		if (selectedFlavors.length > 0)
			urlParams.flavor = selectedFlavors.map((f) => f.value);
		if (
			location[0] !== PARIS_COORDINATES[0] ||
			location[1] !== PARIS_COORDINATES[1]
		) {
			urlParams.lng = location[0];
			urlParams.lat = location[1];
		}
		if (searchParams.get("storeId"))
			urlParams.storeId = searchParams.get("storeId")!;

		updateURL(urlParams);
		fetchStores();
	}, [currentPage, radius, onlyAvailable, selectedFlavors, location]);

	useEffect(() => {
		setCurrentPage(1);
	}, [radius, onlyAvailable, selectedFlavors, location]);

	async function fetchStores() {
		setLoading(true);
		try {
			const queryParams = new URLSearchParams();
			queryParams.append("page", currentPage.toString());
			if (selectedFlavors)
				for (const flavor of selectedFlavors) {
					queryParams.append("flavor", flavor.value);
				}
			if (onlyAvailable) queryParams.append("onlyAvailable", "true");
			if (location) {
				queryParams.append("lng", location[1].toString());
				queryParams.append("lat", location[0].toString());
			}
			if (radius) queryParams.append("radius", radius.toString());

			const { ok, data, total, error } = await api.get(
				`/stores?${queryParams.toString()}`
			);
			if (!ok) throw new Error(error);

			setTotalPages(Math.ceil(total! / 10)); // Assuming 6 stores per page
			setStores(data as Store[]);
		} catch (error) {
			if (error === "No stores with recent availability") setStores([]);
			console.error("Error fetching stores:", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<StoreProvider>
			<div className="h-[calc(100vh-8rem)] w-full flex flex-col gap-6 lg:flex-row text-foreground">
				{/* ───────────────── LEFT PANEL (lg+) ───────────────── */}
				<aside className="hidden lg:flex lg:w-96 xl:w-[420px] flex-col gap-2 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-xl dark:bg-slate-900/60 dark:border-slate-800/60">
					<Header
						search={search}
						setSearch={setSearch}
						setLocation={setLocation}
					/>
					<Filters
						radius={radius}
						setRadius={setRadius}
						onlyAvailable={onlyAvailable}
						setOnlyAvailable={setOnlyAvailable}
						selectedFlavors={selectedFlavors}
						setSelectedFlavors={setSelectedFlavors}
					/>
					<div className="flex flex-col gap-2 overflow-y-auto">
						<StoreList stores={stores} loading={loading} />
						<StorePagination
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
						/>
					</div>
				</aside>

				{/* ───────────────── MAP ───────────────── */}
				<section className="flex-1 relative h-full lg:h-auto bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-xl dark:bg-slate-900/40 dark:border-slate-800/60 overflow-hidden">
					<StoreMap
						key={`storemap-${location?.[0]}-${location?.[1]}`}
						stores={stores}
						radius={radius}
						location={location}
					/>

					{/* Mobile toggle */}
					<Button
						variant="secondary"
						className="lg:hidden absolute top-4 right-4 z-20 shadow-lg bg-white/90 backdrop-blur-sm border border-slate-200/60 hover:bg-white dark:bg-slate-900/90 dark:border-slate-800/60 dark:hover:bg-slate-900"
						onClick={() => setShowMobileList(true)}>
						<List className="w-4 h-4 mr-2" />
						Magasins & Filtres
					</Button>
				</section>

				{/* ───────────────── MOBILE DRAWER ───────────────── */}
				<Drawer
					open={showMobileList}
					onOpenChange={setShowMobileList}
					repositionInputs={false}>
					<DrawerContent>
						<DrawerHeader className="px-4 py-2 mb-4 border-b border-slate-200/60 dark:border-slate-800/60">
							<DrawerTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
								Recherche & Filtres
							</DrawerTitle>
						</DrawerHeader>

						{/* Scrollable Content */}
						<div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 lg:text-sm">
							{/* Location Search */}
							<Header
								search={search}
								setSearch={setSearch}
								setLocation={setLocation}
							/>

							{/* Stats Card - Mobile Version */}
							{stores && stores.length > 0 && (
								<StatsCardMobile
									stores={stores}
									center={location}
									radius={radius}
								/>
							)}

							{/* Filters - collapsed on mobile by default */}
							<FiltersMobile
								radius={radius}
								setRadius={setRadius}
								onlyAvailable={onlyAvailable}
								setOnlyAvailable={setOnlyAvailable}
								selectedFlavors={selectedFlavors}
								setSelectedFlavors={setSelectedFlavors}
							/>

							{/* Store List */}
							<div className="space-y-4">
								<StoreList stores={stores} loading={loading} />
								<StorePagination
									currentPage={currentPage}
									setCurrentPage={setCurrentPage}
									totalPages={totalPages}
								/>
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>

			<StoreDetailSheet fetchStores={fetchStores} />
		</StoreProvider>
	);
}

/* ───────────────── SUB‑COMPONENTS ───────────────── */

function Header({
	search,
	setSearch,
	setLocation,
}: {
	search: string;
	setSearch: (v: string) => void;
	setLocation: (v: [number, number]) => void;
}) {
	const [results, setResults] = useState([]);
	const [searching, setSearching] = useState(false);

	async function fetchSearchResults(query: string) {
		if (!query) {
			setSearch("");
			return;
		}
		try {
			const response = await fetch(
				`https://photon.komoot.io/api?q=${encodeURIComponent(
					query
				)}&lang=fr&limit=5`,
				{
					mode: "cors",
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);
			if (!response.ok) throw new Error("Failed to fetch search results");
			const data = await response.json();
			if (!data.features || !Array.isArray(data.features))
				throw new Error("Invalid search results format");
			setResults(data.features);
		} catch (error) {
			console.error("Error fetching search results:", error);
		}
	}

	useEffect(() => {
		if (search && searching) {
			const timeoutId = setTimeout(() => fetchSearchResults(search), 2500);
			return () => clearTimeout(timeoutId); // Cleanup on unmount or search change
		} else setResults([]); // Clear results if search is empty
	}, [search]);

	function handleResultClick(result: SearchResult) {
		const location = result.geometry.coordinates;
		console.log("Selected location:", result.properties.name, location);
		setLocation([location[1], location[0]] as [number, number]); // Set location in [lat, lng] format
		setSearching(false);
		setSearch(result.properties.name);
		setResults([]); // Clear results after selection
	}

	return (
		<div className="space-y-2">
			<h3 className="lg:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
				<SearchIcon className="w-4 h-4" />
				Localisation
			</h3>
			<div className="relative">
				<Input
					value={search}
					onFocus={() => setSearching(true)}
					onBlur={() => setSearching(false)}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Entrer une adresse ou une ville"
					className="lg:text-sm ps-10 peer bg-white/80 backdrop-blur-sm border-slate-200/60 focus:border-slate-400 dark:bg-slate-800/80 dark:border-slate-700/60 dark:focus:border-slate-500"
				/>
				<div className="text-slate-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					<MapPin size={16} aria-hidden="true" />
				</div>
				{results.length > 0 && (
					<div className="absolute z-50 w-full top-full mt-2 bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-xl max-h-60 overflow-y-auto dark:bg-slate-900/95 dark:border-slate-800/60">
						{results.map((result: SearchResult, index) => (
							<div
								key={result.properties.osm_id || index}
								className="flex flex-col px-4 py-3 lg:text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100/60 dark:border-slate-800/60 last:border-b-0 transition-colors"
								onClick={() => handleResultClick(result)}>
								<SearchResult result={result} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

const SearchResult = ({ result }: { result: SearchResult }) => {
	let mainText = result.properties.name;
	const subText = `${result.properties.postcode} ${result.properties.city}`;
	if (result.properties.housenumber) {
		mainText = `${result.properties.housenumber} ${result.properties.street}`;
	}

	return (
		<div className="flex flex-col">
			<p className="font-medium text-slate-900 dark:text-slate-100">
				{mainText}
			</p>
			<p className="text-sm lg:text-xs text-slate-500 dark:text-slate-400">
				{subText}
			</p>
		</div>
	);
};

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
		<Card className="p-6 bg-white/60 backdrop-blur-sm border-slate-200/60 dark:bg-slate-900/60 dark:border-slate-800/60 shadow-sm z-10">
			<Collapsible>
				<CollapsibleTrigger className="w-full flex items-center gap-2 cursor-pointer">
					<Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
					<h3 className="lg:text-sm font-semibold text-slate-900 dark:text-slate-100">
						Filtres
					</h3>
				</CollapsibleTrigger>

				<CollapsibleContent className="space-y-6 mt-2">
					{/* Availability Filter */}
					<div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
						<div className="flex-1">
							<span className="lg:text-sm font-medium text-slate-900 dark:text-slate-100">
								Produits disponibles uniquement
							</span>
							<p className="text-sm lg:text-xs text-slate-500 dark:text-slate-400 mt-1">
								Afficher seulement les magasins avec stock
							</p>
						</div>
						<Switch
							className="cursor-pointer"
							checked={onlyAvailable}
							onCheckedChange={setOnlyAvailable}
						/>
					</div>

					{/* Radius Filter */}
					<div className="space-y-3">
						<label className="lg:text-sm font-medium text-slate-900 dark:text-slate-100">
							Rayon de recherche: {formatNumber(currentRadius / 1000)} km
						</label>
						<div className="px-2">
							<Slider
								min={100}
								max={5000}
								step={100}
								value={[currentRadius]}
								onValueChange={(v) => setCurrentRadius(v[0])}
								onValueCommit={(v) => setRadius(v[0])}
								className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-400 [&_[role=slider]]:to-teal-500"
							/>
						</div>
						<div className="flex justify-between text-sm lg:text-xs text-slate-500 dark:text-slate-400">
							<span>100m</span>
							<span>5km</span>
						</div>
					</div>

					{/* Flavors Filter */}
					<div className="space-y-3">
						<label className="lg:text-sm font-medium text-slate-900 dark:text-slate-100">
							Saveurs préférées
						</label>
						<FlavorSelector
							selectedFlavors={selectedFlavors}
							setSelectedFlavors={setSelectedFlavors}
						/>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}

function FiltersMobile({
	radius,
	setRadius,
	onlyAvailable,
	setOnlyAvailable,
	selectedFlavors,
	setSelectedFlavors,
}: FiltersProps) {
	const [currentRadius, setCurrentRadius] = useState(radius);

	return (
		<Card className="p-4 bg-white/70 dark:bg-slate-900/70 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
			<Collapsible defaultOpen={false}>
				<CollapsibleTrigger className="w-full flex items-center gap-2 text-left">
					<Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
					<span className="font-medium text-slate-900 dark:text-slate-100">
						Filtres de recherche
					</span>
				</CollapsibleTrigger>

				<CollapsibleContent className="space-y-4 mt-4">
					{/* Only Available */}
					<div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-800/50 p-3 rounded-lg">
						<div>
							<p className="font-medium text-slate-900 dark:text-slate-100">
								Produits disponibles uniquement
							</p>
							<p className="text-sm lg:text-xs text-slate-500 dark:text-slate-400">
								Afficher seulement les magasins avec stock
							</p>
						</div>
						<Switch
							className="ml-2"
							checked={onlyAvailable}
							onCheckedChange={setOnlyAvailable}
						/>
					</div>

					{/* Radius */}
					<div className="space-y-2">
						<label className="block font-medium">
							Rayon de recherche : {formatNumber(currentRadius / 1000)} km
						</label>
						<Slider
							min={100}
							max={5000}
							step={100}
							value={[currentRadius]}
							onValueChange={(v) => setCurrentRadius(v[0])}
							onValueCommit={(v) => setRadius(v[0])}
							className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-400 [&_[role=slider]]:to-teal-500"
						/>
						<div className="flex justify-between text-sm lg:text-xs text-slate-500 dark:text-slate-400">
							<span>100m</span>
							<span>5km</span>
						</div>
					</div>

					{/* Flavors */}
					<div className="space-y-1">
						<label className="block font-medium">Saveurs préférées</label>
						<div className="relative z-[60]">
							{" "}
							{/* fix dropdown overlapping issue */}
							<FlavorSelector
								selectedFlavors={selectedFlavors}
								setSelectedFlavors={setSelectedFlavors}
							/>
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}

function StoreList({
	stores,
	loading,
}: {
	stores: Store[] | null;
	loading: boolean;
}) {
	// placeholder skeleton list
	const dummy = new Array(5).fill(0);

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
		<div className="space-y-3 overflow-y-auto">
			{(!stores || !stores.length) && (
				<Card className="p-8 text-center bg-white/60 backdrop-blur-sm border-slate-200/60 dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="space-y-3">
						<div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
							<MapPin className="w-8 h-8 text-slate-400" />
						</div>
						<div>
							<p className="lg:text-sm font-medium text-slate-900 dark:text-slate-100">
								Aucun magasin trouvé
							</p>
							<p className="text-sm lg:text-xs text-slate-500 dark:text-slate-400 mt-1">
								Essayez d&apos;élargir votre recherche ou changer de
								localisation
							</p>
						</div>
					</div>
				</Card>
			)}
			{stores &&
				stores.map((store, i) => (
					<StoreCard key={store._id || i} store={store} />
				))}
		</div>
	);
}
