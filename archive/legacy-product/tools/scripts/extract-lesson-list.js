const fs = require('fs');
const path = require('path');

// Function to extract lesson data from a JSON file
function extractLessonData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lesson = JSON.parse(content);
    return {
      id: lesson.id,
      title: lesson.title,
      moduleId: parseInt(lesson.id.split('.')[0]),
      lessonNumber: parseInt(lesson.id.split('.')[1])
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Function to get all lesson files
function getAllLessonFiles() {
  const lessonsDir = path.join(__dirname, '..', 'src', 'lessons');
  const lessonFiles = [];
  
  // Get all module directories
  const moduleDirs = fs.readdirSync(lessonsDir)
    .filter(dir => dir.startsWith('module'))
    .sort((a, b) => {
      const aNum = parseInt(a.replace('module', ''));
      const bNum = parseInt(b.replace('module', ''));
      return aNum - bNum;
    });
  
  // Get all lesson files from each module
  moduleDirs.forEach(moduleDir => {
    const modulePath = path.join(lessonsDir, moduleDir);
    const files = fs.readdirSync(modulePath)
      .filter(file => file.startsWith('lesson-') && file.endsWith('.json'))
      .sort((a, b) => {
        const aNum = parseFloat(a.replace('lesson-', '').replace('.json', ''));
        const bNum = parseFloat(b.replace('lesson-', '').replace('.json', ''));
        return aNum - bNum;
      });
    
    files.forEach(file => {
      lessonFiles.push(path.join(modulePath, file));
    });
  });
  
  return lessonFiles;
}

// Main execution
function main() {
  console.log('Extracting lesson data...');
  
  const lessonFiles = getAllLessonFiles();
  const lessons = [];
  
  lessonFiles.forEach(filePath => {
    const lessonData = extractLessonData(filePath);
    if (lessonData) {
      lessons.push(lessonData);
    }
  });
  
  // Sort lessons by module ID and lesson number
  lessons.sort((a, b) => {
    if (a.moduleId !== b.moduleId) {
      return a.moduleId - b.moduleId;
    }
    return a.lessonNumber - b.lessonNumber;
  });
  
  // Create the output structure
  const output = {
    totalLessons: lessons.length,
    generatedAt: new Date().toISOString(),
    lessons: lessons
  };
  
  // Write to file
  const outputPath = path.join(__dirname, '..', 'lesson-list.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log(`✅ Successfully extracted ${lessons.length} lessons to lesson-list.json`);
  console.log(`📁 Output file: ${outputPath}`);
  
  // Display summary
  console.log('\n📊 Summary by module:');
  const moduleSummary = {};
  lessons.forEach(lesson => {
    if (!moduleSummary[lesson.moduleId]) {
      moduleSummary[lesson.moduleId] = 0;
    }
    moduleSummary[lesson.moduleId]++;
  });
  
  Object.keys(moduleSummary).sort((a, b) => parseInt(a) - parseInt(b)).forEach(moduleId => {
    console.log(`  Module ${moduleId}: ${moduleSummary[moduleId]} lessons`);
  });
}

main(); 