import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "content", "articles");

const featured = [
  "a-biblical-story-that-still-speaks",
  "a-public-warning-to-humanity",
  "are-you-living-in-a-way-that-prepares-you-for-eternity",
  "mindset",
];

function fixSafe(text) {
  return (
    text
      // You're / don't / God's / I'll / we've / I'd / I'm
      .replace(/([A-Za-z])\?(s|t|re|ll|ve|d|m)\b/g, "$1'$2")
      // Em-dash sequences that became " ? "
      .replace(/ \? /g, " — ")
      // Closing quote / dash before space: word?"  or word? sho
      .replace(/([A-Za-z])\?(\s)/g, "$1”$2")
      // Opening quote after space/punct: on ?voice
      .replace(/([>\s(])\?([A-Za-z])/g, "$1“$2")
      // Double question often meant em dash
      .replace(/\?\?/g, "—")
  );
}

let updated = 0;
const targets = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

for (const file of targets) {
  const slug = file.replace(/\.mdx$/, "");
  const full = path.join(dir, file);
  const before = fs.readFileSync(full, "utf8");
  const after = fixSafe(before);
  if (after !== before) {
    fs.writeFileSync(full, after, "utf8");
    updated += 1;
    const tag = featured.includes(slug) ? " (featured)" : "";
    console.log(`fixed ${slug}${tag}`);
  }
}

console.log(`\nfiles updated: ${updated}`);
for (const slug of featured) {
  const t = fs.readFileSync(path.join(dir, `${slug}.mdx`), "utf8");
  const leftover = (t.match(/\?/g) || []).length;
  console.log(`${slug} remaining ?: ${leftover}`);
}
