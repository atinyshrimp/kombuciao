"use client";

import Link from "next/link";
import { Milk, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
			<div className="max-w-md mx-auto text-center">
				{/* Logo */}
				<div className="flex justify-center mb-8">
					<div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
						<Milk className="w-8 h-8 text-white" />
					</div>
				</div>
				{/* 404 Content */}
				<div className="space-y-6">
					<div>
						<h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
							404
						</h1>
						<h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-4">
							Page introuvable
						</h2>
					</div>

					<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
						Désolée, la page que vous recherchez n&apos;existe pas ou a été
						déplacée.
					</p>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
						<Link
							href="/"
							className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
							<Home className="w-4 h-4" />
							Retour à l&apos;accueil
						</Link>

						<button
							onClick={() => window.history.back()}
							className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer">
							<ArrowLeft className="w-4 h-4" />
							Retour en arrière
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
