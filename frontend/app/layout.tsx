import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Heart, Milk } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Kombuciao - Trouvez votre Ciao Kombucha",
	description:
		"Découvrez où trouver votre Ciao Kombucha préféré près de chez vous. Localisez les magasins avec les saveurs disponibles en temps réel.",
	keywords: [
		"kombucha",
		"ciao",
		"kombuciao",
		"ciao kombucha",
		"ciao kombucha paris",
		"squeezie",
		"squeezie kombucha",
		"squeezie ciao kombucha",
	],
	openGraph: {
		type: "website",
		title: "Kombuciao - Trouvez votre Ciao Kombucha",
		description:
			"Découvrez où trouver votre Ciao Kombucha préféré près de chez vous. Localisez les magasins avec les saveurs disponibles en temps réel.",
		siteName: "Kombuciao",
		locale: "fr_FR",
		countryName: "France",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20`}>
				<div className="min-h-screen flex flex-col">
					{/* Header */}
					<header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
						<div className="container mx-auto px-4 py-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="relative">
										<div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
											<Milk className="w-5 h-5 text-white" />
										</div>
									</div>
									<div>
										<h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
											Kombuciao
										</h1>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											Trouvez votre Ciao Kombucha
										</p>
									</div>
								</div>
							</div>
						</div>
					</header>

					{/* Main Content */}
					<main className="flex-1 container mx-auto px-4 py-6">{children}</main>

					{/* Footer */}
					<footer className="border-t border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/60">
						<div className="container mx-auto px-4 py-8">
							<div className="flex flex-col items-center gap-6 text-center">
								{/* Main Footer Content */}
								<div className="flex flex-col items-center gap-4">
									<div className="flex items-center gap-2">
										<Heart className="w-4 h-4 text-rose-500" />
										<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
											Fait avec amour pour les amateurs de Kombucha
										</span>
									</div>
									<p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
										Découvrez où trouver votre Ciao Kombucha préféré. Localisez
										les magasins avec les saveurs disponibles en temps réel.
									</p>
								</div>

								{/* Links */}
								<div className="flex items-center gap-6 text-xs">
									<Link
										href="/about"
										className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
										À propos
									</Link>
									<Link
										href="/contact"
										className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
										Contact
									</Link>
									<Link
										href="/legal"
										className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
										Mentions légales
									</Link>
								</div>

								{/* Bottom */}
								<div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 w-full">
									<p className="text-xs text-slate-400 dark:text-slate-500">
										© {new Date().getFullYear()} Kombuciao. Tous droits
										réservés.
									</p>
								</div>
							</div>
						</div>
					</footer>
				</div>
				<Toaster richColors position="top-center" />
			</body>
		</html>
	);
}
