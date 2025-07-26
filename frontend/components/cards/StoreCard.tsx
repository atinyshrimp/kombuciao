import React from "react";
import { ShoppingCart, Clock, Apple, Leaf, MapPin } from "lucide-react";

import { Store } from "@/types/store";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber, getAllowedTypes } from "@/lib/utils";
import { FLAVORS } from "@/constants";
import { Skeleton } from "../ui/skeleton";
import { useStoreContext } from "@/lib/store-context";

const StoreIcon = ({ type = "supermarket" }: { type: string }) => {
	const SIZE = 20; // Slightly larger icons

	switch (type) {
		case "grocery":
			return <Apple size={SIZE} className="text-emerald-600" />;
		case "convenience":
			return <Clock size={SIZE} className="text-blue-600" />;
		case "organic":
			return <Leaf size={SIZE} className="text-green-600" />;
		default:
			return <ShoppingCart size={SIZE} className="text-slate-600" />;
	}
};

const StoreCardSkeleton = () => {
	return (
		<Card className="p-4 bg-white/60 backdrop-blur-sm border-slate-200/60 dark:bg-slate-900/60 dark:border-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-200">
			<CardContent className="p-0 flex gap-4 w-full">
				<Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
				<div className="flex flex-col flex-1 gap-3">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
					<div className="flex gap-1">
						<Skeleton className="h-6 w-8 rounded-full" />
						<Skeleton className="h-6 w-8 rounded-full" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const StoreCard = ({ store }: { store: Store }) => {
	const { hoveredStore, setHoveredStore, setSelectedStore } = useStoreContext();
	const isHovered = hoveredStore === store._id;

	return (
		<Card
			className={cn(
				"p-4 cursor-pointer transition-all duration-200 group",
				"bg-white/60 backdrop-blur-sm border-slate-200/60 dark:bg-slate-900/60 dark:border-slate-800/60",
				"hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-lg",
				isHovered &&
					"bg-white/90 dark:bg-slate-900/90 shadow-lg border-slate-300/60 dark:border-slate-700/60"
			)}
			onMouseEnter={() => setHoveredStore(store._id)}
			onMouseLeave={() => setHoveredStore(null)}
			onClick={() => setSelectedStore(store._id)}>
			<CardContent className="p-0 flex gap-4">
				{/* Store Icon */}
				<div className="w-12 h-12 rounded-xl flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
					<StoreIcon type={getAllowedTypes(store.types)} />
				</div>

				{/* Store Info */}
				<div className="flex flex-col flex-1 min-w-0">
					{/* Store Name and Distance */}
					<div className="flex items-start justify-between gap-2 mb-2">
						<h3 className="lg:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
							{store.name || "Sans nom"}
						</h3>
						<div className="flex items-center gap-1 text-sm lg:text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-2 py-1 rounded-full">
							<MapPin className="w-3 h-3" />
							<span className="font-medium">
								{formatNumber(store.distance! / 1000)} km
							</span>
						</div>
					</div>
					{/* Address */}
					{store.address.street && (
						<p className="text-sm lg:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
							{store.address.street}, {store.address.city}
						</p>
					)}
					{/* Flavors */}
					{store.flavors && store.flavors.length > 0 && (
						<div className="flex flex-wrap gap-1.5">
							{store.flavors.map((flavor) => {
								const label = FLAVORS[flavor as keyof typeof FLAVORS];
								if (!label) return null; // Skip if flavor not found
								const icon = label.split(" ")[0];
								return (
									<span
										key={flavor}
										className="text-sm lg:text-xs bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 font-medium shadow-sm">
										{icon}
									</span>
								);
							})}
						</div>
					)}{" "}
				</div>
			</CardContent>
		</Card>
	);
};

export default StoreCard;
export { StoreCard, StoreCardSkeleton };
