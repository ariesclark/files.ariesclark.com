"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { twMerge } from "tailwind-merge";

import type * as React from "react";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const IconLeft = () => <ChevronLeft className="size-4" />;
const IconRight = () => <ChevronRight className="size-4" />;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			className={className}
			disabled={{ after: new Date() }}
			showOutsideDays={showOutsideDays}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "space-x-1 flex items-center",
				nav_button: twMerge(
					//buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: "w-full border-collapse space-y-1",
				head_row: "flex",
				head_cell: "rounded-md w-9 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: "size-9 text-center text-sm p-0 relative",
				day: "size-9 border-2 border-transparent",
				day_range_start: "start rounded-l-md bg-cloudflare-2 !border-l-2",
				day_range_end: "end rounded-r-md bg-cloudflare-2 !border-r-2",
				day_selected: "border-y-cloudflare-2 border-x-0 rounded-none",
				//day_today: "!border-red-500 bg-red-500/20 rounded-md",
				day_outside:
					"day-outside opacity-50 aria-selected:bg-accent/50 aria-selected:aria-selected:opacity-30",
				day_disabled: "opacity-50",
				day_range_middle: "bg-cloudflare-2/20",
				day_hidden: "invisible",
				...classNames
			}}
			components={{
				IconLeft,
				IconRight
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
