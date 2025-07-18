import { Metadata } from "next";
import { MessageCircle, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import { REPO_URL } from "@/constants";

export const metadata: Metadata = {
	title: "Contact - Kombuciao",
	description: "Une question, une suggestion ou un bug à signaler ?",
};

export default function ContactPage() {
	return (
		<div className="max-w-4xl mx-auto py-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
					Contact
				</h1>
				<p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Une question, une suggestion ou un bug à signaler ?
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-8 mb-12">
				<div className="flex flex-col justify-between bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-4">
							<MessageCircle className="w-6 h-6 text-blue-500" />
							<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
								Signaler un problème
							</h2>
						</div>
						<p className="text-slate-600 dark:text-slate-400 mb-4">
							Vous avez trouvé un bug ou une erreur dans les données ? Créez une
							issue sur GitHub pour nous aider à améliorer la plateforme.
						</p>
					</div>
					<a
						href={`${REPO_URL}/issues`}
						target="_blank"
						rel="noopener noreferrer"
						className="w-fit inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
						<SiGithub className="w-4 h-4" />
						Créer une issue
						<ExternalLink className="w-3 h-3" />
					</a>
				</div>

				<div className="flex flex-col justify-between bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-sm dark:bg-slate-900/60 dark:border-slate-800/60">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-4">
							<SiGithub className="w-6 h-6 text-slate-700 dark:text-slate-300" />
							<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
								Contribuer
							</h2>
						</div>
						<p className="text-slate-600 dark:text-slate-400 mb-4">
							Vous êtes développeur et souhaitez contribuer au projet ? Le code
							source est disponible sur GitHub.
						</p>
					</div>
					<a
						href={REPO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="w-fit inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
						<SiGithub className="w-4 h-4" />
						Voir le code source
						<ExternalLink className="w-3 h-3" />
					</a>
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
