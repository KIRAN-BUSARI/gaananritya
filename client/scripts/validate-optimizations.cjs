#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateOptimizations() {
  console.log('🔍 PERFORMANCE OPTIMIZATION VALIDATION');
  console.log('======================================\n');

  const distPath = path.join(__dirname, '../dist');
  const assetsPath = path.join(distPath, 'assets');

  let passCount = 0;
  let totalChecks = 0;

  function check(name, condition, message) {
    totalChecks++;
    if (condition) {
      console.log(`✅ ${name}: ${message}`);
      passCount++;
    } else {
      console.log(`❌ ${name}: ${message}`);
    }
  }

  // Check 1: Build artifacts exist
  check(
    'Build Success',
    fs.existsSync(distPath) && fs.existsSync(assetsPath),
    'Build directory and assets exist'
  );

  // Check 2: Service Worker
  check(
    'Service Worker',
    fs.existsSync(path.join(distPath, 'sw.js')),
    'Service worker file exists'
  );

  // Check 3: Critical CSS
  const criticalCSSExists = fs.existsSync(path.join(distPath, 'critical.css'));
  check(
    'Critical CSS',
    criticalCSSExists,
    criticalCSSExists ? 'Critical CSS extracted successfully' : 'Critical CSS not found'
  );

  // Check 4: Optimized HTML
  const optimizedHTMLExists = fs.existsSync(path.join(distPath, 'index-critical.html'));
  check(
    'Optimized HTML',
    optimizedHTMLExists,
    optimizedHTMLExists ? 'Optimized HTML with inline critical CSS' : 'Optimized HTML not found'
  );

  // Check 5: Code splitting
  const jsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.js'));
  check(
    'Code Splitting',
    jsFiles.length >= 15,
    `${jsFiles.length} JavaScript chunks (good granularity)`
  );

  // Check 6: Main bundle size
  const mainBundle = jsFiles.find(file => file.includes('index-') && file.endsWith('.js'));
  if (mainBundle) {
    const mainBundleSize = fs.statSync(path.join(assetsPath, mainBundle)).size;
    check(
      'Main Bundle Size',
      mainBundleSize < 400000,
      `${(mainBundleSize / 1024).toFixed(2)} KB ${mainBundleSize < 400000 ? '(acceptable)' : '(needs optimization)'}`
    );
  }

  // Check 7: CSS optimization
  const cssFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.css'));
  if (cssFiles.length > 0) {
    const cssSize = fs.statSync(path.join(assetsPath, cssFiles[0])).size;
    check(
      'CSS Size',
      cssSize < 100000,
      `${(cssSize / 1024).toFixed(2)} KB ${cssSize < 100000 ? '(optimized)' : '(could be improved)'}`
    );
  }

  // Check 8: Performance monitoring files
  const perfMonitorExists = fs.existsSync(path.join(__dirname, '../src/utils/performanceMonitor.ts'));
  check(
    'Performance Monitoring',
    perfMonitorExists,
    perfMonitorExists ? 'Performance monitor implemented' : 'Performance monitor missing'
  );

  // Check 9: Image optimization readiness
  const imageOptimizationScript = fs.existsSync(path.join(__dirname, 'optimize-images-advanced.js'));
  check(
    'Image Optimization Tools',
    imageOptimizationScript,
    imageOptimizationScript ? 'Image optimization scripts available' : 'Image optimization tools missing'
  );

  console.log('\n📊 VALIDATION SUMMARY');
  console.log('====================');
  console.log(`✅ Passed: ${passCount}/${totalChecks} checks`);
  console.log(`📈 Success Rate: ${((passCount / totalChecks) * 100).toFixed(1)}%`);

  if (passCount === totalChecks) {
    console.log('🎉 ALL OPTIMIZATIONS VALIDATED SUCCESSFULLY!');
  } else if (passCount / totalChecks >= 0.8) {
    console.log('👍 OPTIMIZATIONS MOSTLY COMPLETE - Minor improvements needed');
  } else {
    console.log('⚠️  OPTIMIZATIONS NEED ATTENTION - Several checks failed');
  }

  // Performance recommendations based on validation
  console.log('\n🚀 NEXT ACTIONS');
  console.log('===============');

  if (criticalCSSExists && optimizedHTMLExists) {
    console.log('1. ✅ Use index-critical.html for production deployment');
    console.log('2. 📊 Monitor Core Web Vitals in production');
  }

  console.log('3. 🖼️  Run image optimization for the largest images:');
  const imageFiles = fs.readdirSync(assetsPath).filter(file => /\.(png|jpg|jpeg)$/i.test(file));
  const largeImages = imageFiles.filter(file => {
    const size = fs.statSync(path.join(assetsPath, file)).size;
    return size > 1000000; // > 1MB
  });

  if (largeImages.length > 0) {
    console.log(`   - Convert ${largeImages.length} images to WebP/AVIF format`);
    largeImages.slice(0, 3).forEach(img => {
      const size = (fs.statSync(path.join(assetsPath, img)).size / 1024 / 1024).toFixed(2);
      console.log(`   - ${img} (${size} MB)`);
    });
  }

  console.log('4. 🔄 Set up automated performance testing');
  console.log('5. 📱 Test on mobile devices for real-world performance');

  console.log('\n✅ Validation complete!');
  return { passed: passCount, total: totalChecks, rate: (passCount / totalChecks) * 100 };
}

// Run validation
if (require.main === module) {
  const results = validateOptimizations();
  process.exit(results.rate >= 80 ? 0 : 1);
}

module.exports = { validateOptimizations };
