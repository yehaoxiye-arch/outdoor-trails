---
name: capture-hotlink-images
description: "Capture images from hotlink-protected sources using Puppeteer browser screenshots. Use when images fail to load due to anti-hotlinking, anti-scraping, or CORS restrictions (e.g., smzdm.com, zdmimg.com, alicdn.com). Actions: detect, capture, replace, verify."
---

# Capture Hotlink-Protected Images

Automated solution for obtaining images from websites with anti-hotlinking or anti-scraping protection. Uses Puppeteer to open images in a real browser and capture screenshots.

## When to Apply

Use this method when:
- Image URLs return 403, 404, 567, or other error codes
- Images have Referer-based access restrictions
- Anti-scraping mechanisms block direct downloads
- CDN services require specific headers

## Common Hotlink-Protected Domains

| Domain | Protection Type | Solution |
|--------|-----------------|----------|
| smzdm.com | Referer check | Browser screenshot |
| zdmimg.com | Referer check | Browser screenshot |
| alicdn.com | Token expiration | Browser screenshot |
| qiniucdn.com | Referer check | Browser screenshot |

## Implementation Steps

### Step 1: Detect Hotlink-Protected Images

```javascript
const https = require('https');

function checkImage(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) {
      resolve({ status: 'error', message: 'Too many redirects' });
      return;
    }

    const protocol = url.startsWith('https') ? https : require('http');
    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 200) {
        resolve({ status: 'ok' });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          checkImage(redirectUrl, maxRedirects - 1).then(resolve);
        } else {
          resolve({ status: 'error', code: res.statusCode });
        }
      } else {
        resolve({ status: 'error', code: res.statusCode });
      }
      res.resume();
    });
    req.on('error', (err) => resolve({ status: 'error', message: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'error', message: 'Timeout' });
    });
  });
}
```

### Step 2: Capture Images with Puppeteer

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureImages(products, outputDir) {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = { success: 0, failed: 0, mapping: {} };

  for (const product of products) {
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 800, height: 600 });
      await page.goto(product.imageUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for image to load
      await page.waitForSelector('img', { timeout: 10000 }).catch(() => {});

      const imgElement = await page.$('img');
      if (imgElement) {
        // Generate filename
        const fileName = `${product.brand}_${product.name}`
          .replace(/[^a-zA-Z0-9一-龥]/g, '_')
          .substring(0, 50) + '.png';
        const filePath = path.join(outputDir, fileName);

        // Capture screenshot
        await imgElement.screenshot({ path: filePath });

        // Record mapping
        results.mapping[`${product.brand}_${product.name}`] = `/images/products/${fileName}`;
        results.success++;
        console.log(`✓ ${product.brand} - ${product.name}`);
      } else {
        results.failed++;
        console.log(`✗ ${product.brand} - ${product.name}: No image found`);
      }
    } catch (error) {
      results.failed++;
      console.log(`✗ ${product.brand} - ${product.name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  return results;
}
```

### Step 3: Update Product Data

```javascript
function updateProductImages(mapping, productsFilePath) {
  let content = fs.readFileSync(productsFilePath, 'utf8');
  let updatedCount = 0;

  for (const [key, localPath] of Object.entries(mapping)) {
    const [brand, ...nameParts] = key.split('_');
    const name = nameParts.join('_');

    // Match product block and replace image URL
    const regex = new RegExp(
      `(name:\\s*"${escapeRegex(name)}",\\s*\\n\\s*brand:\\s*"${escapeRegex(brand)}",[\\s\\S]*?image:\\s*")[^"]+(")`,
      'g'
    );

    const before = content;
    content = content.replace(regex, `$1${localPath}$2`);

    if (content !== before) {
      updatedCount++;
    }
  }

  fs.writeFileSync(productsFilePath, content, 'utf8');
  return updatedCount;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

## Complete Workflow

1. **Detect** - Check which images fail to load
2. **Filter** - Identify hotlink-protected domains
3. **Capture** - Use Puppeteer to screenshot images
4. **Save** - Store images locally in `public/images/`
5. **Update** - Replace URLs in product data
6. **Verify** - Confirm images load correctly

## Dependencies

```bash
npm install puppeteer --save-dev
```

## File Structure

```
project/
├── public/
│   └── images/
│       └── products/     # Captured images stored here
├── src/
│   └── data/
│       └── products.ts   # Product data with image paths
└── scripts/
    ├── capture-images.js
    └── update-with-local-images.js
```

## Notes

- Puppeteer downloads Chromium (~300MB) on first install
- Screenshots capture the image as displayed in browser
- Local images eliminate external dependencies
- Works for any domain with anti-hotlinking protection
