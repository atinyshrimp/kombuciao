"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Option } from "@/components/ui/multiselect";
import StoreCard, { StoreCardSkeleton } from "@/components/cards/StoreCard";

import { FLAVORS, PARIS_COORDINATES } from "@/constants";
import api from "@/lib/api";
import type { Store, SearchResult } from "@/types/store";
import StorePagination from "@/components/features/StorePagination";
import { StoreProvider } from "@/lib/store-context";
import StoreDetailSheet from "@/components/StoreDetailSheet";
import FlavorSelector from "@/components/features/FlavorSelector";

const StoreMap = dynamic(() => import("@/components/map"), {
	loading: () => <PlaceholderMap />,
	ssr: false,
});

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

	// Update URL whenever filters change
	useEffect(() => {
		const urlParams: Record<string, string | string[] | number | boolean> = {
			page: currentPage,
		};

		if (radius !== 1000) urlParams.radius = radius;
		if (onlyAvailable) urlParams.onlyAvailable = true;
		if (selectedFlavors.length > 0) {
			urlParams.flavor = selectedFlavors.map((f) => f.value);
		}
		if (
			location[0] !== PARIS_COORDINATES[0] ||
			location[1] !== PARIS_COORDINATES[1]
		) {
			urlParams.lng = location[0];
			urlParams.lat = location[1];
		}

		console.log("Updating URL with params:", urlParams);
		updateURL(urlParams);
		setCurrentPage(1); // Reset to first page on filter change
	}, [currentPage, radius, onlyAvailable, selectedFlavors, location]);

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

	useEffect(() => {
		fetchStores();
	}, [currentPage, location, selectedFlavors, onlyAvailable, radius]);

	return (
		<StoreProvider>
			<div className="h-full w-full flex flex-col gap-5 md:flex-row text-foreground">
				{/* ───────────────── LEFT PANEL (md+) ───────────────── */}
				<aside className="hidden md:flex md:w-80 lg:w-96 flex-col gap-4 p-4 bg-background max-h-full">
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
					<StoreList stores={stores} loading={loading} />
					<StorePagination
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
					/>
				</aside>

				{/* ───────────────── MAP ───────────────── */}
				<section className="flex-1 relative h-full md:h-auto">
					<StoreMap
						key={`storemap-${location?.[0]}-${location?.[1]}`}
						stores={stores}
						radius={radius}
						location={location}
					/>
					{/* Mobile toggle */}
					<Button
						variant="secondary"
						className="md:hidden cursor-pointer absolute top-4 left-4 z-20 shadow-lg"
						onClick={() => setShowMobileList(true)}>
						Stores & Filters
					</Button>
				</section>

				{/* ───────────────── MOBILE DRAWER ───────────────── */}
				<Sheet open={showMobileList} onOpenChange={setShowMobileList}>
					<SheetContent side="bottom" className="p-4 pb-8">
						<SheetHeader>
							<div className="w-full h-1.5 rounded-full bg-muted-foreground/40 mx-auto mb-2" />
						</SheetHeader>
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
						<div className="h-[40vh] overflow-y-auto mt-4 pr-2">
							<StoreList stores={stores} loading={loading} />
							<StorePagination
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								totalPages={totalPages}
							/>
						</div>
					</SheetContent>
				</Sheet>
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
		<div className="relative">
			<Input
				value={search}
				onFocus={() => setSearching(true)}
				onBlur={() => setSearching(false)}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Entrer une adresse ou une ville"
				className="text-sm ps-9 peer"
			/>
			<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
				<SearchIcon size={16} aria-hidden="true" />
			</div>
			{results.length > 0 && (
				<div className="absolute z-50 w-full top-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
					{results.map((result: SearchResult, index) => (
						<div
							key={result.properties.osm_id || index}
							className="flex flex-col px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0"
							onClick={() => handleResultClick(result)}>
							<SearchResult result={result} />
						</div>
					))}
				</div>
			)}
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
			<p className="font-medium">{mainText}</p>
			<p className="text-xs text-muted-foreground">{subText}</p>
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
					min={100}
					max={5000}
					step={100}
					value={[currentRadius]}
					onValueChange={(v) => setCurrentRadius(v[0])}
					onValueCommit={(v) => setRadius(v[0])}
				/>
			</div>

			<div>
				<label className="text-sm font-medium">Saveurs</label>
				<FlavorSelector
					selectedFlavors={selectedFlavors}
					setSelectedFlavors={setSelectedFlavors}
				/>
			</div>
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
			<div className="space-y-3 h-full">
				{dummy.map((_, i) => (
					<StoreCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-3 h-full overflow-y-auto">
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
