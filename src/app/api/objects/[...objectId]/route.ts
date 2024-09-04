import { getObject } from "~/r2";

import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
	request: NextRequest,
	{ params: { objectId: _objectId } }: { params: { objectId: Array<string> } }
) {
	const id = _objectId.join("/");
	const object = await getObject(id);
	if (!object)
		return Response.json(
			{ error: "Object not found", object: id },
			{ status: 404 }
		);

	return Response.json(object);
}
