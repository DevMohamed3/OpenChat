export function isAllowedOrigin(origin?: string) {
  if (!origin) return true;

  try {
    const { hostname } = new URL(origin);

    const configuredAllowlist = process.env.ZEROZONE_ALLOWED_ORIGINS?.trim();
    if (configuredAllowlist) {
      const entries = configuredAllowlist
        .split(/[,\s]+/g)
        .map((v) => v.trim())
        .filter(Boolean);

      const exactHostnames: string[] = [];
      const suffixHostnames: string[] = [];

      for (const entry of entries) {
        let host = entry;
        try {
          host = new URL(entry).hostname;
        } catch {
          // Allow passing raw hostnames like "example.com" or patterns like "*.example.com".
        }

        host = host.trim().toLowerCase();
        if (!host) continue;

        if (host.startsWith("*.") || host.startsWith(".")) {
          suffixHostnames.push(host.replace(/^\*\./, "."));
        } else {
          exactHostnames.push(host.replace(/^\./, ""));
        }
      }

      const lowerHostname = hostname.toLowerCase();
      if (exactHostnames.includes(lowerHostname)) return true;
      if (suffixHostnames.some((suffix) => lowerHostname.endsWith(suffix))) return true;
    }

    const isDev = process.env.NODE_ENV !== "production";

    if (isDev) {
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return true;
      }
    }

    if (
      hostname === "0zone.site" ||
      hostname === "www.0zone.site" ||
      hostname.endsWith(".0zone.site") ||
      hostname.endsWith(".qzz.io")
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
