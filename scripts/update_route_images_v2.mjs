import fs from "fs";

const imageMap = JSON.parse(
  fs.readFileSync("scripts/route_images_v2.json", "utf-8")
);
let content = fs.readFileSync("src/data/routes.ts", "utf-8");

let updated = 0;

for (const [routeId, urls] of Object.entries(imageMap)) {
  // 匹配整个产品块中的 image 行
  const blockRegex = new RegExp(
    `(id:\\s*"${routeId}"[\\s\\S]*?image:\\s*")([^"]+)(")`
  );
  const match = content.match(blockRegex);

  if (match) {
    // 检查该块是否已有 image2
    const blockEnd = content.indexOf("},", match.index);
    const block = content.substring(match.index, blockEnd);

    if (!block.includes("image2")) {
      // 替换 image URL 为新URL 并在其后插入 image2
      const imageLine = match[0];
      const newImageLine = `${match[1]}${urls.image}${match[3]}\n    image2: "${urls.image2}",`;
      content = content.replace(imageLine, newImageLine);
      updated++;
      console.log(`  更新: ${routeId}`);
    } else {
      console.log(`  已有image2: ${routeId}`);
    }
  } else {
    console.log(`  未找到: ${routeId}`);
  }
}

fs.writeFileSync("src/data/routes.ts", content, "utf-8");
console.log(`\n已更新 ${updated} 条线路`);
