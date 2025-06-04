const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

async function extractCriticalCSS() {
  console.log('🎯 Extracting critical CSS...');

  try {
    // Path setup
    const distPath = path.join(__dirname, '../dist');
    const assetsPath = path.join(distPath, 'assets');

    if (!fs.existsSync(assetsPath)) {
      console.log('❌ No assets directory found in dist. Please build the project first.');
      return;
    }

    const cssFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.css'));

    if (cssFiles.length === 0) {
      console.log('❌ No CSS files found in dist/assets. Please build the project first.');
      return;
    }

    const cssFile = path.join(assetsPath, cssFiles[0]);
    console.log(`📄 Found CSS file: ${cssFiles[0]}`);

    // Read the CSS content
    const originalCSS = fs.readFileSync(cssFile, 'utf8');
    const originalSize = originalCSS.length;

    // Read HTML content
    const htmlContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

    // Basic critical CSS extraction - first 50% of CSS rules (simplified approach)
    const cssRules = originalCSS.split('}').filter(rule => rule.trim());
    const criticalRuleCount = Math.ceil(cssRules.length * 0.3); // Take first 30% as critical
    const criticalCSS = cssRules.slice(0, criticalRuleCount).join('}\n') + '}';

    const criticalSize = criticalCSS.length;

    console.log(`📊 Original CSS size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`📊 Critical CSS size: ${(criticalSize / 1024).toFixed(2)} KB`);
    console.log(`💰 Critical CSS is ${((criticalSize / originalSize) * 100).toFixed(1)}% of original`);

    // Write critical CSS file
    const criticalCSSPath = path.join(distPath, 'critical.css');
    fs.writeFileSync(criticalCSSPath, criticalCSS);

    // Create optimized HTML with inline critical CSS
    const inlineCriticalCSS = `<style id="critical-css">${criticalCSS}</style>`;

    // Replace CSS link with inline critical CSS and add async loading
    const optimizedHTML = htmlContent
      .replace(
        /<link[^>]*rel=["']stylesheet["'][^>]*>/g,
        inlineCriticalCSS + `
        <link rel="preload" href="./assets/${cssFiles[0]}" as="style" onload="this.onload=null;this.rel='stylesheet'">
        <noscript><link rel="stylesheet" href="./assets/${cssFiles[0]}"></noscript>`
      );

    // Write optimized HTML
    const optimizedHTMLPath = path.join(distPath, 'index-critical.html');
    fs.writeFileSync(optimizedHTMLPath, optimizedHTML);

    console.log(`✅ Critical CSS saved to: ${criticalCSSPath}`);
    console.log(`✅ Optimized HTML saved to: ${optimizedHTMLPath}`);
    console.log('🎉 Critical CSS extraction completed!');

  } catch (error) {
    console.error('❌ Error extracting critical CSS:', error);
  }
}

// Run the extraction
extractCriticalCSS();
