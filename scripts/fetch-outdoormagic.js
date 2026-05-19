const https = require('https');
const fs = require('fs');

const ARTICLES = [
  {
    id: 'backpacks',
    title: '2026年最佳背包',
    url: '/article/best-backpacks-for-hiking/',
    icon: '🎒'
  },
  {
    id: 'boots',
    title: '2026年最佳登山靴',
    url: '/article/best-walking-boots/',
    icon: '🥾'
  },
  {
    id: 'jackets',
    title: '2026年最佳防水夹克',
    url: '/article/best-waterproof-jackets/',
    icon: '🧥'
  }
];

function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'outdoorsmagic.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.end();
  });
}

// 从页面顶部的有序列表中提取获奖产品
function extractWinners(html) {
  const winners = [];

  // 匹配 <li> 中的产品名和奖项
  // 格式1: <li><strong><a href="#...">Product Name</a> &#8211; Award Title</strong></li>
  // 格式2: <li><p><strong>Product Name &#8211; Award Title</strong></p></li>
  // 只用 &#8211; (en-dash) 或 &#8212; (em-dash) 作为分隔符，避免误匹配产品名中的连字符
  const liPattern = /<li[^>]*>\s*(?:<p[^>]*>\s*)?<strong>(?:<a[^>]*>)?([^<]+?)(?:<\/a>)?\s*(?:&#8211;|&#8212;|–|—)\s*([^<]+)<\/strong>(?:\s*<\/p>)?\s*<\/li>/gi;
  let match;

  while ((match = liPattern.exec(html)) !== null) {
    const model = match[1].replace(/&#8217;/g, "'").replace(/&#8211;/g, '-').trim();
    const awardTitle = match[2].replace(/&#8217;/g, "'").replace(/&#8211;/g, '-').trim();
    winners.push({ model, awardTitle });
  }

  return winners;
}

// 清理 HTML 标签
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractProducts(html, articleId) {
  const products = [];
  const winners = extractWinners(html);

  // 创建获奖产品的名字映射（用于快速查找）
  const winnerMap = new Map();
  for (const w of winners) {
    // 使用名字的前部分进行匹配（因为 HTML 中的名字可能略有不同）
    const key = w.model.toLowerCase().split(' ').slice(0, 3).join(' ');
    winnerMap.set(key, w.awardTitle);
  }

  // 提取产品区块 - 按 <h2> 数字标题分割
  const productBlocks = html.split(/(?=<h2[^>]*>\d+\.)/);

  for (const block of productBlocks) {
    if (!block.includes('<h2')) continue;

    // 提取产品名称
    const titleMatch = block.match(/<h2[^>]*>\d+\.\s*(.*?)<\/h2>/i);
    if (!titleMatch) continue;

    const rawTitle = stripHtml(titleMatch[1]).trim();
    if (!rawTitle || rawTitle.length < 5) continue;

    // 跳过非产品标题
    if (rawTitle.includes('Best of the Rest') || rawTitle.includes('Our Team')) continue;

    // 提取产品型号（去掉数字前缀和 "Backpack"/"Boot"/"Jacket" 等后缀）
    let model = rawTitle.replace(/^\d+\.\s*/, '').trim();

    // 提取图片
    const imgMatch = block.match(/<img[^>]+id=["']prli-prdt-image["'][^>]+src=["']([^"']+)["']/i);
    const image = imgMatch ? imgMatch[1] : '';

    // 查找获奖信息 - 在 winners 列表中查找
    let awardTitle = '';
    let isWinner = false;

    const modelLower = model.toLowerCase();
    for (const [key, award] of winnerMap.entries()) {
      // 用产品名的前两个词匹配
      const keyWords = key.split(' ');
      const matchCount = keyWords.filter(w => modelLower.includes(w)).length;
      if (matchCount >= Math.min(2, keyWords.length)) {
        awardTitle = award;
        isWinner = true;
        break;
      }
    }

    // 提取 tester's verdict
    let verdict = '';
    // verdict 格式: <strong>Our tester's verdict: </strong>&#8220;verdict text&#8221;
    // 或 <strong>Our editor's verdict: </strong>&#8220;verdict text&#8221;
    // &#8220; = “, &#8221; = “, “ = “, “ = “
    const verdictPatterns = [
      /verdict:\s*(?:<\/strong>(?:\s*<strong[^>]*>\s*<\/strong>)?)\s*&#8220;([\s\S]*?)&#8221;/i,
      /verdict:\s*<\/strong>\s*&#8220;([\s\S]*?)&#8221;/i,
      /verdict:\s*<\/strong>\s*[“”””]([\s\S]*?)[“”””]\s/i,
      /verdict[^:]*:\s*(?:<\/[^>]+>)?\s*&#8220;([\s\S]*?)&#8221;/i,
    ];

    for (const pattern of verdictPatterns) {
      const match = block.match(pattern);
      if (match) {
        verdict = stripHtml(match[1]).trim();
        break;
      }
    }

    products.push({
      model,
      image,
      awardTitle,
      verdict,
      isWinner
    });
  }

  return products;
}

async function main() {
  const results = {};

  for (const article of ARTICLES) {
    console.log(`\nFetching: ${article.title}...`);

    try {
      const html = await fetchPage(article.url);
      const products = extractProducts(html, article.id);

      results[article.id] = {
        ...article,
        products,
        source: 'outdoorsmagic.com'
      };

      console.log(`Found ${products.length} products`);
      const winners = products.filter(p => p.isWinner);
      console.log(`Winners: ${winners.length}`);
      winners.forEach(p => console.log(`  ✓ ${p.model}: ${p.awardTitle}`));
    } catch (error) {
      console.error(`Error fetching ${article.title}:`, error.message);
    }
  }

  // 保存结果
  const outputPath = __dirname + '/../src/data/outdoormagic-rankings.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved to ${outputPath}`);

  // 显示摘要
  console.log('\n=== Summary ===');
  for (const [id, data] of Object.entries(results)) {
    console.log(`${data.icon} ${data.title}: ${data.products.length} products, ${data.products.filter(p => p.isWinner).length} winners`);
  }
}

main().catch(console.error);
