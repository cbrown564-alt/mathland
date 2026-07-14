#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Renaming lesson files to match new numbering...\n');

const lessonsDir = path.join(__dirname, '../../src/content/lessons');

// Process each module directory
for (let moduleNum = 1; moduleNum <= 10; moduleNum++) {
  const moduleDir = path.join(lessonsDir, `module${moduleNum}`);
  
  if (!fs.existsSync(moduleDir)) {
    console.log(`⚠️  Module ${moduleNum} directory not found, skipping...`);
    continue;
  }
  
  console.log(`📁 Processing module${moduleNum}...`);
  
  const files = fs.readdirSync(moduleDir);
  const lessonFiles = files.filter(file => 
    file.startsWith('lesson-') && 
    file.endsWith('.json') && 
    file !== 'index.json'
  );
  
  lessonFiles.forEach(file => {
    const oldModuleNum = moduleNum - 1; // Previous module number
    const filePath = path.join(moduleDir, file);
    
    // Check if this file still has the old module number in its name
    if (file.startsWith(`lesson-${oldModuleNum}.`)) {
      // Extract the lesson part (e.g., "1" from "lesson-0.1.json")
      const match = file.match(/lesson-\d+\.(\d+)\.json$/);
      if (match) {
        const lessonNum = match[1];
        const newFileName = `lesson-${moduleNum}.${lessonNum}.json`;
        const newFilePath = path.join(moduleDir, newFileName);
        
        // Rename the file
        fs.renameSync(filePath, newFilePath);
        console.log(`  Renamed: ${file} → ${newFileName}`);
      }
    }
  });
}

console.log('\n🎉 Lesson file renaming complete!'); 