import React from "react";
import { useEffect, useState } from "react";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	TrendingUp,
	Store,
	Package,
	Store as StoreIcon,
} from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import API from "@/app/api";
import { Store as StoreType } from "@/types/store";
import { formatNumber } from "@/lib/utils";
import { Card } from "../ui/card";

const StatsCard = ({
	stores,
	center,
	radius,
}: {
	stores: StoreType[];
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

	const prosperityPercentage =
		stats.total > 0 ? Math.round((stats.withKombucha / stats.total) * 100) : 0;

	return (
		<Collapsible
			className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 shadow-xl dark:bg-slate-900/90 dark:border-slate-800/60 min-w-[240px]"
			open={open}
			onOpenChange={setOpen}>
			<CollapsibleTrigger className="w-full flex justify-between items-center lg:text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
				<div className="flex items-center gap-2">
					<TrendingUp className="w-4 h-4 text-emerald-600" />
					<span>
						Statistiques de la zone{" "}
						<span className="text-sm lg:text-xs text-slate-500 dark:text-slate-400 font-normal">
							({formatNumber(radius / 1000)} km)
						</span>
					</span>
				</div>
				{open ? (
					<ChevronUpIcon
						className="text-slate-600 dark:text-slate-400 ml-2"
						size={16}
					/>
				) : (
					<ChevronDownIcon
						className="text-slate-600 dark:text-slate-400 ml-2"
						size={16}
					/>
				)}
			</CollapsibleTrigger>
			<CollapsibleContent className="mt-4 space-y-3">
				{/* Total Stores */}
				<div className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
					<div className="flex items-center gap-2">
						<Store className="w-4 h-4 text-slate-600 dark:text-slate-400" />
						<span className="text-sm lg:text-xs text-slate-600 dark:text-slate-400">
							Magasins totaux :
						</span>
					</div>
					<span className="lg:text-sm font-semibold text-slate-900 dark:text-slate-100">
						{stats.total}
					</span>
				</div>
				{/* Stores with Kombucha */}
				<div className="flex items-center justify-between p-3 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/40 dark:border-emerald-800/40">
					<div className="flex items-center gap-2">
						<Package className="w-4 h-4 text-emerald-600" />
						<span className="text-sm lg:text-xs text-emerald-700 dark:text-emerald-300">
							Avec le précieux :
						</span>
					</div>
					<span className="lg:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
						{stats.withKombucha}
					</span>
				</div>
				{/* Prosperity Percentage */}
				<div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/40 dark:border-blue-800/40">
					<div className="flex items-center gap-2">
						<TrendingUp className="w-4 h-4 text-blue-600" />
						<span className="text-sm lg:text-xs text-blue-700 dark:text-blue-300">
							Prospérité de la zone :
						</span>
					</div>
					<span className="lg:text-sm font-semibold text-blue-700 dark:text-blue-300">
						{prosperityPercentage}%
					</span>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

const StatsCardMobile = ({
	stores,
	center,
	radius,
}: {
	stores: StoreType[];
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

	const prosperityPercentage =
		stats.total > 0 ? Math.round((stats.withKombucha / stats.total) * 100) : 0;

	return (
		<Card className="p-4 bg-white/70 dark:bg-slate-900/70 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
			<Collapsible defaultOpen={false}>
				<CollapsibleTrigger className="w-full flex items-center gap-2 text-left">
					<TrendingUp className="w-4 h-4 text-emerald-600" />
					<span className="font-medium text-slate-900 dark:text-slate-100">
						Statistiques de la zone
					</span>
				</CollapsibleTrigger>

				<CollapsibleContent className="space-y-4 mt-4">
					{/* Total Stores */}
					<div className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg">
						<div className="flex items-center gap-2">
							<StoreIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
							<span className="text-sm lg:text-xs text-slate-600 dark:text-slate-400">
								Magasins totaux :
							</span>
						</div>
						<span className="lg:text-sm font-semibold text-slate-900 dark:text-slate-100">
							{stats.total}
						</span>
					</div>

					{/* Stores with Kombucha */}
					<div className="flex items-center justify-between p-3 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-lg">
						<div className="flex items-center gap-2">
							<Package className="w-4 h-4 text-emerald-600" />
							<span className="text-sm lg:text-xs text-emerald-700 dark:text-emerald-300">
								Avec le précieux :
							</span>
						</div>
						<span className="lg:text-sm font-semibold text-emerald-700 dark:text-emerald-300">
							{stats.withKombucha}
						</span>
					</div>

					{/* Prosperity Percentage */}
					<div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
						<div className="flex items-center gap-2">
							<TrendingUp className="w-4 h-4 text-blue-600" />
							<span className="text-sm lg:text-xs text-blue-700 dark:text-blue-300">
								Prospérité de la zone :
							</span>
						</div>
						<span className="lg:text-sm font-semibold text-blue-700 dark:text-blue-300">
							{prosperityPercentage}%
						</span>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
};

export default StatsCard;
export { StatsCard, StatsCardMobile };
