"use client";

import { useEffect, useState } from "react";
import { MapPin, Users, MessageSquare, Clock, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	TbArrowBigUp,
	TbArrowBigUpFilled,
	TbArrowBigDown,
	TbArrowBigDownFilled,
} from "react-icons/tb";
import { SiOpenstreetmap, SiGooglemaps } from "react-icons/si";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, Report } from "@/types/store";
import { FLAVORS, TYPES } from "@/constants";
import { useStoreContext } from "@/lib/store-context";
import { getOpeningStatus, parseOpeningHours } from "@/lib/opening-hours";
import api from "@/app/api";
import { cn, getDateString, getUserId } from "@/lib/utils";
import { toast } from "sonner";
import FlavorSelector from "./FlavorSelector";
import { Option } from "../ui/multiselect";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircleIcon } from "lucide-react";

export default function StoreDetailSheet({
	fetchStores,
}: {
	fetchStores: () => void;
}) {
	const { selectedStore, setSelectedStore } = useStoreContext();
	const [store, setStore] = useState<Store | null>(null);
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [isEdited, setIsEdited] = useState(false);

	// Fetch store and reports when store is selected
	useEffect(() => {
		if (selectedStore) {
			fetchStore();
			fetchReports();
		} else {
			// Reset state when selectedStore becomes null
			setStore(null);
			setReports([]);
		}
	}, [selectedStore]);

	const fetchStore = async () => {
		setLoading(true);
		try {
			const { ok, data, error } = await api.get(`/stores/${selectedStore}`);
			if (!ok) throw new Error(error);
			setStore(data as Store);
		} catch (error) {
			console.error("Error fetching store:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchReports = async () => {
		setLoading(true);
		try {
			const { ok, data, error } = await api.get(
				`/reports?storeId=${selectedStore}`
			);
			if (!ok) throw new Error(error);
			setReports(data as Report[]);
		} catch (error) {
			console.error("Error fetching reports:", error);
			setReports([]);
		} finally {
			setLoading(false);
		}
	};

	const isOpen = Boolean(selectedStore);
	// Show loading state while store data is being fetched
	if (!store) {
		return (
			<Sheet open={isOpen} onOpenChange={() => setSelectedStore(null)}>
				<SheetContent
					side="right"
					className="w-full sm:max-w-lg p-0 overflow-hidden">
					{/* Loading Header */}
					<div className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 text-white p-6 pb-8">
						<div className="absolute inset-0 bg-black/10" />
						<div className="relative">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1 min-w-0">
									<SheetTitle className="text-white text-xl font-bold mb-2">
										<Skeleton className="h-6 w-48 bg-white/20" />
									</SheetTitle>
									<div className="flex items-center gap-2 text-white/90 text-sm">
										<MapPin className="h-4 w-4 flex-shrink-0" />
										<Skeleton className="h-4 w-32 bg-white/20" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Loading Content */}
					<div className="flex-1 overflow-y-auto">
						<div className="p-6 space-y-6">
							{[1, 2, 3].map((i) => (
								<div key={i} className="space-y-3">
									<Skeleton className="h-5 w-40" />
									<div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/40 dark:border-slate-700/40">
										<Skeleton className="h-4 w-full mb-2" />
										<Skeleton className="h-4 w-2/3" />
									</div>
								</div>
							))}
						</div>
					</div>
				</SheetContent>
			</Sheet>
		);
	}

	const openingStatus = getOpeningStatus(store.openingHours || "");
	const parsedHours = parseOpeningHours(store.openingHours || "");
	console.log(parsedHours);

	return (
		<>
			<Sheet
				open={isOpen}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedStore(null);
						if (isEdited) fetchStores();
					}
				}}>
				<SheetContent
					side="right"
					className="w-full sm:max-w-lg p-0 overflow-hidden">
					{/* Header with gradient background */}
					<div className="relative bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 text-white p-6 pb-8">
						<div className="absolute inset-0 bg-black/10" />
						<div className="relative">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1 min-w-0">
									<SheetTitle className="text-white text-xl font-bold mb-2 line-clamp-2">
										{store.name || "Sans nom"}
									</SheetTitle>
									<div className="flex items-center gap-2 text-white/90 text-sm">
										<MapPin className="h-4 w-4 flex-shrink-0" />
										<span className="line-clamp-1">
											{store.address.street && `${store.address.street}, `}
											{store.address.city}
										</span>
									</div>
								</div>
							</div>

							{/* Status badges */}
							<div className="flex flex-wrap gap-2 mt-4">
								{store.distance && (
									<Badge
										variant="secondary"
										className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
										À {(store.distance / 1000).toFixed(1)} km
									</Badge>
								)}

								{store.openingHours && (
									<Badge
										variant="secondary"
										className={`border-white/30 backdrop-blur-sm ${
											openingStatus.isOpen
												? "bg-green-500/20 text-green-100 border-green-300/30"
												: "bg-red-500/20 text-red-100 border-red-300/30"
										}`}>
										<Clock className="h-3 w-3 mr-1" />
										{openingStatus.isOpen ? "Ouvert" : "Fermé"}
									</Badge>
								)}

								{store.types && store.types.length > 0 && (
									<Badge
										variant="secondary"
										className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
										{TYPES[store.types[0] as keyof typeof TYPES]}
									</Badge>
								)}
							</div>

							{/* Links */}
							<div className="flex items-center gap-2 mt-3">
								{store.osmId && (
									<Button
										variant="outline"
										size="sm"
										className="h-8 px-3 text-xs bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm cursor-pointer"
										onClick={() =>
											window.open(
												`https://www.openstreetmap.org/${store.osmId}`,
												"_blank"
											)
										}>
										<SiOpenstreetmap className="h-3 w-3 mr-1" />
										Plus d&apos;infos
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									className="h-8 px-3 text-xs bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm cursor-pointer"
									onClick={() => {
										const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
											store.location.coordinates.reverse().join(",")
										)}`;
										window.open(url, "_blank");
									}}>
									<SiGooglemaps className="h-3 w-3 mr-1" />
									Itinéraire
								</Button>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto">
						<div className="p-6 space-y-6">
							{/* Opening Hours */}
							{store.openingHours && (
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
											<Clock className="h-4 w-4 text-emerald-600" />
											Horaires d&apos;ouverture
										</h3>
										<span
											className={`text-sm font-medium ${
												openingStatus.isOpen
													? "text-emerald-600"
													: "text-red-600"
											}`}>
											{openingStatus.status}
										</span>
									</div>

									{parsedHours.length > 0 ? (
										<div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-4 space-y-2 border border-slate-200/40 dark:border-slate-700/40">
											{parsedHours.map((schedule, index) => (
												<div
													key={index}
													className="flex justify-between items-center text-sm">
													<span className="font-medium text-slate-700 dark:text-slate-300">
														{schedule.day}
													</span>
													{schedule.isOpen && (
														<span className="text-slate-600 dark:text-slate-400">
															{schedule.timeRanges
																.map(
																	(timeRange) =>
																		`${timeRange.open} - ${timeRange.close}`
																)
																.join(" | ")}
														</span>
													)}
													{!schedule.isOpen && (
														<span className="text-red-600 dark:text-red-400">
															Fermé
														</span>
													)}
												</div>
											))}
										</div>
									) : (
										<div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/40 dark:border-slate-700/40">
											<p className="text-sm text-slate-600 dark:text-slate-400">
												{store.openingHours}
											</p>
										</div>
									)}
								</div>
							)}

							{/* Reports Section */}
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-base flex items-center gap-2 text-slate-900 dark:text-slate-100">
										<MessageSquare className="h-4 w-4 text-emerald-600" />
										Signalements Kombucha
									</h3>
									<div className="flex items-center gap-2">
										<Badge
											variant="secondary"
											className="text-xs bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60">
											{reports.length} signalement
											{reports.length !== 1 ? "s" : ""}
										</Badge>
										<Button
											variant="ghost"
											size="sm"
											className="text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
											onClick={() => setShowReportModal(true)}>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</div>

								{loading ? (
									<div className="space-y-3">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/40 dark:border-slate-700/40">
												<div className="flex items-center justify-between mb-3">
													<div className="flex gap-2">
														<Skeleton className="h-6 w-6 rounded-full" />
														<Skeleton className="h-6 w-6 rounded-full" />
													</div>
													<Skeleton className="h-4 w-8" />
												</div>
												<Skeleton className="h-3 w-full mb-2" />
												<Skeleton className="h-3 w-2/3" />
											</div>
										))}
									</div>
								) : reports.length === 0 ? (
									<div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-8 text-center border border-slate-200/40 dark:border-slate-700/40">
										<MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-3" />
										<p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
											Aucun signalement
										</p>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											Soyez le premier à signaler la disponibilité de kombucha
											dans ce magasin !
										</p>
									</div>
								) : (
									<div className="space-y-3">
										{reports.map((report) => (
											<ReportCard
												key={report._id}
												report={report}
												fetchReports={fetchReports}
											/>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</SheetContent>
			</Sheet>
			<CreateReportModal
				showReportModal={showReportModal}
				setShowReportModal={setShowReportModal}
				fetchReports={fetchReports}
				store={store}
				setIsEdited={setIsEdited}
			/>
		</>
	);
}

const VoteButtons = ({
	report,
	fetchReports,
}: {
	report: Report;
	fetchReports: () => void;
}) => {
	const userId = getUserId();
	const userVote = report.votes.find((v) => v.voterId === userId);
	const isConfirmed = userVote?.type === "confirm";
	const isDenied = userVote?.type === "deny";

	async function handleVote(type: "confirm" | "deny") {
		const isActionConfirmed = window.confirm(
			`Voulez-vous vraiment ${
				type === "confirm" ? "confirmer" : "contester"
			} le signalement pour le magasin "${report.store.name || "Sans nom"}" ?`
		);
		if (!isActionConfirmed) return;

		try {
			const { ok, error } = await api.post(`/reports/${report._id}/${type}`, {
				voterId: userId,
			});
			if (!ok) throw new Error(error);
			fetchReports();
			toast.success(
				`Vote de ${
					type === "confirm" ? "confirmation" : "contestation"
				} enregistré avec succès pour le magasin "${
					report.store.name || "Sans nom"
				}"`
			);
		} catch (error) {
			console.error("Error voting:", error);
			toast.error("Erreur lors de l'enregistrement du vote");
		}
	}

	return (
		<div className="flex gap-1">
			<Button
				variant="outline"
				size="sm"
				className={cn(
					"h-8 px-2 flex items-center gap-1 text-emerald-600 cursor-pointer hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/60",
					isConfirmed &&
						"text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
					userVote && "pointer-events-none"
				)}
				aria-label="Confirmer"
				onClick={() => handleVote("confirm")}>
				{isConfirmed ? (
					<TbArrowBigUpFilled size={16} aria-hidden="true" />
				) : (
					<TbArrowBigUp size={16} aria-hidden="true" />
				)}
				<span className="text-xs font-medium">
					{report.votes.filter((v) => v.type === "confirm").length}
				</span>
			</Button>
			<Button
				variant="outline"
				size="sm"
				className={cn(
					"h-8 px-2 flex items-center gap-1 text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200/60 dark:border-red-800/60",
					isDenied && "text-red-600 bg-red-50 dark:bg-red-950/30",
					userVote && "pointer-events-none"
				)}
				aria-label="Contester"
				onClick={() => handleVote("deny")}>
				{isDenied ? (
					<TbArrowBigDownFilled size={16} aria-hidden="true" />
				) : (
					<TbArrowBigDown size={16} aria-hidden="true" />
				)}
				<span className="text-xs font-medium">
					{report.votes.filter((v) => v.type === "deny").length}
				</span>
			</Button>
		</div>
	);
};

const ReportCard = ({
	report,
	fetchReports,
}: {
	report: Report;
	fetchReports: () => void;
}) => {
	return (
		<div
			key={report._id}
			className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
			<div className="flex items-start justify-between mb-3">
				<div className="flex flex-wrap gap-1.5">
					{report.flavors.map((flavor) => {
						const label = FLAVORS[flavor as keyof typeof FLAVORS];
						if (!label) return null;
						const icon = label.split(" ")[0];
						return (
							<span
								key={flavor}
								className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
								title={label}>
								{icon}
							</span>
						);
					})}
				</div>
				<div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
					<div className="flex items-center gap-1">
						<Users className="h-3 w-3" />
						<span>{report.votes.length}</span>
					</div>
				</div>
			</div>

			{report.description && (
				<p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
					{report.description}
				</p>
			)}

			<div className="flex items-end justify-between">
				<div className="flex flex-col items-start">
					<span className="text-xs text-slate-500 dark:text-slate-400">
						Signalé le {getDateString(new Date(report.createdAt))}
					</span>
					{report.votes.length > 1 && (
						<span className="text-xs text-slate-500 dark:text-slate-400">
							Dernier vote le {getDateString(new Date(report.updatedAt))}
						</span>
					)}
				</div>
				<VoteButtons report={report} fetchReports={fetchReports} />
			</div>
		</div>
	);
};

const CreateReportModal = ({
	showReportModal,
	setShowReportModal,
	setIsEdited,
	fetchReports,
	store,
}: {
	showReportModal: boolean;
	setShowReportModal: (show: boolean) => void;
	setIsEdited: (isEdited: boolean) => void;
	fetchReports: () => void;
	store: Store;
}) => {
	const [description, setDescription] = useState("");
	const [flavors, setFlavors] = useState<Option[]>([]);
	const [loading, setLoading] = useState(false);

	async function handleCreateReport() {
		if (flavors.length === 0)
			return toast.error("Veuillez sélectionner au moins une saveur");

		try {
			setLoading(true);
			const { ok, error } = await api.post("/reports", {
				storeId: store._id,
				voterId: getUserId(),
				description,
				flavors: flavors.map((f) => f.value),
			});
			if (!ok) throw new Error(error);
			toast.success("Signalement créé avec succès");
			fetchReports();
			setIsEdited(true);
			setShowReportModal(false);
		} catch (error) {
			console.error("Error creating report:", error);
			toast.error("Erreur lors de la création du signalement");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={showReportModal} onOpenChange={setShowReportModal}>
			<DialogContent className="p-4 lg:max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60">
				<DialogHeader>
					<DialogTitle className="text-slate-900 dark:text-slate-100">
						Créer un signalement
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="text-slate-600 dark:text-slate-400">
					Signaler la disponibilité de kombucha chez {store.name || "Sans nom"}
					{store.address.city && ` à ${store.address.city}`}
				</DialogDescription>
				<div className="space-y-4">
					<div className="space-y-2">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-slate-900 dark:text-slate-100">
							Où chercher le kombucha ?
						</label>
						<textarea
							id="description"
							rows={4}
							className="w-full max-h-20 p-3 rounded-xl border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<label
							htmlFor="flavors"
							className="block text-sm font-medium text-slate-900 dark:text-slate-100">
							Quelles saveurs t&apos;as trouvées ?
						</label>
						<FlavorSelector
							selectedFlavors={flavors}
							setSelectedFlavors={(flavors) => setFlavors(flavors)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setShowReportModal(false)}
						disabled={loading}
						className="cursor-pointer border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800">
						Annuler
					</Button>
					<Button
						onClick={handleCreateReport}
						disabled={loading}
						className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
						{loading && <LoaderCircleIcon className="h-4 w-4 animate-spin" />}
						Créer le signalement
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
