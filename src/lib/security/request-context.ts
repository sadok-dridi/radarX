import "server-only";

import { headers } from "next/headers";

function pickFirstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || "unknown";
}

export async function getRequestIp() {
  const requestHeaders = await headers();

  return pickFirstHeaderValue(
    requestHeaders.get("x-forwarded-for")
      ?? requestHeaders.get("x-real-ip")
      ?? requestHeaders.get("cf-connecting-ip"),
  );
}
