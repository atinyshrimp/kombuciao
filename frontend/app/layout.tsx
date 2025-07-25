import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { Milk } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { CIAO_KOMBUCHA_URL } from "@/constants";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Kombuciao | Où trouver du Ciao Kombucha près de chez vous",
	description:
		"Découvrez où trouver votre Ciao Kombucha tant recherché près de chez vous. Localisez les magasins avec les saveurs disponibles en temps réel.",
	keywords: [
		"kombuciao",
		"où acheter ciao kombucha",
		"trouver ciao kombucha",
		"ciao kombucha",
		"ciao kombucha squeezie",
		"ciao kombucha magasin",
		"ciao kombucha paris",
		"ciao kombucha france",
		"squeezie",
		"squeezie kombucha",
	],
	openGraph: {
		type: "website",
		url: "https://kombuciao.vercel.app",
		title: "Kombuciao - Trouvez votre Ciao Kombucha",
		description:
			"Découvrez où trouver votre Ciao Kombucha tant recherché près de chez vous. Localisez les magasins avec les saveurs disponibles en temps réel.",
		siteName: "Kombuciao",
		locale: "fr_FR",
		countryName: "France",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Kombuciao - Trouvez votre Ciao Kombucha",
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20`}>
				<div className="min-h-screen flex flex-col">
					{/* Header */}
					<header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
						<div className="container mx-auto px-4 py-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="relative">
										<Link
											href="/"
											className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
											<Milk className="w-5 h-5 text-white" />
										</Link>
									</div>
									<div>
										<h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
											Kombuciao
										</h1>
										<p className="text-sm lg:text-xs text-slate-500 dark:text-slate-400">
											Trouvez votre{" "}
											<a
												href={CIAO_KOMBUCHA_URL}
												target="_blank"
												rel="noopener noreferrer"
												className="text-emerald-500 italic hover:text-emerald-600 transition-colors">
												Ciao Kombucha
											</a>
											.
										</p>
									</div>
								</div>
							</div>
						</div>
					</header>

					{/* Main Content */}
					<main className="flex-1 container mx-auto px-4 py-6">
						<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
					</main>

					{/* Footer */}
					<footer className="border-t border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/60">
						<div className="container mx-auto px-4 py-8">
							<div className="flex flex-col items-center gap-6 text-center">
								{/* Main Footer Content */}
								<div className="flex flex-col items-center gap-4">
									<p className="text-sm lg:text-xs text-slate-500 dark:text-slate-400 max-w-md">
										Découvrez où trouver votre{" "}
										<a
											href={CIAO_KOMBUCHA_URL}
											target="_blank"
											rel="noopener noreferrer"
											className="text-emerald-500 italic hover:text-emerald-600 transition-colors">
											Ciao Kombucha
										</a>
										. Localisez les magasins avec les saveurs disponibles en
										temps réel.
									</p>
								</div>

								{/* Links */}
								<div className="flex items-center gap-6 text-sm lg:text-xs">
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

								{/* License Info */}
								<div className="text-sm lg:text-xs text-slate-400 dark:text-slate-500 space-y-1">
									<p>Kombuciao</p>
									<p>
										Licence Polyform Noncommercial 1.0.0 • Usage non commercial
										uniquement
									</p>
								</div>
							</div>
						</div>
					</footer>
				</div>
				<Toaster richColors position="top-center" />
				<Analytics />
			</body>
		</html>
	);
}
