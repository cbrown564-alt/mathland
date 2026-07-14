import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the actual lessons data
function readActualLessons() {
  const lessons = [];
  const contentDir = path.join(__dirname, 'src', 'content', 'lessons');
  
  for (let moduleNum = 1; moduleNum <= 10; moduleNum++) {
    const moduleDir = path.join(contentDir, `module${moduleNum}`);
    
    if (fs.existsSync(moduleDir)) {
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
            doType: lesson.doType || 'static',
            doComponent: lesson.doComponent || null,
            realWorldConnection: lesson.realWorldConnection || ''
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

// Determine tier assignment based on actual lesson content
function determineTier(lesson) {
  // Already has interactive component -> Tier 1
  if (lesson.doType === 'custom' && lesson.doComponent) {
    return 'T1';
  }
  
  // Check if lesson would benefit from interactive component based on content
  const interactiveKeywords = [
    'visualization', 'interactive', 'explore', 'experiment', 'manipulate', 
    'demonstrate', 'simulation', 'calculator', 'playground', 'explorer',
    'visualize', 'practice', 'analyze', 'investigate'
  ];
  
  const complexMathKeywords = [
    'eigenvalue', 'eigenvector', 'matrix transformation', 'optimization',
    'gradient descent', 'probability distribution', 'sampling', 'bayesian',
    'partial derivative', 'multivariable', 'linear combination', 'determinant'
  ];
  
  const fullText = (lesson.title + ' ' + 
                   (lesson.coreConcepts?.join(' ') || '') + ' ' + 
                   (lesson.learningObjectives?.join(' ') || '') + ' ' +
                   (lesson.realWorldConnection || '')).toLowerCase();
  
  const hasInteractiveKeywords = interactiveKeywords.some(keyword => fullText.includes(keyword));
  const hasComplexMath = complexMathKeywords.some(keyword => fullText.includes(keyword));
  
  // High complexity + could benefit from interaction -> Tier 1 (future interactive)
  if (hasComplexMath && hasInteractiveKeywords) {
    return 'T1';
  }
  
  // Check for narrative-heavy content (capstone projects, introductions)
  const narrativeKeywords = ['capstone', 'project', 'introduction', 'overview', 'reflection', 'review'];
  const hasNarrativeKeywords = narrativeKeywords.some(keyword => fullText.includes(keyword));
  
  if (hasNarrativeKeywords || lesson.duration.includes('60') || lesson.duration.includes('90') || lesson.duration.includes('120')) {
    return 'T3';
  }
  
  // Everything else -> Tier 2 (enhanced static)
  return 'T2';
}

// Generate corrected comprehensive lesson plan
function generateCorrectedPlan(lessons) {
  let markdown = `# Corrected Comprehensive Lesson Development Plan\n\n`;
  markdown += `*Based on actual lesson content analysis*\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  
  markdown += `## Executive Summary\n\n`;
  markdown += `This document provides a comprehensive development plan for creating interactive and enhanced content across all 96 lessons in the Mathland educational platform. The plan has been corrected to reflect the actual lesson content rather than hypothetical titles.\n\n`;
  
  // Add tier distribution summary
  const tierCounts = { T1: 0, T2: 0, T3: 0 };
  lessons.forEach(lesson => {
    const tier = determineTier(lesson);
    tierCounts[tier]++;
  });
  
  markdown += `### Tier Distribution\n\n`;
  markdown += `| Tier | Count | Percentage | Description |\n`;
  markdown += `|------|-------|------------|-------------|\n`;
  markdown += `| **Tier 1** | ${tierCounts.T1} | ${Math.round(tierCounts.T1/lessons.length*100)}% | Interactive Components (high development investment) |\n`;
  markdown += `| **Tier 2** | ${tierCounts.T2} | ${Math.round(tierCounts.T2/lessons.length*100)}% | Enhanced Static Graphics (medium development investment) |\n`;
  markdown += `| **Tier 3** | ${tierCounts.T3} | ${Math.round(tierCounts.T3/lessons.length*100)}% | Character-Driven Narrative (writing-focused) |\n\n`;
  
  // Group lessons by module
  const moduleGroups = {};
  lessons.forEach(lesson => {
    const module = lesson.id.split('.')[0];
    if (!moduleGroups[module]) {
      moduleGroups[module] = [];
    }
    moduleGroups[module].push(lesson);
  });
  
  // Character names mapping
  const characterNames = {
    'ollie': 'Ollie',
    'vera': 'Vera', 
    'max': 'Max',
    'eileen': 'Eileen',
    'delta': 'Delta',
    'greta': 'Greta',
    'pippa': 'Pippa',
    'sigmund': 'Sigmund',
    'bayes': 'Bayes',
    'sage': 'Sage'
  };
  
  // Generate module sections
  Object.keys(moduleGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(moduleNum => {
    const moduleLessons = moduleGroups[moduleNum];
    const character = characterNames[moduleLessons[0].characterId] || moduleLessons[0].characterId;
    
    markdown += `## Module ${moduleNum}: ${getModuleTitle(moduleNum)} (${character})\n`;
    markdown += `*${moduleLessons.length} lessons*\n\n`;
    
    markdown += `| Lesson | Title | Tier | Rationale | Implementation |\n`;
    markdown += `|--------|-------|------|-----------|----------------|\n`;
    
    moduleLessons.forEach(lesson => {
      const tier = determineTier(lesson);
      const rationale = getTierRationale(lesson, tier);
      const implementation = getImplementationPlan(lesson, tier);
      
      let tierDisplay = `**${tier}**`;
      if (tier === 'T1' && lesson.doComponent) {
        tierDisplay += ' ✅';
      }
      
      markdown += `| ${lesson.id} | ${lesson.title} | ${tierDisplay} | ${rationale} | ${implementation} |\n`;
    });
    
    // Module summary
    const moduleTierCounts = { T1: 0, T2: 0, T3: 0 };
    moduleLessons.forEach(lesson => {
      const tier = determineTier(lesson);
      moduleTierCounts[tier]++;
    });
    
    markdown += `\n**Module ${moduleNum} Summary**: ${moduleTierCounts.T1} Interactive, ${moduleTierCounts.T2} Enhanced Static, ${moduleTierCounts.T3} Narrative\n\n`;
  });
  
  // Add implementation priorities
  markdown += `---\n\n## Development Priorities\n\n`;
  
  const tier1Lessons = lessons.filter(lesson => determineTier(lesson) === 'T1');
  const completed = tier1Lessons.filter(lesson => lesson.doComponent);
  const remaining = tier1Lessons.filter(lesson => !lesson.doComponent);
  
  markdown += `### Interactive Components Status\n\n`;
  markdown += `**Completed (${completed.length}/${tier1Lessons.length})**:\n`;
  completed.forEach(lesson => {
    markdown += `- ${lesson.id}: ${lesson.doComponent} (${lesson.characterId})\n`;
  });
  
  markdown += `\n**Remaining (${remaining.length}/${tier1Lessons.length})**:\n`;
  remaining.forEach(lesson => {
    markdown += `- ${lesson.id}: ${lesson.title} (${lesson.characterId})\n`;
  });
  
  return markdown;
}

function getModuleTitle(moduleNum) {
  const titles = {
    '1': 'Mathematical Foundations',
    '2': 'Vectors & Linear Combinations', 
    '3': 'Matrices & Linear Transformations',
    '4': 'Eigenvalues, Eigenvectors & Decomposition',
    '5': 'Multivariable Calculus & Optimization',
    '6': 'Optimization & Machine Learning',
    '7': 'Probability & Distributions',
    '8': 'Statistical Inference & Hypothesis Testing',
    '9': 'Bayesian Analysis & Decision Making',
    '10': 'Capstone Projects & Synthesis'
  };
  return titles[moduleNum] || `Module ${moduleNum}`;
}

function getTierRationale(lesson, tier) {
  if (tier === 'T1') {
    if (lesson.doComponent) {
      return 'Complex concepts requiring interactive exploration (completed)';
    }
    return 'Complex mathematical concepts that would benefit from interactive visualization';
  } else if (tier === 'T2') {
    return 'Clear conceptual content suitable for enhanced static graphics';
  } else {
    return 'Narrative-heavy or project-based content requiring character guidance';
  }
}

function getImplementationPlan(lesson, tier) {
  const characterNames = {
    'ollie': 'Ollie',
    'vera': 'Vera', 
    'max': 'Max',
    'eileen': 'Eileen',
    'delta': 'Delta',
    'greta': 'Greta',
    'pippa': 'Pippa',
    'sigmund': 'Sigmund',
    'bayes': 'Bayes',
    'sage': 'Sage'
  };
  
  if (tier === 'T1') {
    if (lesson.doComponent) {
      return `**${lesson.doComponent}** (completed)`;
    }
    return 'New interactive component needed';
  } else if (tier === 'T2') {
    return 'Enhanced static graphics template';
  } else {
    return `${characterNames[lesson.characterId] || lesson.characterId}'s narrative guidance`;
  }
}

// Execute the analysis
try {
  console.log('Analyzing actual lesson content...');
  const lessons = readActualLessons();
  
  console.log(`Analyzed ${lessons.length} lessons`);
  
  const correctedPlan = generateCorrectedPlan(lessons);
  
  // Write the corrected plan
  const outputPath = path.join(__dirname, 'docs', 'development', 'corrected_comprehensive_lesson_plan.md');
  
  // Ensure directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, correctedPlan);
  
  console.log(`Corrected comprehensive lesson plan generated at: ${outputPath}`);
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}