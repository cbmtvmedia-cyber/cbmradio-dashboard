import { NextResponse } from "next/server";
import { asRecord } from "./backend-api";
import { readJsonResponse } from "./backend-auth";

type Transformer = (item: Record<string, unknown>) => Record<string, unknown>;

export function requestIsMultipart(request: Request) {
  return (request.headers.get("content-type") || "").includes(
    "multipart/form-data",
  );
}

export async function preserveBackendResponse(
  response: Response,
  transform: Transformer,
) {
  if (response.status === 204) return new NextResponse(null, { status: 204 });
  const data = await readJsonResponse(response);
  if (!response.ok) return NextResponse.json(data, { status: response.status });
  if (Array.isArray(data.results)) {
    return NextResponse.json(
      { ...data, results: data.results.map((item) => transform(asRecord(item))) },
      { status: response.status },
    );
  }
  return NextResponse.json(transform(data), { status: response.status });
}
