"use client";

import { Slot } from "@radix-ui/react-slot";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

import type { Dispatch, FC, ReactElement } from "react";

export const SearchInput: FC<{
	value: string;
	onChange: Dispatch<string>;
	onTouched: Dispatch<void>;
	icon: ReactElement;
}> = ({ value, onChange, onTouched, icon }) => {
	return (
		<label
			className={twMerge(
				"flex cursor-pointer items-center rounded-md border border-b-2 py-4 text-white transition-all placeholder:text-current placeholder:opacity-75",
				value
					? "border-white/5 bg-white/5 px-4"
					: "border-transparent bg-transparent focus-within:border-white/5 focus-within:bg-white/5 focus-within:px-4"
			)}
		>
			<Slot className="size-6 shrink-0 opacity-75">{icon}</Slot>
			<input
				placeholder="Search..."
				value={value}
				className={twMerge(
					"bg-transparent text-white opacity-0 outline-none ring-0 transition-all placeholder:text-current placeholder:opacity-75",
					"[--width:11rem] sm:[--width:24rem] lg:[--width:32rem]",
					value
						? "ml-2 w-[var(--width)] opacity-100"
						: "ml-0 w-0 focus-visible:ml-2 focus-visible:w-[var(--width)] focus-visible:opacity-100"
				)}
				onChange={({ target }) => {
					window.scrollTo({ top: 0, behavior: "smooth" });

					onChange(target.value.toLowerCase());
					onTouched();
				}}
			/>
			{value && (
				<button
					className="opacity-75 transition-opacity hover:opacity-100"
					type="button"
					onClick={() => {
						onChange("");
						onTouched();
					}}
				>
					<X className="size-6 shrink-0" />
				</button>
			)}
		</label>
	);
};
