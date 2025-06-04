const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

async function extractCriticalCSS() {
  console.log('🎯 Extracting critical CSS...');

  try {
    // Read the built CSS file
    const distPath = path.join(__dirname, '../dist');
    const assetsPath = path.join(distPath, 'assets');

    // Check if assets directory exists
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

    // Read HTML and JS files to understand what CSS is used
    const htmlContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    const jsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.js'));

    let jsContent = '';
    jsFiles.forEach(jsFile => {
      jsContent += fs.readFileSync(path.join(assetsPath, jsFile), 'utf8');
    });

    // Configure PurgeCSS
    const purgeCSSResult = await new PurgeCSS().purge({
      content: [
        {
          raw: htmlContent,
          extension: 'html'
        },
        {
          raw: jsContent,
          extension: 'js'
        }
      ],
      css: [cssFile],
      safelist: [
        // Always keep these classes
        'html',
        'body',
        '*',
        // Animation classes
        /^animate-/,
        /^animation-/,
        // Responsive classes
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        /^2xl:/,
        // Dynamic classes that might be added by JS
        /^opacity-/,
        /^transform/,
        /^transition/,
        /^duration-/,
        /^ease-/,
        // State classes
        'hover:',
        'focus:',
        'active:',
        'disabled:',
        // Performance optimization classes
        'hw-accelerate',
        'will-change-transform',
        'will-change-opacity',
        // Carousel classes
        'carousel-',
        'slide-',
        // Hero section classes
        'hero-',
        'bg-',
        // Loading states
        'loading',
        'skeleton',
        'blur'
      ],
      defaultExtractor: content => {
        // Extract class names from content
        const matches = content.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_]/g) || [];
        return matches;
      }
    });

    if (purgeCSSResult.length === 0) {
      console.log('❌ No CSS found after purging');
      return;
    }

    const purgedCSS = purgeCSSResult[0].css;
    const originalSize = fs.statSync(cssFile).size;
    const newSize = Buffer.byteLength(purgedCSS, 'utf8');
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);

    console.log(`📊 Original CSS size: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`📊 Purged CSS size: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`💰 Size reduction: ${savings}%`);

    // Extract critical above-the-fold CSS
    const criticalCSS = extractAboveFoldCSS(purgedCSS);

    // Write critical CSS
    const criticalCSSPath = path.join(distPath, 'critical.css');
    fs.writeFileSync(criticalCSSPath, criticalCSS);

    // Write optimized full CSS
    const optimizedCSSPath = path.join(distPath, 'optimized.css');
    fs.writeFileSync(optimizedCSSPath, purgedCSS);

    console.log(`✅ Critical CSS saved to: ${criticalCSSPath}`);
    console.log(`✅ Optimized CSS saved to: ${optimizedCSSPath}`);

    // Generate HTML with inline critical CSS
    generateOptimizedHTML(htmlContent, criticalCSS, cssFiles[0]);

    console.log('🎉 Critical CSS extraction completed!');

  } catch (error) {
    console.error('❌ Error extracting critical CSS:', error);
  }
}

function extractAboveFoldCSS(css) {
  // Extract CSS rules that are likely to be above the fold
  const criticalSelectors = [
    // Base elements
    'html', 'body', '*',
    // Header and navigation
    'header', 'nav', '.navbar', '.header',
    // Hero section
    '.hero', '.hero-section', '[class*="hero"]',
    // Layout containers
    '.container', '.wrapper', '.main',
    // Critical animations and transitions
    '[class*="animate"]', '[class*="transition"]',
    // Loading states
    '.loading', '.skeleton',
    // Typography
    'h1', 'h2', '.text-', '.font-',
    // Buttons (likely above fold)
    '.btn', 'button', '[class*="button"]',
    // Flexbox and grid (likely layout)
    '.flex', '.grid', '.block', '.inline',
    // Background and positioning
    '.bg-', '.absolute', '.relative', '.fixed',
    // Responsive utilities for mobile-first
    '.sm\\:', '.md\\:', '.lg\\:'
  ];

  const rules = css.split('}').map(rule => rule.trim() + '}').filter(rule => rule.length > 2);

  const criticalRules = rules.filter(rule => {
    return criticalSelectors.some(selector => {
      // Simple matching - could be improved with proper CSS parsing
      return rule.includes(selector) || rule.startsWith(selector);
    });
  });

  return criticalRules.join('\n');
}

function generateOptimizedHTML(htmlContent, criticalCSS, originalCSSFile) {
  // Inject critical CSS inline and load full CSS asynchronously
  const criticalStyleTag = `<style id="critical-css">${criticalCSS}</style>`;

  // Create async CSS loading script
  const asyncCSSScript = `
    <script>
      // Load non-critical CSS asynchronously
      const loadCSS = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => {
          // Remove critical CSS once full CSS is loaded
          const criticalCSS = document.getElementById('critical-css');
          if (criticalCSS) {
            criticalCSS.remove();
          }
        };
        document.head.appendChild(link);
      };
      
      // Load CSS after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loadCSS('/${originalCSSFile}'));
      } else {
        loadCSS('/${originalCSSFile}');
      }
    </script>
  `;

  // Replace the original CSS link with critical CSS and async loading
  let optimizedHTML = htmlContent.replace(
    /<link[^>]*rel=["']stylesheet["'][^>]*>/g,
    criticalStyleTag
  );

  // Add async CSS loading script before closing head tag
  optimizedHTML = optimizedHTML.replace(
    '</head>',
    asyncCSSScript + '</head>'
  );

  // Write optimized HTML
  const optimizedHTMLPath = path.join(__dirname, '../dist/index-optimized.html');
  fs.writeFileSync(optimizedHTMLPath, optimizedHTML);

  console.log(`✅ Optimized HTML saved to: ${optimizedHTMLPath}`);
}

// Run the extraction
if (require.main === module) {
  extractCriticalCSS();
}

module.exports = { extractCriticalCSS };
