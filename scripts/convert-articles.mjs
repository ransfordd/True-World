import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const legacyArticlesDir = path.join(root, "_legacy", "articles-pages");
const legacyListing = path.join(root, "_legacy", "articles.html");
const outDir = path.join(root, "content", "articles");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function escapeYaml(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ")
    .trim();
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    const t = stripTags(h1[1]);
    if (t) return t;
  }
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) {
    return stripTags(title[1])
      .replace(/\s*\|\s*THE TRUE WORD\s*$/i, "")
      .trim();
  }
  return "Untitled";
}

function extractDescription(html) {
  const meta = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i
  );
  if (meta) return decodeEntities(meta[1]).trim();
  const meta2 = html.match(
    /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i
  );
  if (meta2) return decodeEntities(meta2[1]).trim();
  return "";
}

/** Find matching closing tag for an open tag at openEnd (index after `>` of open tag). */
function findMatchingClose(html, openTagName, openEnd) {
  const openRe = new RegExp(`<${openTagName}\\b[^>]*>`, "gi");
  const closeRe = new RegExp(`</${openTagName}\\s*>`, "gi");
  let depth = 1;
  let i = openEnd;
  while (i < html.length && depth > 0) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const nextOpen = openRe.exec(html);
    const nextClose = closeRe.exec(html);
    if (!nextClose) return -1;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      i = nextOpen.index + nextOpen[0].length;
    } else {
      depth -= 1;
      if (depth === 0) return nextClose.index;
      i = nextClose.index + nextClose[0].length;
    }
  }
  return -1;
}

function extractInnerByClassContains(html, classFragment) {
  const re = new RegExp(
    `<div\\b([^>]*class=["'][^"']*${classFragment}[^"']*["'][^>]*)>`,
    "i"
  );
  const m = re.exec(html);
  if (!m) return null;
  const openEnd = m.index + m[0].length;
  const closeIdx = findMatchingClose(html, "div", openEnd);
  if (closeIdx < 0) return null;
  return html.slice(openEnd, closeIdx).trim();
}

function extractArticleBody(html) {
  const byClass = extractInnerByClassContains(html, "text-gray-300 leading-relaxed");
  if (byClass) return byClass;

  const articleMatch = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    const articleInner = articleMatch[1];
    const prose = extractInnerByClassContains(articleInner, "prose");
    if (prose) {
      const nested = extractInnerByClassContains(prose, "text-gray-300");
      if (nested) return nested;
      return prose;
    }
    return articleInner
      .replace(/<nav\b[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer\b[\s\S]*?<\/footer>/gi, "")
      .trim();
  }

  const main = html.match(/<div\s+id=["']mainContent["'][^>]*>([\s\S]*?)<footer/i);
  if (main) {
    return main[1]
      .replace(/<nav\b[\s\S]*?<\/nav>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();
  }

  return "";
}

function mapImagePath(src) {
  if (!src) return "";
  let s = src.trim().replace(/\\/g, "/");
  s = s.replace(/^\.\//, "/").replace(/^\.\.\//, "/");
  if (s.startsWith("images/")) s = "/" + s;
  if (s.startsWith("./images/")) s = s.replace("./images/", "/images/");
  if (s.includes("/images/")) {
    const idx = s.indexOf("/images/");
    s = s.slice(idx);
  } else if (!s.startsWith("/")) {
    s = "/images/" + s.replace(/^\/+/, "");
  }
  // encode spaces but keep path readable for manifest; use encodeURI on filename parts
  try {
    const u = new URL(s, "https://example.com");
    const parts = u.pathname.split("/").map((p) => encodeURIComponent(decodeURIComponent(p)));
    return parts.join("/").replace(/%2F/gi, "/");
  } catch {
    return s.replace(/ /g, "%20");
  }
}

function toJsxFriendlyHtml(html) {
  let out = html;

  // Remove HTML comments
  out = out.replace(/<!--[\s\S]*?-->/g, "");

  // class -> className (attribute only)
  out = out.replace(/\sclass=/gi, " className=");

  // for -> htmlFor on labels
  out = out.replace(/<label([^>]*)\sfor=/gi, "<label$1 htmlFor=");

  // Self-close void elements that aren't already closed
  const voids = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ];
  for (const tag of voids) {
    out = out.replace(new RegExp(`<${tag}\\b([^>]*)>`, "gi"), (match, attrs) => {
      if (/\/>\s*$/.test(match)) return match.replace(/\s*\/>\s*$/, " />");
      const cleaned = String(attrs || "").replace(/\/\s*$/, "").trimEnd();
      return cleaned ? `<${tag}${cleaned} />` : `<${tag} />`;
    });
  }

  // Fix double spaces before />
  out = out.replace(/\s+\/>/g, " />");

  // Escape curly braces for MDX (outside of already-escaped contexts)
  out = out.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");

  // Soft-fix mojibake from legacy HTML (? for apostrophes/dashes/quotes)
  out = out
    .replace(/([A-Za-z])\?(s|t|re|ll|ve|d|m)\b/g, "$1'$2")
    .replace(/ \? /g, " — ")
    .replace(/([A-Za-z])\?(\s)/g, "$1”$2")
    .replace(/([>\s(])\?([A-Za-z])/g, "$1“$2")
    .replace(/\?\?/g, "—");

  return out.trim();
}

function buildManifest() {
  const listing = fs.readFileSync(legacyListing, "utf8");
  const articles = [];
  // Each card is an <article>...</article> in the grid
  const cardRe = /<article\b[^>]*>([\s\S]*?)<\/article>/gi;
  let m;
  while ((m = cardRe.exec(listing)) !== null) {
    const card = m[1];
    const link = card.match(
      /href=["']\.\/articles-pages\/([^"']+?)\.html["']/i
    );
    if (!link) continue;
    const slug = link[1];
    const img = card.match(/<img[^>]+src=["']([^"']+)["']/i);
    const h3 = card.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const alt = card.match(/alt=["']([^"']+)["']/i);
    const title = h3 ? stripTags(h3[1]) : alt ? decodeEntities(alt[1]).trim() : slug;
    const image = img ? mapImagePath(img[1]) : "";
    articles.push({ slug, title, image });
  }

  // Dedupe by slug (keep first)
  const seen = new Set();
  const unique = [];
  for (const a of articles) {
    if (seen.has(a.slug)) continue;
    seen.add(a.slug);
    unique.push(a);
  }
  return unique;
}

function writeMdx(slug, title, description, image, bodyHtml) {
  const jsxBody = toJsxFriendlyHtml(bodyHtml);
  const content = `---
title: "${escapeYaml(title)}"
description: "${escapeYaml(description)}"
image: "${escapeYaml(image || "")}"
---

<>
${jsxBody}
</>
`;
  const outPath = path.join(outDir, `${slug}.mdx`);
  fs.writeFileSync(outPath, content, "utf8");
  return outPath;
}

function applyManifestImages(manifest) {
  const bySlug = new Map(manifest.map((a) => [a.slug, a]));
  let updated = 0;
  for (const file of fs.readdirSync(outDir)) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    const entry = bySlug.get(slug);
    if (!entry?.image) continue;
    const full = path.join(outDir, file);
    let text = fs.readFileSync(full, "utf8");
    const next = text.replace(
      /^image:\s*"[^"]*"/m,
      `image: "${escapeYaml(entry.image)}"`
    );
    if (next !== text) {
      fs.writeFileSync(full, next, "utf8");
      updated += 1;
    }
  }
  return updated;
}

function main() {
  ensureDir(outDir);
  ensureDir(path.join(root, "scripts"));

  if (!fs.existsSync(legacyArticlesDir)) {
    console.error("Missing directory:", legacyArticlesDir);
    process.exit(1);
  }

  const manifest = buildManifest();
  const manifestPath = path.join(outDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`Wrote manifest with ${manifest.length} entries -> ${manifestPath}`);

  const files = fs
    .readdirSync(legacyArticlesDir)
    .filter((f) => f.toLowerCase().endsWith(".html"))
    .sort();

  const results = { ok: [], fail: [], emptyBody: [] };
  const imageBySlug = new Map(manifest.map((a) => [a.slug, a.image || ""]));

  for (const file of files) {
    const slug = file.replace(/\.html$/i, "");
    const full = path.join(legacyArticlesDir, file);
    try {
      const html = fs.readFileSync(full, "utf8");
      const title = extractTitle(html);
      const description = extractDescription(html);
      const body = extractArticleBody(html);
      if (!body) {
        results.emptyBody.push(slug);
        console.warn(`WARN: empty body for ${slug}`);
      }
      const image = imageBySlug.get(slug) || "";
      writeMdx(slug, title, description, image, body || "<p>Content unavailable.</p>");
      results.ok.push(slug);
      console.log(`OK  ${slug}`);
    } catch (err) {
      results.fail.push({ slug, error: String(err?.stack || err) });
      console.error(`FAIL ${slug}:`, err);
    }
  }

  const imageUpdates = applyManifestImages(manifest);
  console.log(`\nUpdated image frontmatter on ${imageUpdates} MDX files from manifest.`);

  console.log("\n=== Summary ===");
  console.log(`HTML sources: ${files.length}`);
  console.log(`MDX created:  ${results.ok.length}`);
  console.log(`Failures:     ${results.fail.length}`);
  console.log(`Empty bodies: ${results.emptyBody.length}`);
  if (results.fail.length) {
    for (const f of results.fail) console.error(f);
    process.exitCode = 1;
  }
}

main();
