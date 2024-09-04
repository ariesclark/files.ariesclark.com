"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import Icon from "./icon.svg";

import type { FC } from "react";

export const Logo: FC = () => {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<button
			className="flex items-center gap-4"
			type="button"
			onClick={() => {
				if (pathname === "/") {
					document.body
						.querySelector("main")
						?.scrollTo({ top: 0, behavior: "smooth" });
					return;
				}

				router.back();
			}}
		>
			<Image alt="R2 Explorer Icon" className="size-8" src={Icon} />
			<span className="text-lg font-medium">R2 Explorer</span>
		</button>
	);
};
