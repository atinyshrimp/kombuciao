import React from "react";
import { ShoppingCart, Clock, Apple, Leaf } from "lucide-react";

import { Store } from "@/types/store";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getAllowedTypes } from "@/lib/utils";
import { FLAVORS } from "@/constants";
import { Skeleton } from "../ui/skeleton";
import { useStoreContext } from "@/lib/store-context";

const StoreIcon = ({ type = "supermarket" }: { type: string }) => {
	const SIZE = 18; // Default size for icons

	switch (type) {
		case "grocery":
			return <Apple size={SIZE} />;
		case "convenience":
			return <Clock size={SIZE} />;
		case "organic":
			return <Leaf size={SIZE} />;
		default:
			return <ShoppingCart size={SIZE} />;
	}
};

const StoreCardSkeleton = () => {
	return (
		<Card className="p-4 flex items-start gap-3 cursor-pointer hover:bg-accent">
			<CardContent className="p-0 flex flex-1 gap-4 w-full">
				<Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
				<div className="flex flex-col flex-1 gap-2">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
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
				"p-4 flex items-start gap-3 cursor-pointer transition-colors",
				isHovered ? "bg-accent/80" : "hover:bg-accent"
			)}
			onMouseEnter={() => setHoveredStore(store._id)}
			onMouseLeave={() => setHoveredStore(null)}
			onClick={() => setSelectedStore(store._id)}>
			<CardContent className="p-0 flex flex-1 gap-4">
				<div className="w-9 h-9 rounded-full flex-shrink-0 bg-muted flex items-center justify-center text-xs font-bold">
					<StoreIcon type={getAllowedTypes(store.types)} />
				</div>
				<div
					className={cn(
						"flex flex-col",
						store.flavors?.length === 0 ? "justify-center" : ""
					)}>
					<p className="text-sm font-medium">
						{store.name}
						<span className="text-xs text-muted-foreground font-normal">
							{" "}
							• {(store.distance! / 1000).toFixed(1)} km
						</span>
					</p>
					{store.address.street && (
						<p className="text-xs text-muted-foreground line-clamp-1">
							{store.address.street}, {store.address.city}
						</p>
					)}
					{store.flavors && store.flavors.length > 0 && (
						<div className="flex flex-wrap mt-1 -space-x-1">
							{store.flavors.map((flavor) => {
								const label = FLAVORS[flavor as keyof typeof FLAVORS];
								if (!label) return null; // Skip if flavor not found
								const icon = label.split(" ")[0];
								return (
									<span
										key={flavor}
										className="text-xs bg-secondary p-1 rounded-full ring-1 ring-primary/20 cursor-default">
										{icon}
									</span>
								);
							})}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default StoreCard;
export { StoreCard, StoreCardSkeleton };
