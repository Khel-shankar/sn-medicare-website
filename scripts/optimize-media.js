/**
 * Watermark-clean + compress site images for fast responsive delivery.
 * Outputs WebP under public/images (max edge 1400px, q=78).
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IMG = path.join(ROOT, "public", "images");
const BAK = path.join(IMG, "_backup_before_restore");

async function removeEdgeSparkles(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const out = Buffer.from(data);
  const idx = (x, y) => (y * w + x) * ch;
  const lum = (i) => (data[i] + data[i + 1] + data[i + 2]) / 3;

  const marginX = Math.floor(w * 0.18);
  const marginY = Math.floor(h * 0.18);
  const inEdgeZone = (x, y) =>
    x < marginX || x > w - marginX || y < marginY || y > h - marginY;

  const candidates = [];
  for (let y = 3; y < h - 3; y++) {
    for (let x = 3; x < w - 3; x++) {
      if (!inEdgeZone(x, y)) continue;
      const i = idx(x, y);
      const L = lum(i);
      if (L < 190) continue;

      let sum = 0;
      let n = 0;
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -5; dx <= 5; dx++) {
          if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) continue;
          sum += lum(idx(x + dx, y + dy));
          n++;
        }
      }
      const surround = sum / n;
      if (L - surround > 85 && surround < 120) {
        candidates.push({ x, y });
      }
    }
  }

  const used = new Array(candidates.length).fill(false);
  const blobs = [];
  for (let i = 0; i < candidates.length; i++) {
    if (used[i]) continue;
    const stack = [i];
    used[i] = true;
    const pts = [];
    while (stack.length) {
      const cur = stack.pop();
      pts.push(candidates[cur]);
      for (let j = 0; j < candidates.length; j++) {
        if (used[j]) continue;
        const a = candidates[cur];
        const b = candidates[j];
        if (Math.abs(a.x - b.x) <= 5 && Math.abs(a.y - b.y) <= 5) {
          used[j] = true;
          stack.push(j);
        }
      }
    }
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (bw > 28 || bh > 28 || pts.length < 2 || pts.length > 120) continue;
    blobs.push({ minX, maxX, minY, maxY });
  }

  for (const blob of blobs) {
    const pad = 8;
    const x0 = Math.max(0, blob.minX - pad);
    const x1 = Math.min(w - 1, blob.maxX + pad);
    const y0 = Math.max(0, blob.minY - pad);
    const y1 = Math.min(h - 1, blob.maxY + pad);
    const samples = [];
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (
          x >= blob.minX - 1 &&
          x <= blob.maxX + 1 &&
          y >= blob.minY - 1 &&
          y <= blob.maxY + 1
        )
          continue;
        const i = idx(x, y);
        samples.push([data[i], data[i + 1], data[i + 2]]);
      }
    }
    if (!samples.length) continue;
    samples.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
    const m = samples[Math.floor(samples.length / 2)];
    const cx = (blob.minX + blob.maxX) / 2;
    const cy = (blob.minY + blob.maxY) / 2;
    const rad =
      Math.max(blob.maxX - blob.minX, blob.maxY - blob.minY) / 2 + 3;
    for (let y = Math.floor(cy - rad); y <= Math.ceil(cy + rad); y++) {
      for (let x = Math.floor(cx - rad); x <= Math.ceil(cx + rad); x++) {
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const d = Math.hypot(x - cx, y - cy);
        if (d > rad) continue;
        const i = idx(x, y);
        if (lum(i) < 140) continue;
        const t = 1 - d / rad;
        out[i] = Math.round(data[i] * (1 - t) + m[0] * t);
        out[i + 1] = Math.round(data[i + 1] * (1 - t) + m[1] * t);
        out[i + 2] = Math.round(data[i + 2] * (1 - t) + m[2] * t);
      }
    }
  }

  return {
    buffer: out,
    width: w,
    height: h,
    channels: ch,
    removed: blobs.length,
  };
}

async function optimizeOne({ src, outWebp, outPng, maxEdge = 1400, quality = 78 }) {
  if (!fs.existsSync(src)) {
    console.warn("skip missing", src);
    return null;
  }

  const cleaned = await removeEdgeSparkles(src);
  let pipeline = sharp(cleaned.buffer, {
    raw: {
      width: cleaned.width,
      height: cleaned.height,
      channels: cleaned.channels,
    },
  }).rotate();

  const meta = { width: cleaned.width, height: cleaned.height };
  if (meta.width > maxEdge || meta.height > maxEdge) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  await pipeline
    .clone()
    .webp({ quality, effort: 5 })
    .toFile(outWebp);

  if (outPng) {
    await sharp(outWebp)
      .png({ compressionLevel: 9, palette: false })
      .toFile(outPng);
  }

  const inSize = fs.statSync(src).size;
  const outSize = fs.statSync(outWebp).size;
  console.log(
    JSON.stringify({
      file: path.basename(outWebp),
      removedSparkles: cleaned.removed,
      fromKB: Math.round(inSize / 1024),
      toKB: Math.round(outSize / 1024),
    })
  );
  return outWebp;
}

async function main() {
  if (!fs.existsSync(BAK)) fs.mkdirSync(BAK, { recursive: true });

  const jobs = [
    {
      src: path.join(IMG, "kivo-pro-hero.png"),
      outWebp: path.join(IMG, "kivo-pro-hero.webp"),
      maxEdge: 1200,
    },
    {
      src: path.join(IMG, "kivo-pro-flyer.png"),
      outWebp: path.join(IMG, "kivo-pro-flyer.webp"),
      maxEdge: 900,
    },
    {
      src: path.join(IMG, "kivo-pro-product.png"),
      outWebp: path.join(IMG, "kivo-pro-product.webp"),
      maxEdge: 1000,
    },
    {
      src: path.join(IMG, "kivo-pro-hero-prev.png"),
      outWebp: path.join(IMG, "kivo-pro-hero-prev.webp"),
      maxEdge: 1100,
    },
    {
      src: path.join(IMG, "kivo-pro-flyer-prev.png"),
      outWebp: path.join(IMG, "kivo-pro-flyer-prev.webp"),
      maxEdge: 900,
    },
    {
      src: path.join(IMG, "kivo-pro-specs.png"),
      outWebp: path.join(IMG, "kivo-pro-specs.webp"),
      maxEdge: 1100,
    },
    {
      src: path.join(IMG, "kivo-pro-logo.png"),
      outWebp: path.join(IMG, "kivo-pro-logo.webp"),
      maxEdge: 480,
      quality: 85,
    },
    {
      src: path.join(IMG, "kivo-header-logo.png"),
      outWebp: path.join(IMG, "kivo-header-logo.webp"),
      maxEdge: 320,
      quality: 90,
    },
    {
      src: path.join(IMG, "kivo-plus-hero.png"),
      outWebp: path.join(IMG, "kivo-plus-hero.webp"),
      maxEdge: 1200,
    },
    {
      src: path.join(IMG, "kivo-plus-flyer.png"),
      outWebp: path.join(IMG, "kivo-plus-flyer.webp"),
      maxEdge: 900,
    },
    {
      src: path.join(IMG, "kivo-plus-product.png"),
      outWebp: path.join(IMG, "kivo-plus-product.webp"),
      maxEdge: 1000,
    },
    {
      src: path.join(IMG, "kivo-plus-lifestyle.png"),
      outWebp: path.join(IMG, "kivo-plus-lifestyle.webp"),
      maxEdge: 1200,
    },
    {
      src: path.join(IMG, "about-clinic.png"),
      outWebp: path.join(IMG, "about-clinic.webp"),
      maxEdge: 1200,
    },
  ];

  for (const job of jobs) {
    await optimizeOne(job);
  }

  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
