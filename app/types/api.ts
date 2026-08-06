export type PaginatedResponse<T> = { count: number; next: string | null; previous: string | null; results: T[] };
export type NormalizedApiError = { status: number; message: string; fieldErrors?: Record<string, string[]>; code?: string };
