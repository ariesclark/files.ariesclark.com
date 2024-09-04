import {
	duration,
	entries,
	group,
	ms,
	now,
	relativeTime,
	timestamp
} from "@ariesclark/extensions";
import { twMerge } from "tailwind-merge";

import { listObjects } from "~/r2";

import { ObjectItem } from "./object";

import type { ComponentProps, FC, PropsWithChildren } from "react";

export const runtime = "edge";

const InlineCode: FC<ComponentProps<"code">> = ({
	children,
	className,
	...props
}) => (
	<code
		{...props}
		className={twMerge("rounded bg-black/50 px-2 py-1 font-mono", className)}
	>
		<span>{children}</span>
	</code>
);

const formatTimestamp = (value: Date) =>
	value.toLocaleDateString("en-CA", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});

export default async function DefaultPage({
	searchParams: { starts = "", before: _before, after: _after }
}: {
	searchParams: Record<string, string | undefined>;
}) {
	const before = _before ? new Date(Number.parseInt(_before)) : undefined;
	const after = _after ? new Date(Number.parseInt(_after)) : undefined;

	const { objects } = await listObjects({
		starts,
		before,
		after
	});

	return (
		<div className="container mx-auto flex flex-col gap-8 p-8 px-4 lg:px-8">
			<span className="text-sm opacity-75">
				{objects.length} file{objects.length === 1 ? "" : "s"}
				{starts && (
					<>
						{" "}
						starting with <InlineCode>{starts}</InlineCode>
					</>
				)}
				{after && (
					<>
						{" "}
						between <InlineCode>{formatTimestamp(after)}</InlineCode> and{" "}
						<InlineCode>{before ? formatTimestamp(before) : "now"}</InlineCode>.
					</>
				)}
			</span>
			<div className="grid w-full grid-cols-1 gap-8">
				{entries(
					group(objects, ({ created }) =>
						Math.floor(timestamp(created) / ms("1d"))
					)
				)
					.toSorted(([a], [b]) => b - a)
					.map(([key, value], index) => {
						const date = new Date(Number.parseInt(key.toString()) * ms("1d"));
						const today = now() - date.getTime() < ms("1.5d");

						return (
							<div className="relative flex w-full flex-col gap-8" key={key}>
								{today && (
									<div className="bg-cloudflare-2 absolute -left-6 top-0 h-full w-1 rounded-full" />
								)}
								<div className="flex w-full justify-between">
									<span>
										{date.toLocaleDateString("en-CA", {
											year: "numeric",
											month: "long",
											day: "numeric"
										})}{" "}
										<span className="text-sm opacity-75">
											({today ? "today" : relativeTime(date)})
										</span>
									</span>
									<span className="text-sm opacity-75">
										{value.length} file{value.length === 1 ? "" : "s"}
									</span>
								</div>
								<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
									{value.map((object) => (
										<ObjectItem {...object} key={object.id} />
									))}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}
