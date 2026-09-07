import path from "path";

export function getUploadsDir() {
  return path.join(process.cwd(), "public", "uploads");
}

/** Map a stored URL like /uploads/foo.jpg to an absolute file path under public/uploads. */
export function uploadUrlToFilePath(url: string): string | null {
  if (!url.startsWith("/uploads/")) return null;
  const relative = url.slice("/uploads/".length);
  const parts = relative.split("/").filter(Boolean);
  if (
    !parts.length ||
    parts.some((p) => p === "." || p === ".." || p.includes("\0"))
  ) {
    return null;
  }
  const root = path.resolve(getUploadsDir());
  const filePath = path.resolve(root, ...parts);
  if (!filePath.startsWith(root + path.sep) && filePath !== root) {
    return null;
  }
  return filePath;
}
