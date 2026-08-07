import fs from "fs";
import path from "path";
import type { CmsStore } from "./types";

const DATA_DIR = process.env.CMS_DATA_DIR
  ? path.resolve(process.env.CMS_DATA_DIR)
  : path.join(process.cwd(), "data", "cms");

const STORE_PATH = path.join(DATA_DIR, "store.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const uploads = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploads)) {
    fs.mkdirSync(uploads, { recursive: true });
  }
}

export function getCmsDataDir() {
  return DATA_DIR;
}

export function getStorePath() {
  return STORE_PATH;
}

export function defaultEmptyStore(): CmsStore {
  return {
    version: 1,
    users: [],
    media: [],
    articles: [],
    testimonials: [],
    resources: [],
    dailyTruths: [],
    coachingPackages: [],
    courseTiers: [],
    settings: {
      name: "THE TRUE WORD",
      tagline: "Spreading Light. Speaking Truth.",
      email: "info@thetrueword.com",
      website: "https://www.thetrueword-gh.com",
      instagram: "https://www.instagram.com/thetrueword2025",
      instagramHandle: "@thetrueword2025",
      youtube: "https://www.youtube.com/@THETRUEWORDBYERICPADDYBOSO",
      youtubeFeaturedVideoId: "",
      logo: "/images/logo.png.png",
    },
  };
}

export function readStore(): CmsStore {
  ensureDir();
  if (!fs.existsSync(STORE_PATH)) {
    return defaultEmptyStore();
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw) as CmsStore;
  } catch {
    return defaultEmptyStore();
  }
}

export function writeStore(store: CmsStore): void {
  ensureDir();
  const tmp = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2), "utf8");
  fs.renameSync(tmp, STORE_PATH);
}

export function newId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function storeHasContent(store: CmsStore): boolean {
  return (
    store.articles.length > 0 ||
    store.testimonials.length > 0 ||
    store.users.length > 0
  );
}
