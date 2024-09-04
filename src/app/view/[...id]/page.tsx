import { getObject } from "~/r2";

import { FileContent } from "./content";

export interface FilePageProps {
	params: { id: Array<string> };
}

export const runtime = "edge";

export default async function FilePage({ params }: FilePageProps) {
	const id = params.id.join("/");

	const object = await getObject(id);
	if (!object) return null;

	return (
		<>
			<FileContent object={object} />
			{/* <div className="container mx-auto flex shrink-0 flex-col gap-8 p-8 px-4 lg:px-8">
				<span>Similar files</span>
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{mock.objects
						.filter(({ key }) => {
							return getShortFileId(id)
								.toLowerCase()
								.split(/_|-/)
								.some((part) => key.toLowerCase().includes(part));
						})
						.map(({ key, httpMetadata: { contentType } }) => (
							<ObjectItem id={key} key={key} mime={contentType} />
						))}
				</div>
			</div> */}
		</>
	);
}
