"use client";

import { useInView } from "@ariesclark/react-hooks";
import { Slot } from "@radix-ui/react-slot";
import { Download, Expand, LoaderCircle, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition, type Dispatch, type FC } from "react";
import { twMerge } from "tailwind-merge";

import {
	downloadFile,
	getFile,
	getImage,
	getShortFileId,
	saveFile
} from "~/utilities";

import type { ContentType, File } from "~/r2";

export interface Size {
	width: number;
	height: number;
}

export interface ObjectMetadata {
	type: ContentType;
	size: Size;
}

export interface ObjectViewerProps extends File {
	kind?: "preview" | "full" | "original";
	className?: string;
	onLoad?: (metadata: ObjectMetadata) => void;
}

export const ObjectViewer: FC<ObjectViewerProps> = ({
	id,
	type,
	kind = "full",
	className,
	onLoad
}) => {
	const reference = useRef<HTMLElement>(null);
	const [loaded, setLoaded] = useState(false);

	const [size, setSize] = useState<Size | null>(null);

	const [seen, setSeen] = useState(false);
	const inView = useInView(reference);

	if (inView && !seen) setSeen(true);

	const priority = kind !== "preview" || inView;
	const quality = kind === "preview" ? 50 : 98;

	return (
		<Slot
			ref={reference}
			className={twMerge(
				"object-contain transition-opacity duration-500",
				loaded ? "opacity-100" : "opacity-0",
				className
			)}
		>
			{
				{
					image: (
						<Image
							fill
							alt=""
							className=""
							fetchPriority={priority ? "high" : "low"}
							loading={priority ? "eager" : "lazy"}
							priority={priority}
							quality={quality}
							src={id}
							style={size ? { aspectRatio: size.width / size.height } : {}}
							loader={({ src: id, width, quality }) =>
								kind === "original"
									? getFile(id)
									: getImage(id, { width, quality })
							}
							sizes={
								kind === "preview"
									? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									: "100vw"
							}
							onLoad={({ currentTarget }) => {
								const { naturalWidth, naturalHeight } = currentTarget;

								setLoaded(true);
								setSize({
									width: naturalWidth,
									height: naturalHeight
								});

								onLoad?.({
									type: "image",
									size: {
										width: naturalWidth,
										height: naturalHeight
									}
								});
							}}
						/>
					),
					video: (
						<video
							disablePictureInPicture
							disableRemotePlayback
							loop
							muted
							autoPlay={kind !== "preview"}
							className="size-full object-contain"
							controls={false}
							controlsList="nodownload nofullscreen noremoteplayback"
							preload={priority ? "auto" : "metadata"}
							src={seen ? getFile(id) : undefined}
							style={size ? { aspectRatio: size.width / size.height } : {}}
							onCanPlay={({ currentTarget }) => {
								const { videoWidth, videoHeight } = currentTarget;

								setLoaded(true);
								setSize({
									width: videoWidth,
									height: videoHeight
								});

								onLoad?.({
									type: "video",
									size: {
										width: videoWidth,
										height: videoHeight
									}
								});
							}}
							onPointerEnter={({ currentTarget }) => {
								if (kind !== "preview") return;

								currentTarget.currentTime = 0;
								void currentTarget.play();
							}}
							onPointerLeave={({ currentTarget }) => {
								if (kind !== "preview") return;

								currentTarget.pause();
								currentTarget.currentTime = 0;
							}}
						/>
					),
					unknown: (
						<div className="size-full object-cover transition-opacity duration-500" />
					)
				}[type]
			}
		</Slot>
	);
};

export const DownloadObject: FC<
	Pick<ObjectViewerProps, "id"> & {
		className?: string;
		onDownloadStart?: VoidFunction;
		onDownloadComplete?: VoidFunction;
		onProgress?: Dispatch<number>;
	}
> = ({ id, className, onProgress, onDownloadStart, onDownloadComplete }) => {
	const [pending, startTransition] = useTransition();

	const Icon = pending ? LoaderCircle : Download;

	return (
		<button
			className={twMerge("pointer-events-auto", className)}
			type="button"
			onClick={(event) => {
				event.stopPropagation();
				onDownloadStart?.();

				startTransition(async () => {
					const blob = await downloadFile(id, onProgress);
					if (!blob) return;

					saveFile(blob, getShortFileId(id));
					onDownloadComplete?.();
				});
			}}
		>
			<Icon
				className={twMerge("size-5 opacity-75", pending && "animate-spin")}
			/>
		</button>
	);
};

export const ObjectItem: FC<Omit<ObjectViewerProps, "kind">> = (object) => {
	const [metadata, setMetadata] = useState<ObjectMetadata | null>(null);
	const [progress, setProgress] = useState(0);

	return (
		<div className="group relative flex aspect-video h-auto w-full items-center justify-center overflow-hidden rounded-md border border-b-2 border-white/5 bg-white/5 transition-all hover:border-white/10 hover:bg-white/10">
			<ObjectViewer {...object} kind="preview" onLoad={setMetadata} />
			{metadata && (
				<>
					<div className="pointer-events-none absolute inset-4 z-10 flex flex-col justify-between gap-2">
						<div className="flex justify-between gap-2">
							{metadata.type === "video" && (
								<div className="flex h-fit items-center gap-2 text-xs opacity-75">
									<Play className="size-5" fill="currentColor" />
									Video
								</div>
							)}
							<div className="ml-auto flex flex-col gap-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
								<Link
									className="pointer-events-auto"
									href={`/view/${object.id}`}
									prefetch={false}
								>
									<Expand className="size-5 opacity-75" />
								</Link>
								<DownloadObject
									className="pointer-events-auto"
									id={object.id}
									onProgress={setProgress}
								/>
							</div>
						</div>
					</div>
					{progress !== 0 && progress !== 100 && (
						<div className="absolute inset-x-0 top-0 h-1">
							<div
								className="h-full bg-pink-500"
								style={{ width: `${progress}%` }}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};
