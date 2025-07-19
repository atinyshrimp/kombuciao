import { Metadata } from "next";
import { Heart, MapPin, Users, Code, Database, Vote } from "lucide-react";
import Link from "next/link";
import { CIAO_KOMBUCHA_URL, REPO_URL } from "@/constants";

export const metadata: Metadata = {
	title: "À propos - Kombuciao",
	description: "Découvrez l'histoire et la mission de Kombuciao",
};

export default function AboutPage() {
	return (
		<div className="max-w-4xl mx-auto py-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
					À propos de Kombuciao
				</h1>
				<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Une plateforme <i>source-available</i> dédiée aux Squeezos
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-8 mb-12">
				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-4">
						<Heart className="w-6 h-6 text-rose-500" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Mission
						</h2>
					</div>
					<p className="text-slate-600 dark:text-slate-400">
						L&apos;objectif de Kombuciao est de simplifier la recherche de{" "}
						<a
							href={CIAO_KOMBUCHA_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="text-emerald-500 italic hover:text-emerald-600 transition-colors">
							Ciao Kombucha
						</a>{" "}
						en vous permettant de localiser rapidement les magasins qui en
						disposent.
					</p>
				</div>

				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-4">
						<MapPin className="w-6 h-6 text-emerald-500" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Fonctionnalités
						</h2>
					</div>
					<ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
						<li>Recherche géolocalisée des magasins</li>
						<li>Filtrage par saveurs disponibles</li>
						<li>Informations en temps réel sur la disponibilité</li>
					</ul>
				</div>

				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-4">
						<Vote className="w-6 h-6 text-emerald-500" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Engagement communautaire
						</h2>
					</div>
					<p className="text-slate-600 dark:text-slate-400">
						La pertinence de l&apos;application repose sur l&apos;engagement de
						la communauté. Les Squeezos peuvent signaler la disponibilité des
						saveurs et voter sur les rapports pour maintenir des informations
						fiables.
					</p>
				</div>

				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-4">
						<Users className="w-6 h-6 text-blue-500" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Communauté
						</h2>
					</div>
					<p className="text-slate-600 dark:text-slate-400">
						Ce projet est développé par et pour la communauté des Squeezos.
						Chaque contribution, suggestion ou signalement aide à améliorer
						l&apos;expérience pour tous.
					</p>
				</div>

				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-4">
						<Database className="w-6 h-6 text-indigo-500" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Source des données
						</h2>
					</div>
					<p className="text-slate-600 dark:text-slate-400">
						Les informations des magasins proviennent de la{" "}
						<a
							href="https://www.data.gouv.fr/datasets/base-nationale-des-commerces-ouverte/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-indigo-500 hover:text-indigo-600 transition-colors">
							BAse Nationale des Commerces Ouverte (BANCO)
						</a>
						. La modification de ces données ne peut être effectuée de notre
						côté.
					</p>
				</div>

				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-4">
						<Code className="w-6 h-6 text-purple-500" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Source-available
						</h2>
					</div>
					<p className="text-slate-600 dark:text-slate-400">
						Kombuciao est un projet <i>source-available</i> sous licence
						Polyform Noncommercial 1.0.0. Le code source est disponible sur{" "}
						<a
							href={REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="text-purple-500 hover:text-purple-600 transition-colors">
							GitHub
						</a>{" "}
						et les contributions sont les bienvenues.
					</p>
				</div>
			</div>

			<div className="text-center">
				<Link
					href="/"
					className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl">
					Retour à la carte
				</Link>
			</div>
		</div>
	);
}
