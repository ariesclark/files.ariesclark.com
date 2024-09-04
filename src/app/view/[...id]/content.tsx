"use client";

import { useRef, useState, type CSSProperties, type FC } from "react";
import { flushSync } from "react-dom";
import {
	TransformComponent,
	TransformWrapper,
	type ReactZoomPanPinchContentRef
} from "react-zoom-pan-pinch";

import { ObjectViewer, type ObjectMetadata } from "~/app/object";

import type { File } from "~/r2";

export const FileContent: FC<{ object: File }> = ({ object }) => {
	const zoomer = useRef<ReactZoomPanPinchContentRef>(null);

	const [metadata, setMetadata] = useState<ObjectMetadata | null>(null);
	const [showOriginal, setShowOriginal] = useState(false);

	const [zoom, setZoom] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	return (
		<div
			className="relative max-h-[80svh] min-h-[40svh] w-svw shrink-0 border-b border-white/5 bg-black/20 delay-500"
			style={
				{
					aspectRatio: metadata
						? metadata.size.width / metadata.size.height
						: undefined
				} as CSSProperties
			}
		>
			<TransformWrapper
				centerOnInit
				//limitToBounds
				smooth
				minScale={0.25}
				ref={zoomer}
				wheel={{ step: 0.2 }}
				onTransformed={({ state }) => {
					setZoom(state.scale);
					setOffset({ x: -state.positionX, y: -state.positionY });
				}}
			>
				<TransformComponent
					contentClass="max-h-full"
					wrapperClass="!size-full !absolute inset-0 overflow-hidden"
					contentStyle={
						metadata
							? {
									aspectRatio: metadata.size.width / metadata.size.height,
									...(metadata.type === "image"
										? { height: metadata.size.height }
										: {})
								}
							: {}
					}
				>
					<ObjectViewer
						{...object}
						className="object-scale-down"
						kind={showOriginal ? "original" : "full"}
						onLoad={(metadata) => {
							flushSync(() => setMetadata(metadata));
							zoomer.current?.centerView(1, 0);
						}}
					/>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};
