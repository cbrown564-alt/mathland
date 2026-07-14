import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract lesson data from JSON files
function extractLessonData() {
  const lessons = [];
  const contentDir = path.join(__dirname, 'src', 'content', 'lessons');
  
  // Read all module directories
  for (let moduleNum = 1; moduleNum <= 10; moduleNum++) {
    const moduleDir = path.join(contentDir, `module${moduleNum}`);
    
    if (fs.existsSync(moduleDir)) {
      // Read all lesson files in the module
      const files = fs.readdirSync(moduleDir);
      const lessonFiles = files.filter(file => file.startsWith('lesson-') && file.endsWith('.json'));
      
      lessonFiles.forEach(file => {
        try {
          const filePath = path.join(moduleDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const lesson = JSON.parse(content);
          
          lessons.push({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            characterId: lesson.characterId,
            coreConcepts: lesson.coreConcepts || [],
            learningObjectives: lesson.learningObjectives || [],
            doType: lesson.doType || 'N/A',
            doComponent: lesson.doComponent || 'N/A'
          });
        } catch (error) {
          console.error(`Error parsing ${file}:`, error.message);
        }
      });
    }
  }
  
  // Sort lessons by module and lesson number
  lessons.sort((a, b) => {
    const [aModule, aLesson] = a.id.split('.').map(Number);
    const [bModule, bLesson] = b.id.split('.').map(Number);
    
    if (aModule !== bModule) {
      return aModule - bModule;
    }
    return aLesson - bLesson;
  });
  
  return lessons;
}

// Generate markdown documentation
function generateLessonsMarkdown(lessons) {
  let markdown = `# Complete Lessons List\n\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  markdown += `Total Lessons: ${lessons.length}\n\n`;
  
  let currentModule = 0;
  
  lessons.forEach(lesson => {
    const [moduleNum] = lesson.id.split('.').map(Number);
    
    // Add module header if we're starting a new module
    if (moduleNum !== currentModule) {
      currentModule = moduleNum;
      markdown += `\n## Module ${moduleNum}\n\n`;
      markdown += `| Lesson ID | Title | Duration | Character | Interactive Component |\n`;
      markdown += `|-----------|-------|----------|-----------|----------------------|\n`;
    }
    
    const component = lesson.doType === 'custom' ? lesson.doComponent : 'N/A';
    markdown += `| ${lesson.id} | ${lesson.title} | ${lesson.duration} | ${lesson.characterId} | ${component} |\n`;
  });
  
  // Add detailed breakdown
  markdown += `\n\n## Detailed Lesson Information\n\n`;
  
  lessons.forEach(lesson => {
    markdown += `### Lesson ${lesson.id}: ${lesson.title}\n\n`;
    markdown += `- **Character**: ${lesson.characterId}\n`;
    markdown += `- **Duration**: ${lesson.duration}\n`;
    markdown += `- **Interactive Component**: ${lesson.doType === 'custom' ? lesson.doComponent : 'None'}\n\n`;
    
    if (lesson.coreConcepts && lesson.coreConcepts.length > 0) {
      markdown += `**Core Concepts**:\n`;
      lesson.coreConcepts.forEach(concept => {
        markdown += `- ${concept}\n`;
      });
      markdown += `\n`;
    }
    
    if (lesson.learningObjectives && lesson.learningObjectives.length > 0) {
      markdown += `**Learning Objectives**:\n`;
      lesson.learningObjectives.forEach(objective => {
        markdown += `- ${objective}\n`;
      });
      markdown += `\n`;
    }
    
    markdown += `---\n\n`;
  });
  
  return markdown;
}

// Main execution
try {
  console.log('Extracting lesson data...');
  const lessons = extractLessonData();
  
  console.log(`Found ${lessons.length} lessons across ${Math.max(...lessons.map(l => parseInt(l.id.split('.')[0])))} modules`);
  
  const markdown = generateLessonsMarkdown(lessons);
  
  // Ensure docs directory exists
  const docsDir = path.join(__dirname, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  // Write the markdown file
  const outputPath = path.join(docsDir, 'lessons_list.md');
  fs.writeFileSync(outputPath, markdown);
  
  console.log(`Lessons list generated at: ${outputPath}`);
  
  // Also output summary statistics
  const moduleStats = {};
  const characterStats = {};
  const interactiveComponents = [];
  
  lessons.forEach(lesson => {
    const module = lesson.id.split('.')[0];
    moduleStats[module] = (moduleStats[module] || 0) + 1;
    characterStats[lesson.characterId] = (characterStats[lesson.characterId] || 0) + 1;
    
    if (lesson.doType === 'custom') {
      interactiveComponents.push({
        lesson: lesson.id,
        title: lesson.title,
        component: lesson.doComponent,
        character: lesson.characterId
      });
    }
  });
  
  console.log('\n=== SUMMARY STATISTICS ===');
  console.log('\nLessons per Module:');
  Object.entries(moduleStats).forEach(([module, count]) => {
    console.log(`  Module ${module}: ${count} lessons`);
  });
  
  console.log('\nLessons per Character:');
  Object.entries(characterStats).forEach(([character, count]) => {
    console.log(`  ${character}: ${count} lessons`);
  });
  
  console.log(`\nInteractive Components: ${interactiveComponents.length} total`);
  interactiveComponents.forEach(comp => {
    console.log(`  ${comp.lesson}: ${comp.component} (${comp.character})`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}