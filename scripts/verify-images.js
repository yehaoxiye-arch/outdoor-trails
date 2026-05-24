const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function checkImage(url, maxRedirects = 5) {
  return new Promise((resolve) => {
    if (maxRedirects <= 0) {
      resolve({ status: 'error', message: 'Too many redirects' });
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 200) {
        const contentType = res.headers['content-type'];
        if (contentType && contentType.startsWith('image')) {
          resolve({ status: 'ok', code: 200 });
        } else {
          resolve({ status: 'error', code: res.statusCode, message: 'Not an image: ' + contentType });
        }
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        // 跟随重定向
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          checkImage(redirectUrl, maxRedirects - 1).then(resolve);
        } else {
          resolve({ status: 'error', code: res.statusCode, message: 'Redirect without location' });
        }
      } else {
        resolve({ status: 'error', code: res.statusCode });
      }
      res.resume();
    });
    req.on('error', (err) => {
      resolve({ status: 'error', message: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'error', message: 'Timeout' });
    });
  });
}

async function verifyImages() {
  const productsPath = path.join(__dirname, '../src/data/products.ts');
  const content = fs.readFileSync(productsPath, 'utf8');

  // 提取所有图片URL
  const imageRegex = /image: "(https?:\/\/[^"]+)"/g;
  const images = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  console.log('Total images to verify:', images.length);
  console.log('Verifying...\n');

  const results = { ok: 0, error: 0, errors: [] };

  // 验证前20个图片（示例）
  const sampleSize = Math.min(20, images.length);
  for (let i = 0; i < sampleSize; i++) {
    const url = images[i];
    const result = await checkImage(url);
    if (result.status === 'ok') {
      results.ok++;
      process.stdout.write('.');
    } else {
      results.error++;
      results.errors.push({ url, ...result });
      process.stdout.write('X');
    }
  }

  console.log('\n\n=== Verification Results ===');
  console.log('Checked:', sampleSize);
  console.log('OK:', results.ok);
  console.log('Errors:', results.error);

  if (results.errors.length > 0) {
    console.log('\nFailed images:');
    results.errors.forEach(({ url, code, message }) => {
      console.log('  -', url.substring(0, 80) + '...');
      console.log('    Error:', code || message);
    });
  }
}

verifyImages().catch(console.error);
