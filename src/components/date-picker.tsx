"use client";

import { CalendarX2 } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calandar";

import type * as React from "react";
import type { DateRange } from "react-day-picker";

export function DatePicker({
	children,
	value,
	onChange,
	onTouched
}: React.PropsWithChildren<{
	value: DateRange | null;
	onChange: React.Dispatch<DateRange | null>;
	onTouched: () => void;
}>) {
	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent align="start" className="w-auto">
				<div>
					<button
						type="button"
						onClick={() => {
							onChange(null);
							onTouched();
						}}
					>
						<CalendarX2 className="size-5" />
					</button>
				</div>
				<Calendar
					initialFocus
					defaultMonth={value?.from}
					mode="range"
					numberOfMonths={2}
					selected={value || undefined}
					onSelect={(value) => {
						onTouched();
						onChange(value || null);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
