import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, "..", "public", "images", "products");
const PRODUCTS_TS = path.join(__dirname, "..", "src", "data", "products.ts");
const EXCEL_PATH = "D:/ff90f2c10504449ba9e94040acd16336.xlsx";

// 确保目录存在
if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

// 下载图片
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(filepath);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  // 1. 读取Excel
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);
  const sheet = wb.worksheets[0];
  const headers = [];
  sheet.getRow(1).eachCell((cell, col) => {
    headers[col] = cell.value;
  });

  const excelProducts = [];
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const item = {};
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      item[headers[col]] = cell.value;
    });
    if (item["产品名称"] && item["产品高清图片链接"]) {
      excelProducts.push({
        name: item["产品名称"].trim(),
        url: item["产品高清图片链接"].trim(),
        category: item["产品分类"] || "",
      });
    }
  }

  console.log(`读取Excel: ${excelProducts.length}条产品图片`);

  // 2. 读取products.ts
  let content = fs.readFileSync(PRODUCTS_TS, "utf-8");

  // 3. 提取数据库中的产品信息
  const productRegex =
    /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g;
  const dbProducts = [];
  let match;
  while ((match = productRegex.exec(content)) !== null) {
    dbProducts.push({
      id: match[1],
      name: match[2],
      brand: match[3],
      image: match[4],
    });
  }

  console.log(`读取数据库: ${dbProducts.length}条产品`);

  // 4. 品牌映射表
  const brandMap = {
    "始祖鸟": "始祖鸟",
    "arcteryx": "始祖鸟",
    "salomon": "Salomon",
    "osprey": "Osprey",
    "gregory": "Gregory",
    "deuter": "Deuter",
    "巴塔哥尼亚": "巴塔哥尼亚",
    "patagonia": "巴塔哥尼亚",
    "rab": "Rab",
    "r.a.b": "Rab",
    "黑冰": "黑冰",
    "nemo": "NEMO",
    "leki": "LEKI",
    "merrell": "Merrell",
    "scarpa": "Scarpa",
    "keen": "KEEN",
    "hoka": "HOKA",
    "凯乐石": "凯乐石",
    "迪卡侬": "迪卡侬",
    "猛犸象": "猛犸象",
    "mammut": "猛犸象",
    "the north face": "The North Face",
    "tnf": "The North Face",
    "伯希和": "伯希和",
    "pelliot": "伯希和",
    "探路者": "探路者",
    "挪客": "挪客",
    "naturehike": "挪客",
    "天石": "天石",
    "sea to summit": "Sea to Summit",
    "therm-a-rest": "Therm-a-Rest",
    "klymit": "Klymit",
    "big agnes": "Big Agnes",
    "山之泉": "山之泉",
    "牧高笛": "牧高笛",
    "三峰出": "三峰出",
    "骆驼": "骆驼",
    "哥伦比亚": "哥伦比亚",
    "columbia": "哥伦比亚",
    "可隆": "可隆",
    "kolon": "可隆",
    "狼爪": "狼爪",
    "jack wolfskin": "狼爪",
    "奥索卡": "奥索卡",
    "ozark": "奥索卡",
    "marmot": "Marmot",
    "土拨鼠": "Marmot",
    "msr": "MSR",
    "静星": "静星",
    "durston": "Durston",
    "mystery ranch": "Mystery Ranch",
    "altra": "Altra",
    "trekology": "Trekology",
    "cascade mountain tech": "Cascade Mountain Tech",
    "gossamer gear": "Gossamer Gear",
    "komperdell": "Komperdell",
    "zpacks": "Zpacks",
    "高山客": "高山客",
    "granite gear": "Granite Gear",
  };

  // 从Excel产品名中提取品牌
  function extractBrand(excelName) {
    const lower = excelName.toLowerCase();
    for (const [key, brand] of Object.entries(brandMap)) {
      if (lower.startsWith(key) || lower.includes(key)) {
        return brand;
      }
    }
    return null;
  }

  // 模糊匹配产品名
  function fuzzyMatch(excelName, dbName) {
    const e = excelName.toLowerCase().replace(/\s+/g, "");
    const d = dbName.toLowerCase().replace(/\s+/g, "");
    // 完全包含
    if (e.includes(d) || d.includes(e)) return true;
    // 提取核心型号（去除中文描述）
    const eCore = e.replace(/[一-龥]+/g, "").trim();
    const dCore = d.replace(/[一-龥]+/g, "").trim();
    if (eCore && dCore && (eCore.includes(dCore) || dCore.includes(eCore))) return true;
    return false;
  }

  // 5. 匹配并下载
  let success = 0;
  let skip = 0;
  let fail = 0;
  const failedProducts = [];

  for (const ep of excelProducts) {
    // 先提取品牌
    const brand = extractBrand(ep.name);

    // 查找匹配的产品
    let dbProduct = null;

    if (brand) {
      // 优先在同品牌内匹配
      const brandProducts = dbProducts.filter((dp) => dp.brand === brand);
      dbProduct = brandProducts.find((dp) => fuzzyMatch(ep.name, dp.name));
    }

    if (!dbProduct) {
      // 全局模糊匹配
      dbProduct = dbProducts.find((dp) => fuzzyMatch(ep.name, dp.name));
    }

    if (!dbProduct) {
      // 最后尝试包含匹配
      dbProduct = dbProducts.find((dp) => {
        const epLower = ep.name.toLowerCase();
        const dpLower = dp.name.toLowerCase();
        const dpFull = (dp.brand + " " + dp.name).toLowerCase();
        return (
          epLower.includes(dpLower) ||
          dpLower.includes(epLower) ||
          epLower.includes(dpFull) ||
          dpFull.includes(epLower)
        );
      });
    }

    if (!dbProduct) {
      fail++;
      failedProducts.push(ep.name);
      continue;
    }

    // 生成本地文件名
    const filename = `${dbProduct.id}.jpg`;
    const filepath = path.join(PRODUCTS_DIR, filename);

    // 如果文件已存在，跳过
    if (fs.existsSync(filepath)) {
      skip++;
      continue;
    }

    // 下载图片
    try {
      await downloadImage(ep.url, filepath);
      success++;
      if (success % 10 === 0) {
        console.log(`  已下载: ${success}张`);
      }
    } catch (err) {
      fail++;
      failedProducts.push(`${ep.name} (${err.message})`);
    }
  }

  console.log(`\n下载完成: 成功=${success}, 跳过=${skip}, 失败=${fail}`);
  if (failedProducts.length > 0) {
    console.log("\n失败产品:");
    failedProducts.forEach((n) => console.log(`  ${n}`));
  }

  // 5. 统计本地图片
  const localImages = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".jpg"));
  console.log(`\n本地图片总数: ${localImages.length}`);
}

main().catch(console.error);
