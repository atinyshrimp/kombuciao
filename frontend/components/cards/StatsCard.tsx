import React from "react";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import API from "@/lib/api";
import { Store } from "@/types/store";

const StatsCard = ({
	stores,
	center,
	radius,
}: {
	stores: Store[];
	center: [number, number];
	radius: number;
}) => {
	const [stats, setStats] = useState<{ total: number; withKombucha: number }>({
		total: 0,
		withKombucha: 0,
	});

	async function fetchStats() {
		if (!stores || stores.length === 0) return;

		const centerArr = center as [number, number];
		const { ok, data } = await API.get(
			`/stores/stats?${new URLSearchParams({
				radius: radius.toString(),
				lat: centerArr[0].toString(),
				lng: centerArr[1].toString(),
			}).toString()}`
		);
		if (!ok || !data) return;

		// Type assertion for the data
		const responseData = data as {
			totalStores: number;
			storesWithAvailability: number;
		};
		const stats = {
			total: responseData.totalStores,
			withKombucha: responseData.storesWithAvailability,
		};

		setStats(stats);
	}

	useEffect(() => {
		fetchStats();
	}, [stores]);

	const [open, setOpen] = useState(true);

	return (
		<Collapsible
			className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg min-w-[200px]"
			open={open}
			onOpenChange={setOpen}>
			<CollapsibleTrigger className="w-full flex justify-between items-center text-sm font-medium text-gray-900 cursor-pointer">
				<div>
					Area Statistics{" "}
					<span className="text-xs text-gray-500">({radius / 1000} km)</span>
				</div>
				{open ? (
					<ChevronUpIcon className="text-gray-900 ml-2" size={16} />
				) : (
					<ChevronDownIcon className="text-gray-900 ml-2" size={16} />
				)}
			</CollapsibleTrigger>
			<CollapsibleContent className="mt-2 space-y-1">
				<div className="flex justify-between items-center">
					<span className="text-xs text-gray-600">Total Stores:</span>
					<span className="text-sm font-medium text-gray-900">
						{stats.total}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-xs text-gray-600">With Kombucha:</span>
					<span className="text-sm font-medium text-green-600">
						{stats.withKombucha}
					</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-xs text-gray-600">Success Rate:</span>
					<span className="text-sm font-medium text-blue-600">
						{stats.total > 0
							? Math.round((stats.withKombucha / stats.total) * 100)
							: 0}
						%
					</span>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export default StatsCard;
