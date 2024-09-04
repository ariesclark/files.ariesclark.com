"use client";

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ViewFileNavigation() {
	const router = useRouter();

	return (
		<>
			<div className="flex items-center gap-8">
				<button
					className="pointer-events-auto flex items-center gap-2"
					type="button"
					onClick={() => router.back()}
				>
					<MoveLeft className="size-6" />
					<span className="">Back</span>
				</button>
				{/* <div className="flex flex-col">
							<span>{object.key.split("/").reverse()[0]}</span>
							<span className="text-xs tabular-nums opacity-75">
								{relativeTime(object.uploaded)} · {prettyBytes(object.size)} ·{" "}
								{object.httpMetadata.contentType}
							</span>
						</div> */}
			</div>
			{/* {zoom !== 1 && (
						<button
							className="pointer-events-auto flex items-center gap-4 tabular-nums"
							type="button"
							onClick={() => {
								zoomer.current?.centerView(1);
								setZoom(1);
							}}
						>
							<div className="flex flex-col text-right">
								<span>{toOptionalFixed(zoom, 2)}x</span>
								<span className="text-xs opacity-75">
									{Math.floor(offset.x)} left · {Math.floor(offset.y)} down
								</span>
							</div>
							<SquareDashedMousePointer className="size-6" />
						</button> 
					)}*/}
		</>
	);
}
