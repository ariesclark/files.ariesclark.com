import type { Dispatch } from "react";

export function getFile(id: string) {
	return `https://files.aries.fyi/${id}`;
}

export interface ImageOptions {
	anim: boolean;
	background: string;
	/**
	 * A number between 0 and 250.
	 */
	blur: number;
	width: number;
	height: number;
	/**
	 * A number between 0 and 100.
	 */
	quality: number;
	onerror: "redirect";
	metadata: "keep" | "copyright" | "none";
	format: "avif" | "webp" | "jpeg";
	compression: "fast";
	fit: "scale-down" | "contain" | "cover" | "crop" | "pad";
}

const defaultOptions: Partial<ImageOptions> = {
	onerror: "redirect",
	metadata: "none",
	format: "avif",
	fit: "scale-down",
	quality: 80
};

export function getImage(id: string, options: Partial<ImageOptions> = {}) {
	return `https://files.aries.fyi/cdn-cgi/image/${Object.entries({
		...defaultOptions,
		...options
	})
		.filter(([, value]) => value !== undefined)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => `${key}=${value.toString()}`)
		.join(",")}/${getFile(id)}`;
}

export function getShortFileId(id: string) {
	return id.split("/").reverse()[0];
}

async function* streamToAsyncIterable(stream: ReadableStream) {
	const reader = stream.getReader();

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) return;
			yield value;
		}
	} finally {
		reader.releaseLock();
	}
}

export async function downloadFile(id: string, onProgress?: Dispatch<number>) {
	const response = await fetch(getFile(id));
	if (!response.ok || !response.body) return null;

	const type =
		response.headers.get("content-type") || "application/octet-stream";
	const size = Number.parseFloat(response.headers.get("content-length") || "0");

	let responseSize = 0;
	const chunks: Array<BlobPart> = [];

	for await (const chunk of streamToAsyncIterable(response.body)) {
		responseSize += chunk.length;

		onProgress?.((responseSize / size) * 100);
		chunks.push(chunk);
	}

	return new Blob(chunks, { type });
}

export function saveFile(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");

	anchor.href = url;
	anchor.download = filename;
	anchor.click();

	anchor.remove();
	URL.revokeObjectURL(url);
}

export function encodeFileId(id: string) {
	return btoa(id).replaceAll("/", "-");
}

export function decodeFileId(id: string) {
	return atob(id.replaceAll("-", "/"));
}
