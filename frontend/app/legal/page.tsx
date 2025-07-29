import { Metadata } from "next";
import { Scale, Shield, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { REPO_URL } from "@/constants";

export const metadata: Metadata = {
	title: "Mentions légales - Kombuciao",
	description: "Informations légales et licence Polyform Noncommercial 1.0.0",
};

export default function LegalPage() {
	return (
		<div className="max-w-4xl mx-auto py-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
					Mentions légales
				</h1>
				<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Informations légales et conditions d&apos;utilisation de Kombuciao
				</p>
			</div>

			<div className="space-y-8">
				{/* License Section */}
				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-6">
						<FileText className="w-8 h-8 text-emerald-500" />
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Licence Polyform Noncommercial 1.0.0
						</h2>
					</div>

					<div className="prose prose-slate dark:prose-invert max-w-none">
						<p className="text-slate-600 dark:text-slate-400 mb-4">
							Kombuciao est distribué sous licence Polyform Noncommercial 1.0.0.
							Cette licence autorise l&apos;utilisation, la modification et la
							distribution du code source à des fins non commerciales
							uniquement.
						</p>

						<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
							Utilisation autorisée (Non commerciale) :
						</h3>
						<ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
							<li>Utilisation personnelle et éducative</li>
							<li>Contribution au développement open source</li>
							<li>Recherche et développement non commercial</li>
							<li>Utilisation par des organisations à but non lucratif</li>
						</ul>

						<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
							Utilisation interdite (Commerciale) * :
						</h3>
						<ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-4">
							<li>Utilisation dans un contexte commercial</li>
							<li>Intégration dans des produits ou services payants</li>
							<li>Utilisation par des entreprises à but lucratif</li>
							<li>Monétisation directe ou indirecte</li>
						</ul>
						<div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
							<p className="text-amber-800 dark:text-amber-200 lg:text-sm">
								* Liste non exhaustive
							</p>
						</div>
					</div>
				</div>

				{/* Legal Information */}
				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-6">
						<Scale className="w-8 h-8 text-blue-500" />
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Informations légales
						</h2>
					</div>

					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
								Éditeur
							</h3>
							<p className="text-slate-600 dark:text-slate-400">
								Kombuciao est un projet <i>source-available</i> développé par la
								communauté. Le code source est disponible sur GitHub sous
								licence Polyform Noncommercial 1.0.0.
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
								Clause de non-affiliation
							</h3>
							<p className="text-slate-600 dark:text-slate-400">
								Ce site n&apos;est pas affilié, sponsorisé ni approuvé par Ciao
								Kombucha ou ses représentants. Toutes les marques et noms de
								produits mentionnés sont la propriété de leurs détenteurs
								respectifs et ne suggèrent aucune association avec ce site.
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
								Données et contenu
							</h3>
							<p className="text-slate-600 dark:text-slate-400">
								Les informations sur les magasins proviennent de la{" "}
								<a
									href="https://www.data.gouv.fr/datasets/base-nationale-des-commerces-ouverte"
									target="_blank"
									rel="noopener noreferrer"
									className="text-indigo-500 hover:text-indigo-600 transition-colors">
									BAse Nationale des Commerces Ouverte (BANCO)
								</a>
								. La modification de ces données ne peut être effectuée de mon
								côté.
							</p>
							<p className="text-slate-600 dark:text-slate-400 mt-2">
								Les informations sur la disponibilité des saveurs sont basées
								sur les signalements de la communauté et ne peuvent être
								garanties en temps réel.
							</p>
						</div>

						<div>
							<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
								Responsabilité
							</h3>
							<p className="text-slate-600 dark:text-slate-400">
								Kombuciao est fourni &quot;en l&apos;état&quot; sans garantie
								d&apos;aucune sorte. Les utilisateurs utilisent ce service à
								leurs propres risques.
							</p>
						</div>
					</div>
				</div>

				{/* Privacy */}
				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex items-center gap-3 mb-6">
						<Shield className="w-8 h-8 text-green-500" />
						<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
							Protection des données
						</h2>
					</div>

					<div className="space-y-4 text-slate-600 dark:text-slate-400">
						<p>
							Kombuciao respecte votre vie privée. Le site ne collecte pas de
							données personnelles identifiables. Les données de géolocalisation
							sont utilisées uniquement pour améliorer votre expérience de
							recherche et ne sont pas stockées.
						</p>
					</div>
				</div>

				{/* Links */}
				<div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
						Liens utiles
					</h2>

					<div className="grid md:grid-cols-2 gap-4">
						<a
							href="https://polyformproject.org/licenses/noncommercial/1.0.0/"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 p-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors">
							<FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
							<div>
								<div className="font-medium text-slate-900 dark:text-slate-100">
									Licence complète
								</div>
								<div className="lg:text-sm text-slate-500 dark:text-slate-400">
									Polyform Noncommercial 1.0.0
								</div>
							</div>
							<ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
						</a>

						<a
							href={REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 p-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors">
							<FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
							<div>
								<div className="font-medium text-slate-900 dark:text-slate-100">
									Code source
								</div>
								<div className="lg:text-sm text-slate-500 dark:text-slate-400">
									GitHub Repository
								</div>
							</div>
							<ExternalLink className="w-4 h-4 text-slate-400 ml-auto" />
						</a>
					</div>
				</div>
			</div>

			<div className="text-center mt-8">
				<Link
					href="/"
					className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl">
					Retour à la carte
				</Link>
			</div>
		</div>
	);
}
