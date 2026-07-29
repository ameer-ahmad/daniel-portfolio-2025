/**
 * Downloads a still frame for every Vimeo video referenced in data/videoSources.ts
 * and saves it to public/images/posters.
 *
 * A Vimeo iframe cannot be preloaded: it has to boot the player, fetch its
 * config and then a media segment before the first frame appears. A local poster
 * is the only way to put something on screen immediately, so it is fetched at
 * author time rather than at runtime.
 *
 * Run this before optimize-images.mjs, which turns the stills into WebP variants.
 *
 * Usage:  npm run media:posters      (requires: npm install --save-dev sharp)
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCES_FILE = path.join(ROOT, "data", "videoSources.ts");
const POSTER_DIR = path.join(ROOT, "public", "images", "posters");
const MANIFEST_PATH = path.join(ROOT, "data", "generated", "mediaManifest.json");
const POSTER_WIDTH = 1920;
const JPEG_QUALITY = 82;

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    console.error(
      "\nThis script needs sharp. Install it as a dev dependency first:\n\n  npm install --save-dev sharp\n"
    );
    process.exit(1);
  }
}

function extractVimeoVideos(source) {
  const pattern =
    /https:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:\/([A-Za-z0-9]+))?/g;
  const byId = new Map();

  for (const match of source.matchAll(pattern)) {
    const [url, id, hash] = match;
    if (!byId.has(id)) byId.set(id, { id, hash, url });
  }

  return [...byId.values()];
}

async function fetchThumbnail({ id, url }) {
  const endpoint = new URL("https://vimeo.com/api/oembed.json");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("width", String(POSTER_WIDTH));

  const oembed = await fetch(endpoint);
  if (!oembed.ok) {
    throw new Error(`oEmbed returned ${oembed.status} for video ${id}`);
  }

  const data = await oembed.json();
  if (!data.thumbnail_url) {
    throw new Error(`No thumbnail available for video ${id}`);
  }

  const image = await fetch(data.thumbnail_url);
  if (!image.ok) {
    throw new Error(`Thumbnail returned ${image.status} for video ${id}`);
  }

  return Buffer.from(await image.arrayBuffer());
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return { images: {}, posters: {} };
  }
}

async function alreadyDownloaded(id) {
  try {
    const files = await readdir(POSTER_DIR);
    return files.includes(`${id}.jpg`);
  } catch {
    return false;
  }
}

async function main() {
  const sharp = await loadSharp();
  const source = await readFile(SOURCES_FILE, "utf8");
  const videos = extractVimeoVideos(source);

  if (videos.length === 0) {
    console.log("No Vimeo URLs found in data/videoSources.ts.");
    return;
  }

  await mkdir(POSTER_DIR, { recursive: true });

  const manifest = await readManifest();
  manifest.posters = manifest.posters ?? {};
  manifest.images = manifest.images ?? {};

  const force = process.argv.includes("--force");
  let downloaded = 0;
  let reused = 0;
  const failures = [];

  for (const video of videos) {
    const outputPath = path.join(POSTER_DIR, `${video.id}.jpg`);

    try {
      if (!force && (await alreadyDownloaded(video.id))) {
        reused += 1;
      } else {
        const original = await fetchThumbnail(video);
        await sharp(original)
          .resize({ width: POSTER_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY })
          .toFile(outputPath);
        downloaded += 1;
      }

      const metadata = await sharp(outputPath).metadata();
      manifest.posters[video.id] = {
        url: `/images/posters/${video.id}.jpg`,
        width: metadata.width ?? POSTER_WIDTH,
        height: metadata.height ?? 0,
      };

      console.log(`${video.id} → /images/posters/${video.id}.jpg`);
    } catch (error) {
      failures.push(`${video.id}: ${error.message}`);
    }
  }

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(
    [
      "",
      `Downloaded: ${downloaded}`,
      `Reused:     ${reused} (pass --force to refetch)`,
      `Failed:     ${failures.length}`,
    ].join("\n")
  );

  failures.forEach((failure) => console.error(`  ${failure}`));

  console.log("\nNow run: npm run media:images");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
