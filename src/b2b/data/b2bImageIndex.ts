export type B2BImageIndex = Record<string, string[]>;

type B2BImageIndexPayload = {
  byCode?: Record<string, string[]>;
};

export function normalizeB2BCodeKey(value: string): string {
  return (value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function getIndexedCandidates(
  imageIndexByCode: B2BImageIndex,
  code: string,
  allowedPrefixes: string[]
): string[] {
  const key = normalizeB2BCodeKey(code);
  if (!key) return [];

  const candidates = imageIndexByCode[key] ?? [];
  if (!allowedPrefixes.length) return candidates;

  const filtered = candidates.filter((candidate) => allowedPrefixes.some((prefix) => candidate.startsWith(prefix)));
  return filtered.length > 0 ? filtered : candidates;
}

export async function loadB2BImageIndex(): Promise<B2BImageIndex> {
  const response = await fetch("/data/b2b-image-index.json");
  if (!response.ok) return {};

  const payload = (await response.json()) as B2BImageIndexPayload;
  if (!payload || typeof payload !== "object") return {};
  return payload.byCode ?? {};
}
