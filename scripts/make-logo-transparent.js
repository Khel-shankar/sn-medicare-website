const sharp = require("sharp");

const src =
  "C:/Users/Dell/sn-medicare-website/public/images/kivo-header-logo.png";
const out =
  "C:/Users/Dell/sn-medicare-website/public/images/kivo-header-logo.png";

async function main() {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Make near-black background transparent; keep white/blue logo
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Pure/near black -> transparent
    if (max < 28) {
      data[i + 3] = 0;
      continue;
    }

    // Dark gray fringe around logo -> soft transparency
    if (max < 45 && max - min < 12) {
      data[i + 3] = Math.round(((max - 28) / 17) * 255);
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(out.replace(".png", "-tmp.png"));

  // Trim transparent edges so logo sits tightly
  await sharp(out.replace(".png", "-tmp.png"))
    .trim({ threshold: 1 })
    .png()
    .toFile(out);

  const m = await sharp(out).metadata();
  console.log("transparent logo ready", m.width, m.height, m.hasAlpha);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
