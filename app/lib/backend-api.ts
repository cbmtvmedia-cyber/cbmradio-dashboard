import { NextResponse } from "next/server";
import {
  backendAuthFailure,
  getApiError,
  readJsonResponse,
} from "./backend-auth";

type JsonRecord = Record<string, unknown>;
type Transformer = (item: JsonRecord) => JsonRecord;

export function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

export function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function bool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function number(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function forwardBackendResponse(
  response: Response,
  transform?: Transformer,
) {
  const authFailure = await backendAuthFailure(response);
  if (authFailure) return authFailure;

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await readJsonResponse(response);
  if (!response.ok) {
    return NextResponse.json(
      { error: getApiError(data, "The backend rejected this request."), details: data },
      { status: response.status },
    );
  }

  if (!transform) return NextResponse.json(data, { status: response.status });

  const results = Array.isArray(data.results)
    ? data.results.map((item) => transform(asRecord(item)))
    : undefined;
  if (results) return NextResponse.json({ ...data, results }, { status: response.status });

  return NextResponse.json(transform(data), { status: response.status });
}

export function requestError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

