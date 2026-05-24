const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function updateImages() {
  // 读取 Excel 文件
  const filePath = path.resolve('C:/Users/Simon/Documents/Codex/2026-05-18/files-mentioned-by-the-user-2/户外品牌产品数据_更新版_已填商品图链接.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // 收集所有图片链接
  const imageMap = {};

  for (const worksheet of workbook.worksheets) {
    const brand = worksheet.name;

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const name = row.getCell(4).value;
      const imageCell = row.getCell(15).value;

      // 提取图片链接
      let imageUrl = '';
      if (imageCell) {
        if (typeof imageCell === 'object' && imageCell.hyperlink) {
          imageUrl = imageCell.hyperlink;
        } else if (typeof imageCell === 'string' && imageCell.startsWith('http')) {
          imageUrl = imageCell;
        }
      }

      if (name && imageUrl) {
        // 使用品牌+产品名作为key
        const key = `${brand}_${name}`.trim();
        imageMap[key] = imageUrl;
      }
    }
  }

  console.log('Total images from Excel:', Object.keys(imageMap).length);

  // 读取当前产品数据
  const productsPath = path.join(__dirname, '../src/data/products.ts');
  let productsContent = fs.readFileSync(productsPath, 'utf8');

  // 更新图片链接
  let updatedCount = 0;
  const missingProducts = [];

  for (const [key, imageUrl] of Object.entries(imageMap)) {
    const [brand, ...nameParts] = key.split('_');
    const name = nameParts.join('_');

    // 在产品数据中查找匹配的产品
    // 使用正则表达式匹配产品名称
    const nameRegex = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const brandRegex = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // 查找产品块
    const productRegex = new RegExp(
      `(name: "[^"]*${nameRegex}[^"]*",\\s*\\n\\s*brand: "${brandRegex}",[\\s\\S]*?image: ")[^"]*(")`,
      'g'
    );

    const match = productRegex.exec(productsContent);
    if (match) {
      const oldImage = match[1] + match[2];
      const newImage = match[1] + imageUrl + match[2];

      if (oldImage !== newImage) {
        productsContent = productsContent.replace(oldImage, newImage);
        updatedCount++;
        console.log('Updated:', brand, '-', name);
      }
    } else {
      missingProducts.push(key);
    }
  }

  // 写入更新后的产品数据
  fs.writeFileSync(productsPath, productsContent, 'utf8');

  console.log('\n=== Summary ===');
  console.log('Updated:', updatedCount);
  console.log('Missing:', missingProducts.length);
  if (missingProducts.length > 0) {
    console.log('Missing products:');
    missingProducts.forEach(p => console.log('  -', p));
  }
}

updateImages().catch(console.error);
