/**
 * Remove Gemini four-pointed-star watermarks via multi-scale template match + inpaint.
 * Sources: PNG originals when present, else existing WebP.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const IMG = path.join(ROOT, "public", "images");
const TEMPLATE = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-Dell-sn-medicare-website",
  "assets",
  "c__Users_Dell_AppData_Roaming_Cursor_User_workspaceStorage_5206e53abf3b69c35e9c927f9aba29de_images_image-13e7e292-bccd-435a-914a-121c5413bb6e.png"
);

function idx(x, y, w, ch) {
  return (y * w + x) * ch;
}

function lum(data, i) {
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}

async function loadTemplateMasks() {
  if (!fs.existsSync(TEMPLATE)) {
    console.warn("template missing, using synthetic star masks");
    return synthStars();
  }
  const sizes = [14, 18, 22, 28, 34, 42, 52, 64];
  const masks = [];
  for (const size of sizes) {
    const { data, info } = await sharp(TEMPLATE)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const bright = [];
    for (let i = 0; i < data.length; i += info.channels) {
      const L = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const a = info.channels === 4 ? data[i + 3] : 255;
      if (L > 90 && a > 40) bright.push(1);
      else bright.push(0);
    }
    const ones = bright.reduce((s, v) => s + v, 0);
    if (ones < 8) continue;
    masks.push({ w: info.width, h: info.height, bright, ones });
  }
  return masks.length ? masks : synthStars();
}

function synthStars() {
  const sizes = [16, 22, 28, 36, 48];
  return sizes.map((size) => {
    const bright = new Array(size * size).fill(0);
    const cx = (size - 1) / 2;
    const cy = (size - 1) / 2;
    const r = size * 0.42;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = Math.abs(x - cx) / r;
        const dy = Math.abs(y - cy) / r;
        // four-pointed star-ish: high on axes, low on diagonals
        const v = dx + dy + Math.max(dx, dy) * 0.35;
        if (v < 1.05 && Math.min(dx, dy) < 0.55) bright[y * size + x] = 1;
      }
    }
    const ones = bright.reduce((s, v) => s + v, 0);
    return { w: size, h: size, bright, ones };
  });
}

function matchScore(data, w, h, ch, mask, ox, oy) {
  let hit = 0;
  let missBright = 0;
  let bgDark = 0;
  let nBg = 0;
  for (let y = 0; y < mask.h; y++) {
    for (let x = 0; x < mask.w; x++) {
      const mx = ox + x;
      const my = oy + y;
      if (mx < 0 || my < 0 || mx >= w || my >= h) continue;
      const i = idx(mx, my, w, ch);
      const L = lum(data, i);
      const want = mask.bright[y * mask.w + x];
      if (want) {
        if (L > 95) hit++;
        else missBright++;
      } else {
        nBg++;
        if (L < 90) bgDark++;
      }
    }
  }
  if (hit < mask.ones * 0.35) return 0;
  const hitRate = hit / mask.ones;
  const bgRate = nBg ? bgDark / nBg : 0;
  const missPen = missBright / Math.max(1, mask.ones);
  return hitRate * 0.7 + bgRate * 0.3 - missPen * 0.25;
}

function collectMatches(data, w, h, ch, masks) {
  const found = [];
  const step = 3;
  for (const mask of masks) {
    const maxX = w - mask.w;
    const maxY = h - mask.h;
    if (maxX < 2 || maxY < 2) continue;
    for (let y = 0; y <= maxY; y += step) {
      for (let x = 0; x <= maxX; x += step) {
        // skip pure bright product areas lightly: require some dark surround sample
        const score = matchScore(data, w, h, ch, mask, x, y);
        if (score >= 0.62) {
          found.push({
            x,
            y,
            w: mask.w,
            h: mask.h,
            score,
          });
        }
      }
    }
  }
  // NMS
  found.sort((a, b) => b.score - a.score);
  const kept = [];
  for (const f of found) {
    const cx = f.x + f.w / 2;
    const cy = f.y + f.h / 2;
    if (
      kept.some((k) => {
        const kx = k.x + k.w / 2;
        const ky = k.y + k.h / 2;
        return Math.hypot(cx - kx, cy - ky) < Math.max(f.w, k.w) * 0.7;
      })
    )
      continue;
    kept.push(f);
  }
  return kept;
}

function alsoCatchFaintStars(data, w, h, ch) {
  // faint mid-gray sparkles on near-black (common Gemini placements in text areas)
  const pts = [];
  for (let y = 4; y < h - 4; y++) {
    for (let x = 4; x < w - 4; x++) {
      const i = idx(x, y, w, ch);
      const L = lum(data, i);
      if (L < 70 || L > 200) continue;
      let surround = 0;
      let n = 0;
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) continue;
          surround += lum(data, idx(x + dx, y + dy, w, ch));
          n++;
        }
      }
      surround /= n;
      if (surround > 55) continue; // only on dark bg
      if (L - surround < 35) continue;

      // rough 4-arm check: arms brighter than diagonals
      const arm =
        (lum(data, idx(x, y - 3, w, ch)) +
          lum(data, idx(x, y + 3, w, ch)) +
          lum(data, idx(x - 3, y, w, ch)) +
          lum(data, idx(x + 3, y, w, ch))) /
        4;
      const diag =
        (lum(data, idx(x - 2, y - 2, w, ch)) +
          lum(data, idx(x + 2, y - 2, w, ch)) +
          lum(data, idx(x - 2, y + 2, w, ch)) +
          lum(data, idx(x + 2, y + 2, w, ch))) /
        4;
      if (arm - diag < 12) continue;
      pts.push({ x, y });
    }
  }

  const used = new Array(pts.length).fill(false);
  const blobs = [];
  for (let i = 0; i < pts.length; i++) {
    if (used[i]) continue;
    const stack = [i];
    used[i] = true;
    const cluster = [];
    while (stack.length) {
      const cur = stack.pop();
      cluster.push(pts[cur]);
      for (let j = 0; j < pts.length; j++) {
        if (used[j]) continue;
        if (
          Math.abs(pts[cur].x - pts[j].x) <= 6 &&
          Math.abs(pts[cur].y - pts[j].y) <= 6
        ) {
          used[j] = true;
          stack.push(j);
        }
      }
    }
    if (cluster.length < 2 || cluster.length > 80) continue;
    const xs = cluster.map((p) => p.x);
    const ys = cluster.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    if (bw > 40 || bh > 40) continue;
    blobs.push({
      x: Math.max(0, minX - 4),
      y: Math.max(0, minY - 4),
      w: Math.min(w - minX, bw + 8),
      h: Math.min(h - minY, bh + 8),
      score: 0.7,
    });
  }
  return blobs;
}

function inpaint(data, out, w, h, ch, regions) {
  for (const r of regions) {
    const x0 = Math.max(0, r.x - 2);
    const y0 = Math.max(0, r.y - 2);
    const x1 = Math.min(w - 1, r.x + r.w + 2);
    const y1 = Math.min(h - 1, r.y + r.h + 2);
    const samples = [];
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const inside =
          x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
        if (inside) continue;
        const i = idx(x, y, w, ch);
        const L = lum(data, i);
        if (L > 160) continue; // avoid sampling text/highlights
        samples.push([data[i], data[i + 1], data[i + 2]]);
      }
    }
    if (!samples.length) {
      // fallback blackish
      samples.push([8, 8, 10]);
    }
    samples.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
    const m = samples[Math.floor(samples.length * 0.35)];
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const rad = Math.max(r.w, r.h) / 2 + 2;
    for (let y = Math.floor(cy - rad); y <= Math.ceil(cy + rad); y++) {
      for (let x = Math.floor(cx - rad); x <= Math.ceil(cx + rad); x++) {
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const d = Math.hypot(x - cx, y - cy);
        if (d > rad) continue;
        const i = idx(x, y, w, ch);
        const L = lum(data, i);
        // only paint mid-bright watermark-like pixels, keep strong brand whites
        if (L < 45 || L > 210) continue;
        const t = Math.min(1, (1 - d / rad) * 1.15);
        out[i] = Math.round(data[i] * (1 - t) + m[0] * t);
        out[i + 1] = Math.round(data[i + 1] * (1 - t) + m[1] * t);
        out[i + 2] = Math.round(data[i + 2] * (1 - t) + m[2] * t);
      }
    }
  }
}

async function cleanOne(src, outWebp, maxEdge, quality) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const masks = await loadTemplateMasks();
  const matches = collectMatches(data, w, h, ch, masks);
  const faint = alsoCatchFaintStars(data, w, h, ch);
  const regions = [...matches, ...faint];
  // NMS merge
  regions.sort((a, b) => b.score - a.score);
  const merged = [];
  for (const r of regions) {
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    if (
      merged.some(
        (k) =>
          Math.hypot(cx - (k.x + k.w / 2), cy - (k.y + k.h / 2)) <
          Math.max(r.w, k.w) * 0.8
      )
    )
      continue;
    merged.push(r);
  }

  const out = Buffer.from(data);
  inpaint(data, out, w, h, ch, merged);

  let pipeline = sharp(out, {
    raw: { width: w, height: h, channels: ch },
  }).rotate();
  if (w > maxEdge || h > maxEdge) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await pipeline.webp({ quality, effort: 5 }).toFile(outWebp);
  return merged.length;
}

async function main() {
  const jobs = [
    ["kivo-pro-hero.png", "kivo-pro-hero.webp", 1200, 80],
    ["kivo-pro-flyer.png", "kivo-pro-flyer.webp", 900, 80],
    ["kivo-pro-product.png", "kivo-pro-product.webp", 1000, 80],
    ["kivo-pro-hero-prev.png", "kivo-pro-hero-prev.webp", 1100, 80],
    ["kivo-pro-flyer-prev.png", "kivo-pro-flyer-prev.webp", 900, 80],
    ["kivo-pro-specs.png", "kivo-pro-specs.webp", 1100, 80],
    ["kivo-plus-hero.png", "kivo-plus-hero.webp", 1200, 80],
    ["kivo-plus-flyer.png", "kivo-plus-flyer.webp", 900, 80],
    ["kivo-plus-product.png", "kivo-plus-product.webp", 1000, 80],
    ["kivo-plus-lifestyle.png", "kivo-plus-lifestyle.webp", 1200, 80],
    ["about-clinic.png", "about-clinic.webp", 1200, 80],
  ];

  for (const [png, webp, maxEdge, q] of jobs) {
    let src = path.join(IMG, png);
    if (!fs.existsSync(src)) src = path.join(IMG, webp);
    if (!fs.existsSync(src)) {
      console.warn("skip", png);
      continue;
    }
    const out = path.join(IMG, webp);
    const n = await cleanOne(src, out, maxEdge, q);
    console.log(JSON.stringify({ file: webp, removedRegions: n, kb: Math.round(fs.statSync(out).size / 1024) }));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
