"use client";

import { useEffect, useState } from "react";
import {
	MapPin,
	Users,
	MessageSquare,
	Clock,
	Plus,
	Pencil,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	TbArrowBigUp,
	TbArrowBigUpFilled,
	TbArrowBigDown,
	TbArrowBigDownFilled,
} from "react-icons/tb";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, Report } from "@/types/store";
import { FLAVORS, TYPES } from "@/constants";
import { useStoreContext } from "@/lib/store-context";
import { getOpeningStatus, parseOpeningHours } from "@/lib/opening-hours";
import api from "@/lib/api";
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
	DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircleIcon } from "lucide-react";
import { Input } from "../ui/input";

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
	const [showEditModal, setShowEditModal] = useState(false);

	// Fetch store and reports when store is selected
	useEffect(() => {
		if (selectedStore) {
			fetchStore();
			fetchReports();
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

	if (!selectedStore) return null;

	// Show loading state while store data is being fetched
	if (!store) {
		return (
			<Sheet open={isOpen} onOpenChange={() => setSelectedStore(null)}>
				<SheetContent
					side="right"
					className="w-full sm:max-w-lg p-0 overflow-hidden">
					{/* Loading Header */}
					<div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white p-6 pb-8">
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
									<div className="bg-gray-50 rounded-lg p-4">
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

	return (
		<>
			<Sheet
				open={isOpen}
				onOpenChange={() => {
					setSelectedStore(null);
					if (isEdited) fetchStores();
				}}>
				<SheetContent
					side="right"
					className="w-full sm:max-w-lg p-0 overflow-hidden">
					{/* Header with gradient background */}
					<div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white p-6 pb-8">
						<div className="absolute inset-0 bg-black/10" />
						<div className="relative">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1 min-w-0">
									<SheetTitle className="text-white text-xl font-bold mb-2 line-clamp-2">
										{store.name}
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
										className="bg-white/20 text-white border-white/30 hover:bg-white/30">
										À {(store.distance / 1000).toFixed(1)} km
									</Badge>
								)}

								{store.openingHours && (
									<Badge
										variant="secondary"
										className={`border-white/30 ${
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
										className="bg-white/20 text-white border-white/30 hover:bg-white/30">
										{TYPES[store.types[0] as keyof typeof TYPES]}
									</Badge>
								)}
							</div>

							<EditStoreModal
								showEditModal={showEditModal}
								setShowEditModal={setShowEditModal}
								store={store}
								fetchStore={fetchStore}
							/>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto">
						<div className="p-6 space-y-6">
							{/* Opening Hours */}
							{store.openingHours && (
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold text-base flex items-center gap-2">
											<Clock className="h-4 w-4 text-blue-600" />
											Horaires d&apos;ouverture
										</h3>
										<span
											className={`text-sm font-medium ${
												openingStatus.isOpen ? "text-green-600" : "text-red-600"
											}`}>
											{openingStatus.status}
										</span>
									</div>

									{parsedHours.length > 0 ? (
										<div className="bg-gray-50 rounded-lg p-4 space-y-2">
											{parsedHours.map((hours, index) => (
												<div
													key={index}
													className="flex justify-between items-center text-sm">
													<span className="font-medium text-gray-700">
														{hours.dayFrench}
													</span>
													<span className="text-gray-600">
														{hours.open} - {hours.close}
													</span>
												</div>
											))}
										</div>
									) : (
										<div className="bg-gray-50 rounded-lg p-4">
											<p className="text-sm text-gray-600">
												{store.openingHours}
											</p>
										</div>
									)}
								</div>
							)}

							{/* Reports Section */}
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-base flex items-center gap-2">
										<MessageSquare className="h-4 w-4 text-blue-600" />
										Signalements Kombucha
									</h3>
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											{reports.length} signalement
											{reports.length !== 1 ? "s" : ""}
										</Badge>
										<Button
											variant="ghost"
											size="sm"
											className="text-xs cursor-pointer"
											onClick={() => setShowReportModal(true)}>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</div>

								{loading ? (
									<div className="space-y-3">
										{[1, 2, 3].map((i) => (
											<div key={i} className="bg-gray-50 rounded-lg p-4">
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
									<div className="bg-gray-50 rounded-lg p-8 text-center">
										<MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
										<p className="text-sm font-medium text-gray-900 mb-1">
											Aucun signalement
										</p>
										<p className="text-xs text-gray-500">
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
			} le signalement pour ${report.store.name} ?`
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
				} enregistré avec succès pour ${report.store.name}`
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
					"h-8 px-2 flex items-center gap-1 text-green-600 cursor-pointer hover:text-green-700 hover:bg-green-50",
					isConfirmed && "text-green-600 bg-green-50",
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
					"h-8 px-2 flex items-center gap-1 text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50",
					isDenied && "text-red-600 bg-red-50",
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
			className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
			<div className="flex items-start justify-between mb-3">
				<div className="flex flex-wrap gap-1.5">
					{report.flavors.map((flavor) => {
						const label = FLAVORS[flavor as keyof typeof FLAVORS];
						if (!label) return null;
						const icon = label.split(" ")[0];
						return (
							<span
								key={flavor}
								className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
								title={label}>
								{icon}
							</span>
						);
					})}
				</div>
				<div className="flex items-center gap-3 text-xs text-gray-500">
					<div className="flex items-center gap-1">
						<Users className="h-3 w-3" />
						<span>{report.votes.length}</span>
					</div>
				</div>
			</div>

			{report.description && (
				<p className="text-sm text-gray-600 mb-3 leading-relaxed">
					{report.description}
				</p>
			)}

			<div className="flex items-end justify-between">
				<div className="flex flex-col items-start">
					<span className="text-xs text-gray-500">
						Signalé le {getDateString(new Date(report.createdAt))}
					</span>
					{report.votes.length > 1 && (
						<span className="text-xs text-gray-500">
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
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Créer un signalement</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Signaler la disponibilité de kombucha chez {store.name} à{" "}
					{store.address.city}
				</DialogDescription>
				<div className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="description" className="block text-sm font-medium">
							Où chercher le kombucha ?
						</label>
						<textarea
							id="description"
							rows={4}
							className="w-full max-h-20 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="flavors" className="block text-sm font-medium">
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
						className="cursor-pointer">
						Annuler
					</Button>
					<Button
						onClick={handleCreateReport}
						disabled={loading}
						className="flex items-center gap-2 cursor-pointer">
						{loading && <LoaderCircleIcon className="h-4 w-4 animate-spin" />}
						Créer le signalement
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const EditStoreModal = ({
	showEditModal,
	setShowEditModal,
	store,
	fetchStore,
}: {
	showEditModal: boolean;
	setShowEditModal: (show: boolean) => void;
	store: Store;
	fetchStore: () => void;
}) => {
	const [loading, setLoading] = useState(false);
	const [values, setValues] = useState({
		name: "",
		address: {
			street: "",
			city: "",
		},
		openingHours: "",
	});

	useEffect(() => {
		if (!store) return;
		setValues({
			name: store.name,
			address: {
				street: store.address.street,
				city: store.address.city,
			},
			openingHours: store.openingHours || "",
		});
	}, [store]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setLoading(true);
			const { ok, error } = await api.put(`/stores/${store._id}`, values);
			if (!ok) throw new Error(error);
			toast.success("Magasin modifié avec succès");
			setShowEditModal(false);
			fetchStore();
		} catch (error) {
			console.error("Error editing store:", error);
			toast.error("Erreur lors de la modification du magasin");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={showEditModal} onOpenChange={setShowEditModal}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="cursor-pointer text-xs mt-4 hover:bg-white/5">
					<Pencil className="h-4 w-4" />
					Modifier
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modifier le magasin</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Modifier les informations du magasin {store.name}
				</DialogDescription>
				<form onSubmit={handleSubmit} className="space-y-4 mt-4">
					<div className="space-y-2">
						<label htmlFor="name" className="block text-sm font-medium">
							Nom du magasin
						</label>
						<Input
							id="name"
							value={values.name}
							onChange={(e) => setValues({ ...values, name: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="address" className="block text-sm font-medium">
							Adresse
						</label>
						<div className="flex items-center gap-2 w-full">
							<Input
								id="street"
								value={values.address.street}
								placeholder="Nom de la rue"
								onChange={(e) =>
									setValues({
										...values,
										address: { ...values.address, street: e.target.value },
									})
								}
							/>
							<Input
								id="city"
								value={values.address.city}
								placeholder="Ville"
								onChange={(e) =>
									setValues({
										...values,
										address: { ...values.address, city: e.target.value },
									})
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="submit"
							disabled={loading}
							className="flex items-center gap-2 cursor-pointer">
							{loading && <LoaderCircleIcon className="h-4 w-4 animate-spin" />}
							Enregistrer
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
