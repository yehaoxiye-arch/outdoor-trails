const fs = require('fs');
const path = require('path');

// 读取原始数据
const inputPath = path.join(__dirname, '../src/data/outdoormagic-rankings.json');
const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// 清理 HTML 标签
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/’/g, "'")   // curly single quote
    .replace(/‘/g, "'")   // curly single quote
    .replace(/“/g, '"')   // curly double quote
    .replace(/”/g, '"')   // curly double quote
    .replace(/–/g, '-')   // en-dash
    .replace(/—/g, '—')   // em-dash
    .replace(/\s+/g, ' ')
    .trim();
}

// 完整奖项标题翻译表
const AWARD_TRANSLATIONS = {
  // 背包类
  'Best Overall Backpacking Backpack': '最佳综合背包',
  'Best Waterproof Backpack': '最佳防水背包',
  'Best Backpack for Big Loads': '最佳大容量背包',
  'Best Value Hiking Backpack': '最佳性价比徒步背包',
  'Best Ultralight Backpack': '最佳超轻背包',
  'Best Multi-Use Backpack': '最佳多用途背包',
  // 登山靴类
  'Best Overall Walking Boot': '最佳综合登山靴',
  'A Close Second': '亚军之选',
  'Best Lightweight Walking Boot': '最佳轻量登山靴',
  'Best Budget Walking Boot': '最佳预算登山靴',
  'Best Vegan-Friendly Hiking Boots': '最佳环保登山靴',
  // 防水夹克类
  'Best Overall Waterproof Jackets': '最佳综合防水夹克',
  'Best Lightweight Waterproof Jacket': '最佳轻量防水夹克',
  'Best Value Waterproof Jacket': '最佳性价比防水夹克',
  'Most Breathable Waterproof Jacket': '最佳透气防水夹克',
  'Best Waterproof Jacket for Durability and Protection': '最佳耐用防水夹克',
};

// 通用词汇翻译（用于部分匹配后的补充翻译，长词优先）
const AWARD_WORD_TRANSLATIONS = [
  ['Backpacking Backpack', '背包'],
  ['Hiking Backpack', '徒步背包'],
  ['Walking Boot', '登山靴'],
  ['Hiking Boots', '登山靴'],
  ['Waterproof Jackets', '防水夹克'],
  ['Waterproof Jacket', '防水夹克'],
  ['Best Overall', '最佳综合'],
  ['Best Value', '最佳性价比'],
  ['Best Budget', '最佳预算'],
  ['Best Ultralight', '最佳超轻'],
  ['Best Lightweight', '最佳轻量'],
  ['Best Waterproof', '最佳防水'],
  ['Best Multi-Use', '最佳多用途'],
  ['Most Breathable', '最佳透气'],
  ["Editor's Choice", '编辑之选'],
  ['Backpack', '背包'],
  ['Jacket', '夹克'],
];

// 翻译获奖头衔
function translateAward(award) {
  const cleaned = cleanHtml(award);
  if (!cleaned) return '';

  // 先尝试完整匹配
  for (const [en, zh] of Object.entries(AWARD_TRANSLATIONS)) {
    if (cleaned === en || cleaned === en + '.') {
      return zh;
    }
  }

  // 处理 "Best for:" 开头的
  if (/^Best for:?\s/i.test(cleaned)) {
    const desc = cleaned.replace(/^Best for:?\s*/i, '').trim();
    return '最佳适用：' + desc;
  }

  // 逐词翻译
  let result = cleaned;
  for (const [en, zh] of AWARD_WORD_TRANSLATIONS) {
    result = result.replace(new RegExp(en, 'gi'), zh);
  }

  return result.trim();
}

// 翻译产品型号到中国商品名
function translateModel(model) {
  const translations = {
    // 背包
    'Osprey Kestrel 38L': 'Osprey 鹘鹰 38L',
    'Ortlieb Atrack 35L': 'Ortlieb Atrack 35L 防水背包',
    'Gregory Maven 58L': 'Gregory Maven 58L 女款背包',
    'Highlander Ben Nevis 52L': 'Highlander 本尼维斯 52L',
    'Bach Molecule 45L': 'Bach 分子 45L',
    'Sierra Designs Flex Capacitor 40-60L': 'Sierra Designs 弹性电容 40-60L',
    'Simond Trekking MT500 45+10L': 'Simond MT500 徒步背包 45+10L',
    'Osprey Talon 55L': 'Osprey 魔爪 55L',
    'Klättermusen Delling 25L': 'Klättermusen 巨人之刃 25L',
    'Fjällräven Keb 52L': 'Fjällräven Keb 52L',
    'Vaude Assymetric 52+8L': 'Vaude 非对称 52+8L',
    // 登山靴
    'Scarpa Terra GTX': 'Scarpa Terra GTX 经典徒步靴',
    'AKU Trekker Lite III': 'AKU Trekker Lite III 轻量徒步靴',
    'Helly Hansen Ascender Mid HT': 'Helly Hansen Ascender Mid HT 轻量登山靴',
    'Altberg Dalesway': 'Altberg Dalesway 环保登山靴',
    'Haglöfs Skuta Mid Eco Proof': 'Haglöfs Skuta Mid Eco Proof 环保登山靴',
    'Salomon X Ultra 360 Edge Mid': 'Salomon X Ultra 360 Edge Mid 越野徒步鞋',
    'Montbell Alpine Cruiser 800': 'Montbell Alpine Cruiser 800 高山靴',
    'Hoka Kaha 2 GTX': 'Hoka Kaha 2 GTX 缓震登山靴',
    'Asolo Acadia Mid LTH GTX': 'Asolo Acadia Mid LTH GTX 皮面登山靴',
    'Keen Targhee IV': 'Keen Targhee IV 防水徒步靴',
    'Brandecosse Volpe': 'Brandecosse Volpe 手工登山靴',
    'Hanwag Banks GTX': 'Hanwag Banks GTX 经典登山靴',
    'Salomon Quest 4 GTX': 'Salomon Quest 4 GTX 重装徒步靴',
    'Danner Mountain 600 EVO': 'Danner Mountain 600 EVO 都市徒步靴',
    // 防水夹克
    'Helly Hansen Verglas Infinity Shell 2.0': 'Helly Hansen Verglas Infinity Shell 2.0 全天候冲锋衣',
    "Arc'teryx Beta Jacket": "Arc'teryx Beta 轻量冲锋衣",
    'Simond Mountaineering Jacket': 'Simond 登山冲锋衣',
    'Páramo Caminata': 'Páramo Caminata 透气冲锋衣',
    'Cimalp Guide Pro': 'Cimalp Guide Pro 耐用冲锋衣',
    'Patagonia Torrentshell 3L': 'Patagonia Torrentshell 3L 环保冲锋衣',
    'Montbell Rain Trekker 2.0': 'Montbell Rain Trekker 2.0 轻量雨衣',
    'Teren Cloudland Shell': 'Teren Cloudland Shell 轻量冲锋衣',
    'Mountain Equipment Makalu Jacket': 'Mountain Equipment Makalu 高山冲锋衣',
    'Páramo Velez Adventure Light Smock': 'Páramo Velez Adventure Light 轻量套头冲锋衣',
    'Rab Latok Mountain Gore-tex Pro': 'Rab Latok Mountain Gore-Tex Pro 专业冲锋衣',
    'Keela Pinnacle': 'Keela Pinnacle 全天候冲锋衣',
    'Harrier Exmoor Jacket': 'Harrier Exmoor 轻量冲锋衣',
    'Montane Solution Jacket': 'Montane Solution 轻量冲锋衣',
    'Highlander Munro': 'Highlander Munro 经济冲锋衣',
    'Outdoor Research Aspire 3L Jacket': 'Outdoor Research Aspire 3L 全天候冲锋衣',
    'Jack Wolfskin Prelight 2.5L': 'Jack Wolfskin Prelight 2.5L 轻量冲锋衣',
  };

  for (const [en, zh] of Object.entries(translations)) {
    if (model.includes(en)) {
      return `${en}（${zh}）`;
    }
  }

  return model;
}

// Verdict 翻译映射
const VERDICT_TRANSLATIONS = {
  // 背包
  "I like how tough this backpack is. While there's not much in the way of recycled content, the material itself feels robust and has held up well on the trail. The back panel is pretty breathable too and uses a suspended mesh fabric with a reinforced frame.":
    "我喜欢这款背包的耐用性。虽然可回收材料不多，但面料本身非常结实，在小路上表现出色。背板也很透气，使用了悬浮网布和加固框架。",
  "It's comfortable, convenient, it feels aerodynamic and it also feels well made and durable too - it's the kind of pack that gives the impression that it'll last a long time.":
    "它舒适、方便，符合空气动力学设计，做工精良且耐用——给人一种能用很久的感觉。",
  "The Delling 20L is a well-made backpack built with high quality materials. It's performed very reliably on my recent UK excursions in the outdoors, with the tough Retina fabrics being a real highlight - I can see the backpack lasting a very long time because of them.":
    "Delling 20L是一款做工精良、采用高品质材料的背包。在我最近的英国户外出行中表现非常可靠，Retina面料是一大亮点——它能让背包使用非常长的时间。",
  "The design and build of the bag is really effective, and to say it's tough is an under statement. The materials used in every aspect of the bag right down to the zips and padding are just stunning.":
    "这款包的设计和做工非常出色，说它结实都算轻描淡写。从面料到拉链再到衬垫，每个细节的材料都令人惊叹。",
  "This is the kind of durable and lightweight backpack I like to hike with. It's the ideal size I tend to look for in a backpack and it's great value for your money too. The eco aspects are all great and don't seem to hinder the performance and there are some nice useful details throughout.":
    "这正是我喜欢徒步时背的那种耐用又轻量的背包。容量恰到好处，性价比也很高。环保设计很出色，完全没有影响性能，各处细节也很实用。",
  // 登山靴
  "These are some of the most comfortable boots I've ever worn. I've found the fit to be very snug, in a good way. There's a lot of arch support and that greatly enhances the comfort for me. I've found the toe box to be comfortable too; neither narrow or wide, to me it's just right.":
    "这是我穿过的最舒适的靴子之一。贴合度非常好，足弓支撑出色，大大提升了舒适度。鞋头空间也很合适，不宽不窄，刚刚好。",
  "The Montbell Alpine Cruiser 800 is a proper workhorse: a stable, supportive, nicely made leather alpine trekking boot that performs best under load and on rugged UK winter terrain. It's not trying to be light or fast. It's trying to be reliable, and it succeeds there.":
    "Montbell Alpine Cruiser 800是一匹真正的工作马：稳定、支撑性好、做工精良的皮质高山徒步靴，负重和崎岖冬季地形下表现最佳。它不追求轻量或速度，它追求可靠性——并且做到了。",
  "Overall, I'd say the Hoka Kaha 2 is a well made and versatile three-season hiking boot that suits anything from short and easy hikes through to multi-day thru hiking.":
    "总的来说，Hoka Kaha 2是一款做工精良、用途广泛的三季登山靴，适合从简短轻松的徒步到多日长距离徒步的各种场景。",
  "This is one of those hiking boots that I'd call a workhorse - the kind that you'll end up wearing for all manner of things, from long-distance hikes and three-season hillwalks, through to just wearing for a wintry dog walk on the beach or even down to the shops.":
    "这是一款我称之为'工作马'的登山靴——你会穿着它做各种事情，从长距离徒步、三季山地行走，到冬天在海滩遛狗甚至去商店买东西。",
  "Overall this is a very comfortable boot that offers good three-season performance. I can see it being ideal for long distance walking from spring through to autumn and for more general excursions too.":
    "总的来说，这是一款非常舒适的靴子，三季表现出色。我认为它非常适合春秋季的长距离徒步，也适合更日常的户外活动。",
  "This is the kind of boot that I can see being the perfect tool for the job if you're planning some winter hillwalking or if you live somewhere where the trails turn into a Somme-like quagmire when winter rolls around. The craftsmanship is excellent and there's definitely a built-to-last feel.":
    "如果你计划冬季山地行走，或者你住的地方冬天小路会变成泥潭，这款靴子就是完美的选择。工艺精湛，给人一种经久耐用的感觉。",
  "I've had a pair of Hanwag Banks GTX for over a year now and they've risen right to the top of my pile, becoming the pair of boots I reach to for nearly every hill or country walk.":
    "我已经穿Hanwag Banks GTX一年多了，它已经成为我的首选，几乎每次山地或乡村徒步我都会穿它。",
  "It's a superbly comfortable boot that performs well on those days with big mileage.":
    "这是一款极其舒适的靴子，在长距离徒步日表现出色。",
  "I've tested just about all of Danner's main hiking models over the years and these, from what I've seen, are the most complete offering so far.":
    "这些年我几乎测试过Danner所有的主要登山款式，据我所见，这是目前最完善的一款。",
  // 防水夹克
  "A functional jacket that serves as a good all-rounder - and at a reasonable price for a 3L shell.":
    "一款功能全面的夹克——以3层冲锋衣的合理价格提供了出色的综合性能。",
  "Stylish and functional with an excellent balance between weight and durability. An excellent option for three-season long-distance trekking. Shame there are no pit zip vents though.":
    "时尚且功能出色，重量和耐用性之间取得了极佳平衡。是三季长距离徒步的绝佳选择。遗憾的是没有腋下拉链通风口。",
  "The waterproofness and cut impressed me. The hood does let it down though as it's pretty basic and doesn't give create protection in blustery conditions.":
    "防水性能和剪裁让我印象深刻。但兜帽设计比较基础，在大风天气下无法提供足够的保护。",
  "A former best in test on these pages, this is a jacket that ticks a lot of boxes. We found it to be well-specced and protective. It's made for mountaineering but it serves just as nicely as a hiking and trekking jacket.":
    "这是一款曾经的测试冠军，方方面面都很出色。配置齐全、防护性好。专为登山设计，但作为徒步夹克同样表现出色。",
  "At 570g, this is one of the lighter Nikwax Analogy jackets in the Páramo range. So you've got that Páramo breathable protection, but without the weight and bulkiness.":
    "570克的重量，这是Páramo系列中较轻的Nikwax Analogy夹克之一。既有Páramo的透气防护，又没有沉重和臃肿。",
  "Rab know what they're doing when it comes to waterproof jackets. This one has a great feel to it, the details I'd look for from a mountain shell, and a fit that allows for layering.":
    "Rab在防水夹克方面很有一套。这款手感出色，具备我对高山冲锋衣所期望的所有细节，版型也允许内层叠穿。",
  "You get a lot of bang for your buck here. The fabric is tough (which makes it a little on the heavy side), the pit zips are large and the pockets are big enough for an OS map. One of our favourites from the Scottish brand.":
    "性价比很高。面料结实（因此稍重），腋下拉链很大，口袋能装下OS地图。是我们最喜欢的苏格兰品牌产品之一。",
  "Stretchy, waterproof, fairly light and with some nice touches too. A good jacket for runs in very bad conditions.":
    "弹力、防水、相当轻量，还有一些不错的细节。适合恶劣天气下跑步的好夹克。",
  "The eco aspects here are really impressive. Aside from those elements though, it's a hardy jacket with large pockets, useful ventilations options and a reliable hood configuration. I like the cut which is slightly long at the hem.":
    "环保方面令人印象深刻。除此之外，这是一款结实的夹克，大口袋、实用的通风设计和可靠的兜帽配置。我喜欢它的剪裁，下摆略长。",
  "This is a hardy 3-layer shell that feels and performs as well as any Gore-tex Pro jacket would, but at a fraction of the cost. I tried it in my usual size and also in a size up and I preferred the larger size.":
    "这是一款结实的3层冲锋衣，手感和性能不逊于任何Gore-Tex Pro夹克，但价格只是零头。我试了常规码和大一码，更喜欢大一码的。",
  "Another light jacket with a comfy, stretchy fabric that complements fast-moving journeys. The breathability is good too.":
    "又一款轻量夹克，舒适的弹力面料适合快速行进。透气性也很不错。",
  "Small enough to pack into your trouser pocket or into your backpacks hipbelt, but still waterproof and functional. Don't expect stormproof levels of protection but still enough to see off downpours.":
    "小到可以塞进裤兜或背包腰带，但依然防水且功能齐全。不要期待暴风雨级别的防护，但足以应对大雨。",
};

function translateVerdict(verdict) {
  if (!verdict) return '';
  // 尝试精确匹配
  for (const [en, zh] of Object.entries(VERDICT_TRANSLATIONS)) {
    if (verdict === en) return zh;
  }
  // 尝试前缀匹配（verdict 可能被截断或包含额外内容）
  for (const [en, zh] of Object.entries(VERDICT_TRANSLATIONS)) {
    if (verdict.length > 30 && en.startsWith(verdict.substring(0, 60))) return zh;
  }
  // 尝试包含匹配
  for (const [en, zh] of Object.entries(VERDICT_TRANSLATIONS)) {
    if (verdict.includes(en.substring(0, 40))) return zh;
  }
  return verdict;
}

// 处理数据
const processedData = {};

for (const [category, data] of Object.entries(rawData)) {
  const processedProducts = data.products
    .filter(p => p.model && !p.model.includes('Outdoors Gear, Equipment'))
    .map(p => ({
      model: translateModel(cleanHtml(p.model)),
      image: p.image,
      awardTitle: p.awardTitle ? translateAward(p.awardTitle) : '',
      verdict: translateVerdict(cleanHtml(p.verdict)).substring(0, 200),
      isWinner: p.isWinner && !!p.awardTitle
    }));

  processedData[category] = {
    ...data,
    products: processedProducts
  };
}

// 保存处理后的数据
const outputPath = path.join(__dirname, '../src/data/outdoormagic-rankings.json');
fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2));

console.log('Processed rankings saved to:', outputPath);
console.log('\n=== Summary ===');
for (const [id, data] of Object.entries(processedData)) {
  console.log(`${data.icon} ${data.title}: ${data.products.length} products`);
  const winners = data.products.filter(p => p.isWinner);
  console.log(`   Winners: ${winners.length}`);
  winners.forEach(p => console.log(`   - ${p.model}: ${p.awardTitle}`));
}
