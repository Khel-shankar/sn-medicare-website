const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const IMG = path.join(__dirname, "..", "public", "images");
const OUTDIR = path.join(IMG, "_clean_out");
const FILES = [
  "kivo-pro-hero.webp","kivo-pro-flyer.webp","kivo-pro-product.webp","kivo-pro-hero-prev.webp","kivo-pro-flyer-prev.webp","kivo-pro-specs.webp",
  "kivo-plus-hero.webp","kivo-plus-flyer.webp","kivo-plus-product.webp","kivo-plus-lifestyle.webp","about-clinic.webp"
];
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
async function scrub(file) {
  const src = path.join(IMG, file);
  if (!fs.existsSync(src)) return;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;
  const out = Buffer.from(data);
  const idx = (x, y) => (y * w + x) * ch;
  const lum = (buf, i) => (buf[i] + buf[i + 1] + buf[i + 2]) / 3;
  let painted = 0;
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      const i = idx(x, y);
      const L = lum(data, i);
      if (L < 70 || L > 185) continue;
      let darkN = 0, sum = 0, n = 0;
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
        if (!dx && !dy) continue;
        const s = lum(data, idx(x + dx, y + dy));
        sum += s; n++; if (s < 45) darkN++;
      }
      const avg = sum / n;
      if (avg > 50 || darkN < 20 || L - avg < 28) continue;
      const arm = (lum(data, idx(x,y-2))+lum(data, idx(x,y+2))+lum(data, idx(x-2,y))+lum(data, idx(x+2,y)))/4;
      const diag = (lum(data, idx(x-2,y-2))+lum(data, idx(x+2,y-2))+lum(data, idx(x-2,y+2))+lum(data, idx(x+2,y+2)))/4;
      if (arm + 8 < diag) continue;
      let br=0,bg=0,bb=0,bn=0;
      for (let dy=-4; dy<=4; dy++) for (let dx=-4; dx<=4; dx++) {
        const j = idx(x+dx,y+dy); const s = lum(data,j);
        if (s < 40) { br+=data[j]; bg+=data[j+1]; bb+=data[j+2]; bn++; }
      }
      if (!bn) { br=bg=bb=8; bn=1; }
      out[i]=Math.round(br/bn); out[i+1]=Math.round(bg/bn); out[i+2]=Math.round(bb/bn); painted++;
    }
  }
  const dest = path.join(OUTDIR, file);
  await sharp(out, { raw: { width:w, height:h, channels:ch } }).webp({ quality:82, effort:5 }).toFile(dest);
  console.log(JSON.stringify({ file, painted }));
}
(async()=>{ for (const f of FILES) await scrub(f); })().catch(e=>{console.error(e); process.exit(1);});
