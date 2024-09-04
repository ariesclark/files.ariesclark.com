/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import { empty } from "@ariesclark/extensions";
import { CalendarSearch, Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useState, useTransition } from "react";

import { DatePicker } from "~/components/date-picker";

import { SearchInput } from "./search-input";

import type { DateRange } from "react-day-picker";

export default function DefaultNavigation() {
	const router = useRouter();
	const [touched, setTouched] = useState(false);

	const searchParameters = useSearchParams();

	const [query, setQuery] = useState(searchParameters.get("starts") || "");
	const deferredQuery = useDeferredValue(query);

	const [range, setRange] = useState<DateRange | null>(
		searchParameters.has("after")
			? {
					from: new Date(Number.parseInt(searchParameters.get("after")!)),
					to: searchParameters.has("after")
						? new Date(Number.parseInt(searchParameters.get("after")!))
						: undefined
				}
			: null
	);

	const [pending, startTransition] = useTransition();

	console.log({ query, range });

	useEffect(() => {
		if (!touched) return;

		startTransition(() => {
			const query = new URLSearchParams(
				Object.entries({
					starts: deferredQuery,
					before: range?.to?.getTime(),
					after: range?.from?.getTime()
				}).filter(([, value]) => !empty(value)) as Array<[string, string]>
			);

			router.replace(`/?${query.toString()}`);
		});
	}, [touched, router, deferredQuery, range]);

	return (
		<div className="ml-auto flex gap-4">
			<SearchInput
				icon={pending ? <Loader2 className="animate-spin" /> : <Search />}
				value={query}
				onChange={setQuery}
				onTouched={() => setTouched(true)}
			/>
			<DatePicker
				value={range}
				onChange={setRange}
				onTouched={() => setTouched(true)}
			>
				<button type="button">
					<CalendarSearch className="-mt-0.5 size-6 shrink-0 opacity-75" />
				</button>
			</DatePicker>
		</div>
	);
}
