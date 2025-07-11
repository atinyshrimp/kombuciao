"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface StoreContextType {
	hoveredStore: string | null;
	setHoveredStore: (id: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
	const [hoveredStore, setHoveredStore] = useState<string | null>(null);

	return (
		<StoreContext.Provider value={{ hoveredStore, setHoveredStore }}>
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
