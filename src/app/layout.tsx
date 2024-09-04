import { Prompt } from "next/font/google";
import { twMerge } from "tailwind-merge";

import { Logo } from "./logo";

import type { Metadata } from "next";

import "./globals.css";

const prompt = Prompt({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "700"],
	variable: "--font-sans"
});

export const metadata: Metadata = {
	title: "R2 Explorer"
};

export default function RootLayout({
	children,
	navigation
}: {
	children: React.ReactNode;
	navigation: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={twMerge(
					"flex h-svh flex-col overflow-hidden bg-neutral-950 font-sans text-white",
					prompt.variable
				)}
			>
				<header className="flex h-24 shrink-0 items-center border-b border-white/5">
					<div className="container mx-auto flex items-center gap-4 p-6 px-4 lg:gap-8 lg:px-8">
						<Logo />
						{navigation}
					</div>
				</header>
				<main className="flex h-full flex-col overflow-y-auto overflow-x-hidden">
					{children}
				</main>
			</body>
		</html>
	);
}
