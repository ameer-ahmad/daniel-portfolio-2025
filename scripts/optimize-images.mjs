/**
 * Generates responsive WebP variants for everything under public/images and
 * records them in data/generated/mediaManifest.json.
 *
 * The site deploys as a static export to GitHub Pages, which forces
 * `images.unoptimized`, so Next.js will never resize or re-encode anything at
 * request time. This script is that missing step. Its output is committed, and
 * the app falls back to the original files whenever a variant is absent.
 *
 * Usage:  npm run media:images       (requires: npm install --save-dev sharp)
 */

import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");
const OUTPUT_DIRNAME = "opt";
const OUTPUT_DIR = path.join(IMAGES_DIR, OUTPUT_DIRNAME);
const MANIFEST_PATH = path.join(ROOT, "data", "generated", "mediaManifest.json");

const TARGET_WIDTHS = [640, 1024, 1440, 1920];
const MAX_WIDTH = 2560;
const WEBP_QUALITY = 78;
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
/** Consumed by crawlers at a fixed size, so leave it exactly as authored. */
const EXCLUDED_FILES = new Set(["open-graph.png"]);

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

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === OUTPUT_DIRNAME) continue;
      yield* walk(full);
      continue;
    }

    yield full;
  }
}

function publicUrl(absolutePath) {
  const relative = path.relative(PUBLIC_DIR, absolutePath);
  return `/${relative.split(path.sep).join("/")}`;
}

function variantWidths(sourceWidth) {
  const largest = Math.min(sourceWidth, MAX_WIDTH);
  const widths = TARGET_WIDTHS.filter((width) => width < largest);
  widths.push(largest);
  return widths;
}

async function isUpToDate(outputPath, sourceModifiedMs) {
  try {
    const output = await stat(outputPath);
    return output.mtimeMs >= sourceModifiedMs;
  } catch {
    return false;
  }
}

/** A 24px blurred still, inlined so the slot is never empty while bytes arrive. */
async function makeBlurDataURL(sharp, file) {
  const buffer = await sharp(file)
    .resize({ width: 24 })
    .blur(1.5)
    .jpeg({ quality: 45 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return { images: {}, posters: {} };
  }
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  const sharp = await loadSharp();
  const manifest = await readManifest();

  const images = {};
  let created = 0;
  let skipped = 0;
  let sourceBytes = 0;
  let largestVariantBytes = 0;

  for await (const file of walk(IMAGES_DIR)) {
    const extension = path.extname(file).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(extension)) continue;
    if (EXCLUDED_FILES.has(path.basename(file))) continue;

    const source = await stat(file);
    const metadata = await sharp(file).metadata();
    if (!metadata.width || !metadata.height) continue;

    const relativeDir = path.relative(IMAGES_DIR, path.dirname(file));
    const outputDir = path.join(OUTPUT_DIR, relativeDir);
    await mkdir(outputDir, { recursive: true });

    const base = path.basename(file, extension);
    const variants = [];
    let widestBytes = 0;

    for (const width of variantWidths(metadata.width)) {
      const outputPath = path.join(outputDir, `${base}-${width}.webp`);

      if (await isUpToDate(outputPath, source.mtimeMs)) {
        skipped += 1;
      } else {
        await sharp(file)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(outputPath);
        created += 1;
      }

      const output = await stat(outputPath);
      widestBytes = Math.max(widestBytes, output.size);
      variants.push({ url: publicUrl(outputPath), width });
    }

    sourceBytes += source.size;
    largestVariantBytes += widestBytes;

    const entry = {
      width: metadata.width,
      height: metadata.height,
      variants,
    };

    if (extension === ".jpg" || extension === ".jpeg") {
      entry.blurDataURL = await makeBlurDataURL(sharp, file);
    }

    images[publicUrl(file)] = entry;
    console.log(`${publicUrl(file)} → ${variants.length} variants`);
  }

  manifest.images = images;
  manifest.posters = manifest.posters ?? {};

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(
    [
      "",
      `Sources:            ${Object.keys(images).length} files, ${formatBytes(sourceBytes)}`,
      `Largest variants:   ${formatBytes(largestVariantBytes)}`,
      `Variants written:   ${created} (${skipped} already current)`,
      "",
      "Commit public/images/opt and data/generated/mediaManifest.json.",
    ].join("\n")
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
