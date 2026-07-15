const sharp = require("sharp");

const src =
  "C:/Users/Dell/sn-medicare-website/WhatsApp Image 2026-07-15 at 10.22.47 PM.jpeg";
const outPng =
  "C:/Users/Dell/sn-medicare-website/public/images/kivo-header-logo.png";

async function main() {
  // Upscale cleanly for retina header (2x of ~220px display width ≈ 900)
  await sharp(src)
    .resize({ width: 900, kernel: sharp.kernel.lanczos3 })
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(outPng);

  const m = await sharp(outPng).metadata();
  console.log("header logo ready", m.width, m.height);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
