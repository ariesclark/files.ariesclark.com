import { listObjects } from "~/r2";

import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET({ nextUrl }: NextRequest) {
	const objects = await listObjects({
		before: new Date(Number.parseInt(nextUrl.searchParams.get("before") || "")),
		after: new Date(Number.parseInt(nextUrl.searchParams.get("after") || ""))
	});

	return Response.json(objects);
}
