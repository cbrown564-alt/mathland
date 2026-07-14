#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Starting module renumbering from 0-9 to 1-10...\n');

// Step 1: Rename module directories in reverse order to avoid conflicts
console.log('📁 Step 1: Renaming module directories...');
const lessonsDir = path.join(__dirname, '../../src/content/lessons');

// First pass: rename to temporary names to avoid conflicts
for (let i = 9; i >= 0; i--) {
  const oldDir = path.join(lessonsDir, `module${i}`);
  const tempDir = path.join(lessonsDir, `temp_module${i + 1}`);
  
  if (fs.existsSync(oldDir)) {
    fs.renameSync(oldDir, tempDir);
    console.log(`  Renamed module${i} → temp_module${i + 1}`);
  }
}

// Second pass: rename from temp names to final names
for (let i = 0; i <= 9; i++) {
  const tempDir = path.join(lessonsDir, `temp_module${i + 1}`);
  const newDir = path.join(lessonsDir, `module${i + 1}`);
  
  if (fs.existsSync(tempDir)) {
    fs.renameSync(tempDir, newDir);
    console.log(`  Renamed temp_module${i + 1} → module${i + 1}`);
  }
}

// Step 2: Update lesson files within each module
console.log('\n📝 Step 2: Updating lesson files...');
for (let newModuleNum = 1; newModuleNum <= 10; newModuleNum++) {
  const moduleDir = path.join(lessonsDir, `module${newModuleNum}`);
  
  if (!fs.existsSync(moduleDir)) continue;
  
  const files = fs.readdirSync(moduleDir);
  
  files.forEach(file => {
    if (file.endsWith('.json') && file !== 'index.json') {
      const filePath = path.join(moduleDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      try {
        const lesson = JSON.parse(content);
        
        // Update lesson ID (e.g., "0.1" → "1.1")
        if (lesson.id) {
          const oldModuleNum = newModuleNum - 1;
          const lessonPart = lesson.id.split('.')[1];
          lesson.id = `${newModuleNum}.${lessonPart}`;
          console.log(`    Updated lesson ID: ${oldModuleNum}.${lessonPart} → ${lesson.id}`);
        }
        
        // Update module references in lesson content
        let updatedContent = JSON.stringify(lesson, null, 2);
        
        // Replace any module references in text content
        for (let oldNum = 0; oldNum <= 9; oldNum++) {
          const newNum = oldNum + 1;
          // Update "Module 0" → "Module 1" etc in text
          updatedContent = updatedContent.replace(
            new RegExp(`"Module ${oldNum}"`, 'g'), 
            `"Module ${newNum}"`
          );
          // Update module${oldNum} → module${newNum} in any paths
          updatedContent = updatedContent.replace(
            new RegExp(`module${oldNum}`, 'g'),
            `module${newNum}`
          );
        }
        
        fs.writeFileSync(filePath, updatedContent);
        
      } catch (error) {
        console.error(`    ❌ Error updating ${file}:`, error.message);
      }
    }
  });
  
  // Update module index.json
  const indexPath = path.join(moduleDir, 'index.json');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    try {
      const index = JSON.parse(content);
      if (index.moduleId !== undefined) {
        index.moduleId = newModuleNum;
        console.log(`    Updated module index: moduleId = ${newModuleNum}`);
      }
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    } catch (error) {
      console.error(`    ❌ Error updating index.json:`, error.message);
    }
  }
}

// Step 3: Update modulesData.ts
console.log('\n🔧 Step 3: Updating modulesData.ts...');
const modulesDataPath = path.join(__dirname, '../../src/utils/modulesData.ts');
if (fs.existsSync(modulesDataPath)) {
  let content = fs.readFileSync(modulesDataPath, 'utf8');
  
  // Update module IDs in the data structure
  for (let oldNum = 0; oldNum <= 9; oldNum++) {
    const newNum = oldNum + 1;
    // Update id: 0 → id: 1, etc.
    content = content.replace(
      new RegExp(`id:\\s*${oldNum}([,\\s])`, 'g'),
      `id: ${newNum}$1`
    );
    // Update "Module 0" → "Module 1" in titles
    content = content.replace(
      new RegExp(`"Module ${oldNum}"`, 'g'),
      `"Module ${newNum}"`
    );
  }
  
  fs.writeFileSync(modulesDataPath, content);
  console.log('  ✅ Updated modulesData.ts');
}

// Step 4: Update characterData.ts
console.log('\n👾 Step 4: Updating characterData.ts...');
const characterDataPath = path.join(__dirname, '../../src/utils/characterData.ts');
if (fs.existsSync(characterDataPath)) {
  let content = fs.readFileSync(characterDataPath, 'utf8');
  
  // Update module references in character data
  for (let oldNum = 0; oldNum <= 9; oldNum++) {
    const newNum = oldNum + 1;
    // Update moduleId: 0 → moduleId: 1
    content = content.replace(
      new RegExp(`moduleId:\\s*${oldNum}([,\\s])`, 'g'),
      `moduleId: ${newNum}$1`
    );
    // Update "module0" → "module1" in any strings
    content = content.replace(
      new RegExp(`"module${oldNum}"`, 'g'),
      `"module${newNum}"`
    );
  }
  
  fs.writeFileSync(characterDataPath, content);
  console.log('  ✅ Updated characterData.ts');
}

// Step 5: Update any hardcoded module references in components
console.log('\n🔍 Step 5: Updating component files...');
const searchDirs = [
  path.join(__dirname, '../../src/core'),
  path.join(__dirname, '../../src/utils')
];

function updateFileReferences(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      updateFileReferences(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Update module references in code
      for (let oldNum = 0; oldNum <= 9; oldNum++) {
        const newNum = oldNum + 1;
        
        // Update module paths and IDs
        const patterns = [
          { from: new RegExp(`"module${oldNum}"`, 'g'), to: `"module${newNum}"` },
          { from: new RegExp(`'module${oldNum}'`, 'g'), to: `'module${newNum}'` },
          { from: new RegExp(`module${oldNum}/`, 'g'), to: `module${newNum}/` },
          { from: new RegExp(`moduleId:\\s*["']${oldNum}["']`, 'g'), to: `moduleId: "${newNum}"` }
        ];
        
        patterns.forEach(pattern => {
          if (pattern.from.test(content)) {
            content = content.replace(pattern.from, pattern.to);
            updated = true;
          }
        });
      }
      
      if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✅ Updated ${path.relative(process.cwd(), filePath)}`);
      }
    }
  });
}

searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    updateFileReferences(dir);
  }
});

// Step 6: Update any test files or other references
console.log('\n🧪 Step 6: Updating any remaining references...');

// Update lessonLoader.ts module count if it's hardcoded
const lessonLoaderPath = path.join(__dirname, '../../src/utils/lessonLoader.ts');
if (fs.existsSync(lessonLoaderPath)) {
  let content = fs.readFileSync(lessonLoaderPath, 'utf8');
  
  // Update the module count in preloadAllModules if it uses Array.from({ length: 10 })
  // This should already work since we're still loading 10 modules, just numbered 1-10
  console.log('  ✅ lessonLoader.ts should continue working (still 10 modules)');
}

// Update lessonData.ts module initialization
const lessonDataPath = path.join(__dirname, '../../src/utils/lessonData.ts');
if (fs.existsSync(lessonDataPath)) {
  let content = fs.readFileSync(lessonDataPath, 'utf8');
  
  // Update the module loading loop to use 1-10 instead of 0-9
  content = content.replace(
    /Array\.from\(\{\s*length:\s*10\s*\},\s*\(\s*_,\s*i\s*\)\s*=>\s*\{\s*const\s+moduleId\s*=\s*i\.toString\(\);/g,
    'Array.from({ length: 10 }, (_, i) => {\n    const moduleId = (i + 1).toString();'
  );
  
  fs.writeFileSync(lessonDataPath, content);
  console.log('  ✅ Updated lessonData.ts module loading loop');
}

console.log('\n🎉 Module renumbering complete!');
console.log('\nSummary of changes:');
console.log('• Renamed module directories: module0 → module1, ..., module9 → module10');
console.log('• Updated all lesson IDs: 0.1 → 1.1, 0.2 → 1.2, etc.');
console.log('• Updated module references in modulesData.ts and characterData.ts');
console.log('• Updated component files with module references');
console.log('• Updated lesson loading logic to use modules 1-10');
console.log('\n⚠️  Please test the application and run the build to ensure everything works!'); 