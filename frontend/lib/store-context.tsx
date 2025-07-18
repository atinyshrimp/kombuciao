"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface StoreContextType {
	hoveredStore: string | null;
	setHoveredStore: (id: string | null) => void;
	selectedStore: string | null;
	setSelectedStore: (id: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
	const [hoveredStore, setHoveredStore] = useState<string | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	// Use state to prevent selectedStore from being reset by URL updates
	const [selectedStore, setSelectedStoreState] = useState<string | null>(
		searchParams.get("storeId")
	);

	// Initialize selectedStore from URL on first render only
	useEffect(() => {
		const storeIdFromUrl = searchParams.get("storeId");
		if (storeIdFromUrl) {
			setSelectedStoreState(storeIdFromUrl);
		}
	}, []); // Empty dependency array means this runs once on mount

	// Update URL when store is selected/deselected
	const setSelectedStore = (id: string | null) => {
		setSelectedStoreState(id); // Update state first

		// Then update URL
		const params = new URLSearchParams(searchParams);

		if (id) params.set("storeId", id);
		else params.delete("storeId");

		// Update URL without refreshing the page
		router.push(`?${params.toString()}`, { scroll: false });
	};

	return (
		<StoreContext.Provider
			value={{
				hoveredStore,
				setHoveredStore,
				selectedStore,
				setSelectedStore,
			}}>
			{children}
		</StoreContext.Provider>
	);
}

export function useStoreContext() {
	const context = useContext(StoreContext);
	if (context === undefined) {
		throw new Error("useStoreContext must be used within a StoreProvider");
	}
	return context;
}
