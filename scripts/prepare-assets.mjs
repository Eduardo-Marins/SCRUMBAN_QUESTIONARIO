import sharp from "sharp";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

// Mechanical extraction of the supplied sprite sheets; no replacement artwork.
const source = process.argv[2] || "C:/Users/victo/Downloads/AssetsScrumban";
const output = "public/assets";
await mkdir(output, { recursive: true });
const inventory = [];
async function inspect(folder) {
  for (const file of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, file.name);
    if (file.isDirectory()) await inspect(path);
    else {
      const meta = await sharp(path).metadata();
      inventory.push({
        file: relative(source, path),
        width: meta.width,
        height: meta.height,
        alpha: meta.hasAlpha,
      });
    }
  }
}
await inspect(source);

async function sprite(file, name, box, key = "cyan", basis = 1600) {
  const path = join(source, "battle", file);
  const meta = await sharp(path).metadata();
  const ratio = meta.width / basis;
  const [left, top, width, height] = box.map((n) => Math.round(n * ratio));
  const { data, info } = await sharp(path)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = data.subarray(i, i + 3);
    if (
      (key === "cyan" && g > 125 && b > 120 && g - r > 22 && b - r > 20) ||
      (key === "sky" && b > 120 && g > 110 && b - r > 12 && g - r > 5) ||
      (key === "white" && r > 225 && g > 225 && b > 225)
    )
      data[i + 3] = 0;
  }
  await sharp(data, { raw: info })
    .trim({ threshold: 10 })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ height: key === "sky" ? 180 : 450, withoutEnlargement: true })
    .webp({ quality: 90, lossless: key === "sky" })
    .toFile(join(output, name + ".webp"));
}
for (let i = 1; i <= 8; i++) {
  const { data, info } = await sharp(
    join(source, "armario", `armarioAsset (${i}).png`),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let k = 0; k < data.length; k += 4) {
    if (data[k] > 180 && data[k + 1] < 110 && data[k + 2] < 85) data[k + 3] = 0;
  }
  await sharp(data, { raw: info })
    .resize(1000)
    .webp({ quality: 85 })
    .toFile(join(output, `cabinet-${i}.webp`));
}
await sprite("marioAssets.jpeg", "mario-idle", [390, 185, 245, 415]);
await sprite("marioAssets.jpeg", "mario-back", [960, 185, 265, 420]);
await sprite("marioAssets.jpeg", "mario-win", [670, 1042, 300, 405]);
await sprite("marioAssets.jpeg", "mario-hurt", [991, 1185, 257, 344]);
await sprite("marioAssets.jpeg", "mario-happy-face", [330, 737, 220, 220]);
await sprite("marioAssets.jpeg", "mario-sad-face", [800, 737, 230, 220]);
await sprite("bowserAssets.jpeg", "bowser-idle", [375, 191, 260, 407]);
await sprite("bowserAssets.jpeg", "bowser-win", [1273, 1120, 269, 413]);
await sprite("bowserAssets.jpeg", "bowser-hurt", [990, 1200, 253, 334]);
await sprite("bowserAssets.jpeg", "bowser-sad-face", [807, 737, 220, 221]);
await sprite("bowserAssets.jpeg", "bowser-happy-face", [328, 736, 220, 221]);
await sprite("spritesGame.jpg", "mushroom", [94, 174, 36, 38], "sky", 312);
await sprite("spritesGame.jpg", "star", [59, 9, 18, 22], "sky", 312);
await sprite("spritesGame.jpg", "coin", [145, 45, 18, 19], "sky", 312);
await sprite("spritesGame.jpg", "block", [128, 45, 18, 18], "sky", 312);
await sharp(join(source, "battle", "backgrounds.png"))
  .extract({ left: 249, top: 6, width: 240, height: 112 })
  .webp({ lossless: true })
  .toFile(join(output, "battle-field.webp"));
await mkdir("docs", { recursive: true });
await writeFile(
  "docs/asset-inventory.json",
  JSON.stringify(inventory, null, 2) + "\n",
);
console.log(
  `Analyzed ${inventory.length} source files. Optimized cabinet views, character poses, expressions and battlefield in ${output}.`,
);
