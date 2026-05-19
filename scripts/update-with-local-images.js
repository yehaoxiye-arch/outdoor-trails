const fs = require('fs');
const path = require('path');

function updateProductImages() {
  // 读取映射文件
  const mappingPath = path.join(__dirname, 'image-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

  // 读取产品数据
  const productsPath = path.join(__dirname, '../src/data/products.ts');
  let content = fs.readFileSync(productsPath, 'utf8');

  let updatedCount = 0;

  // 遍历映射，更新产品数据
  for (const [key, localPath] of Object.entries(mapping)) {
    if (key === 'success' || key === 'failed' || key === 'errors') continue;

    const [brand, ...nameParts] = key.split('_');
    const name = nameParts.join('_');

    // 查找并替换图片URL
    // 匹配模式：name: "xxx", brand: "xxx", ... image: "xxx"
    const regex = new RegExp(
      `(name:\\s*"${escapeRegex(name)}",\\s*\\n\\s*brand:\\s*"${escapeRegex(brand)}",[\\s\\S]*?image:\\s*")[^"]+(")`,
      'g'
    );

    const before = content;
    content = content.replace(regex, `$1${localPath}$2`);

    if (content !== before) {
      updatedCount++;
      console.log(`Updated: ${brand} - ${name} -> ${localPath}`);
    }
  }

  // 写入更新后的文件
  fs.writeFileSync(productsPath, content, 'utf8');

  console.log(`\nTotal updated: ${updatedCount}`);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

updateProductImages();
