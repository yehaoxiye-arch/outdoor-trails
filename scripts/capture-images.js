const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 需要截图的防盗链图片来源
const HOTLINK_DOMAINS = ['smzdm.com', 'zdmimg.com'];

async function captureImages() {
  // 读取产品数据
  const productsPath = path.join(__dirname, '../src/data/products.ts');
  const content = fs.readFileSync(productsPath, 'utf8');

  // 提取所有需要截图的产品
  const products = [];

  // 使用正则表达式匹配每个产品块
  const productRegex = /\{\s*\n\s*id:\s*"[^"]+",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*brand:\s*"([^"]+)",\s*\n[\s\S]*?image:\s*"(https?:\/\/[^"]+)",/g;

  let match;
  while ((match = productRegex.exec(content)) !== null) {
    const name = match[1];
    const brand = match[2];
    const url = match[3];

    // 检查是否是防盗链图片
    const needsCapture = HOTLINK_DOMAINS.some(domain => url.includes(domain));
    if (needsCapture) {
      products.push({ name, brand, imageUrl: url });
    }
  }

  console.log(`Found ${products.length} images to capture`);

  // 创建截图目录
  const screenshotsDir = path.join(__dirname, '../public/images/products');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const page = await browser.newPage();

    try {
      // 设置视口大小
      await page.setViewport({ width: 800, height: 600 });

      // 访问图片URL
      await page.goto(product.imageUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 等待图片加载
      await page.waitForSelector('img', { timeout: 10000 }).catch(() => {});

      // 截取图片元素
      const imgElement = await page.$('img');
      if (imgElement) {
        // 生成文件名
        const fileName = `${product.brand}_${product.name}`
          .replace(/[^a-zA-Z0-9一-龥]/g, '_')
          .substring(0, 50) + '.png';
        const filePath = path.join(screenshotsDir, fileName);

        // 截图保存
        await imgElement.screenshot({ path: filePath });

        // 更新产品数据中的图片路径
        const relativePath = `/images/products/${fileName}`;

        results.success++;
        console.log(`[${i + 1}/${products.length}] ✓ ${product.brand} - ${product.name}`);

        // 记录需要更新的映射
        results[product.brand + '_' + product.name] = relativePath;
      } else {
        results.failed++;
        results.errors.push({ product: `${product.brand} - ${product.name}`, error: 'No image found' });
        console.log(`[${i + 1}/${products.length}] ✗ ${product.brand} - ${product.name}: No image found`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push({ product: `${product.brand} - ${product.name}`, error: error.message });
      console.log(`[${i + 1}/${products.length}] ✗ ${product.brand} - ${product.name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // 保存映射结果
  const mappingPath = path.join(__dirname, 'image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));

  console.log('\n=== Summary ===');
  console.log('Success:', results.success);
  console.log('Failed:', results.failed);
  console.log('Mapping saved to:', mappingPath);

  return results;
}

captureImages().catch(console.error);
