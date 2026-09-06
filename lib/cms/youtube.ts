/**
 * Normalize a YouTube watch URL, youtu.be link, or raw ID to an 11-char video ID.
 * Returns the trimmed input if it is already an ID-like string, or "" if empty.
 */
export function extractYoutubeVideoId(input: string): string {
  const raw = input.trim();
  if (!raw) return "";

  // Already a bare ID (YouTube IDs are typically 11 chars)
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] || "";
      return id.split("?")[0];
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = url.searchParams.get("v");
      if (v) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      // /embed/ID or /shorts/ID or /live/ID
      if (
        parts.length >= 2 &&
        (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live")
      ) {
        return parts[1];
      }
    }
  } catch {
    /* not a URL */
  }

  // Fallback: extract v= from a messy paste
  const match = raw.match(/[?&]v=([\w-]{11})/);
  if (match) return match[1];

  return raw;
}
