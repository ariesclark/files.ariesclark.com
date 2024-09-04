import { getRequestContext } from "@cloudflare/next-on-pages";
import { unstable_cache } from "next/cache";
import { empty, ms, now } from "@ariesclark/extensions";

const formatTimestamp = (value: Date) =>
	value
		.toLocaleString("en-CA", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		})
		.replaceAll("-", "/");

export const supportedContentTypes = ["image", "video"] as const;

export type SupportedContentType = (typeof supportedContentTypes)[number];
export type ContentType = SupportedContentType | "unknown";

export interface File {
	id: string;
	name: string;
	type: ContentType;
	size: number;
	created: Date;
	metadata: {
		mime: string;
		checksums: R2Checksums;
	};
}

const extensionOverrides: Record<string, string> = {
	// Cloudflare doesn't recognize `.avif` as an image, so we'll override it.
	avif: "image"
};

function transformObject({
	key: id,
	httpMetadata: { contentType: mime = "application/octet-stream" } = {},
	size,
	uploaded: created,
	checksums
}: R2Object): File {
	const name = id.split("/").at(-1) || id;
	const extension = name.split(".").at(-1) || null;

	const type = ((extension && extensionOverrides[extension]) ||
		(supportedContentTypes.includes(mime.split("/")[0] as SupportedContentType)
			? mime.split("/")[0]
			: "unknown")) as ContentType;

	return {
		id,
		name,
		type,
		size,
		created,
		metadata: {
			mime,
			checksums
		}
	};
}

export const getObject = unstable_cache(
	async (id: string): Promise<File | null> => {
		const {
			env: { files }
		} = getRequestContext();

		if (process.env.NODE_ENV === "development") {
			const url = `${process.env.R2_PROXY_URL}/api/objects/${id}`;
			return fetch(url)
				.then((response) => response.json())
				.catch(() => null) as Promise<File | null>;
		}

		const file = await files.get(id);
		if (!file) return null;

		return transformObject(file);
	},
	[],
	{ revalidate: false }
);

export interface ListObjectOptions {
	starts?: string;
	before?: Date;
	after?: Date;
}

export async function listObjects({
	starts,
	before,
	after
}: ListObjectOptions = {}) {
	const {
		env: { files }
	} = getRequestContext();

	if (process.env.NODE_ENV === "development") {
		const query = Object.entries({
			starts,
			before: before?.getTime(),
			after: after?.getTime()
		}).filter(([, value]) => !!value) as Array<[string, string]>;

		const url = `${process.env.R2_PROXY_URL}/api/objects?${new URLSearchParams(query).toString()}`;
		return fetch(url).then((response) => response.json()) as Promise<{
			objects: Array<File>;
		}>;
	}

	if (!before || Number.isNaN(before.getTime()) || before.getTime() > now())
		before = new Date(now());

	// Add a day to the `before` date to include the current day.
	before = new Date(before.getTime() + ms("1d"));

	if (!after || Number.isNaN(after.getTime()) || after.getTime() > now())
		after = new Date(now());

	// Subtract a day from the `after` date to include the current day.
	after = new Date(after.getTime() - ms("1d"));

	const queries =
		before && after
			? Array.from(
					{
						length: Math.floor((before.getTime() - after.getTime()) / ms("1d"))
					},
					(_, index) =>
						`${formatTimestamp(new Date(after.getTime() + ms("1d") * index))}${starts ? `/${starts}` : ""}`
				)
			: [];

	console.log({ files, before, after, queries });

	const objects = (
		await Promise.all(
			queries.map(async (prefix) => {
				const objects: Array<R2Object> = [];

				let truncated = true;
				let cursor: string | undefined;

				while (truncated) {
					const { objects: chunk, truncated: trimmed } = await files.list({
						include: ["customMetadata", "httpMetadata"],
						limit: 1000,
						prefix,
						cursor
					});

					if (chunk.length === 0) {
						truncated = false;
						break;
					}

					objects.push(...chunk);
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					cursor = trimmed ? chunk.at(-1)!.key : undefined;
					truncated = trimmed;
				}

				return objects;
			})
		)
	)
		.flat()
		.sort(({ uploaded: a }, { uploaded: b }) => b.getTime() - a.getTime())
		// eslint-disable-next-line unicorn/no-array-callback-reference
		.map(transformObject);

	return {
		objects
	};
}
