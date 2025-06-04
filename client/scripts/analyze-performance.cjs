#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzePerformance() {
  console.log('📊 PERFORMANCE OPTIMIZATION ANALYSIS');
  console.log('=====================================\n');

  const distPath = path.join(__dirname, '../dist');
  const assetsPath = path.join(distPath, 'assets');

  if (!fs.existsSync(distPath)) {
    console.log('❌ No dist directory found. Please build the project first.');
    return;
  }

  // Analyze JavaScript bundles
  console.log('📦 JAVASCRIPT BUNDLE ANALYSIS:');
  console.log('-------------------------------');

  const jsFiles = fs.readdirSync(assetsPath)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const stats = fs.statSync(path.join(assetsPath, file));
      return {
        name: file,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.size - a.size);

  let totalJSSize = 0;
  jsFiles.forEach((file, index) => {
    totalJSSize += file.size;
    const status = file.size > 100000 ? '🚨' : file.size > 50000 ? '⚠️' : '✅';
    console.log(`${status} ${file.name}: ${file.sizeKB} KB`);

    if (index === 0) console.log('   ^ Main bundle (largest)');
    if (file.size > 100000) {
      console.log('   📈 Consider code splitting or lazy loading');
    }
  });

  console.log(`\n📊 Total JS Size: ${(totalJSSize / 1024).toFixed(2)} KB`);
  console.log(`📊 Average chunk size: ${(totalJSSize / jsFiles.length / 1024).toFixed(2)} KB`);

  // Analyze CSS
  console.log('\n🎨 CSS ANALYSIS:');
  console.log('----------------');

  const cssFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.css'));
  cssFiles.forEach(file => {
    const stats = fs.statSync(path.join(assetsPath, file));
    console.log(`📄 ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
  });

  // Check for critical CSS
  if (fs.existsSync(path.join(distPath, 'critical.css'))) {
    const criticalStats = fs.statSync(path.join(distPath, 'critical.css'));
    console.log(`✅ Critical CSS: ${(criticalStats.size / 1024).toFixed(2)} KB`);
  } else {
    console.log('❌ Critical CSS not found');
  }

  // Analyze Images
  console.log('\n🖼️  IMAGE ANALYSIS:');
  console.log('------------------');

  const imageFiles = fs.readdirSync(assetsPath)
    .filter(file => /\.(png|jpg|jpeg|gif|webp|avif)$/i.test(file))
    .map(file => {
      const stats = fs.statSync(path.join(assetsPath, file));
      return {
        name: file,
        size: stats.size,
        sizeMB: (stats.size / 1024 / 1024).toFixed(2)
      };
    })
    .sort((a, b) => b.size - a.size);

  let totalImageSize = 0;
  imageFiles.forEach((file, index) => {
    totalImageSize += file.size;
    const status = file.size > 2000000 ? '🚨' : file.size > 1000000 ? '⚠️' : '✅';
    console.log(`${status} ${file.name}: ${file.sizeMB} MB`);

    if (file.size > 2000000) {
      console.log('   📈 Consider image optimization or WebP/AVIF conversion');
    }
  });

  console.log(`\n📊 Total Image Size: ${(totalImageSize / 1024 / 1024).toFixed(2)} MB`);

  // Performance Recommendations
  console.log('\n🚀 PERFORMANCE RECOMMENDATIONS:');
  console.log('--------------------------------');

  const recommendations = [];

  // JS Bundle recommendations
  const mainBundle = jsFiles[0];
  if (mainBundle && mainBundle.size > 300000) {
    recommendations.push('🔄 Main bundle is large (>300KB). Consider code splitting.');
  }

  // Image recommendations
  const largeImages = imageFiles.filter(img => img.size > 1000000);
  if (largeImages.length > 0) {
    recommendations.push(`🖼️  ${largeImages.length} images are >1MB. Consider optimization.`);
  }

  // Critical CSS check
  if (!fs.existsSync(path.join(distPath, 'critical.css'))) {
    recommendations.push('🎨 Implement critical CSS for faster initial paint.');
  }

  // Service Worker check
  if (fs.existsSync(path.join(distPath, 'sw.js'))) {
    recommendations.push('✅ Service Worker found - good for caching!');
  } else {
    recommendations.push('📱 Consider implementing a Service Worker for caching.');
  }

  if (recommendations.length === 0) {
    console.log('🎉 All major optimizations appear to be in place!');
  } else {
    recommendations.forEach(rec => console.log(rec));
  }

  // Performance Scores
  console.log('\n⚡ ESTIMATED PERFORMANCE SCORES:');
  console.log('--------------------------------');

  const jsScore = totalJSSize < 300000 ? 90 : totalJSSize < 500000 ? 75 : 60;
  const imageScore = totalImageSize < 5000000 ? 85 : totalImageSize < 10000000 ? 70 : 55;
  const overallScore = Math.round((jsScore + imageScore) / 2);

  console.log(`📦 JavaScript Score: ${jsScore}/100`);
  console.log(`🖼️  Image Score: ${imageScore}/100`);
  console.log(`🎯 Overall Score: ${overallScore}/100`);

  if (overallScore >= 85) {
    console.log('🎉 Excellent performance optimization!');
  } else if (overallScore >= 70) {
    console.log('👍 Good performance, minor improvements possible.');
  } else {
    console.log('⚠️  Performance needs improvement.');
  }

  console.log('\n✅ Analysis complete!');
}

analyzePerformance();
