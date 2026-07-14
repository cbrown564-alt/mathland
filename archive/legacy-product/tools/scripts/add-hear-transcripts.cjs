// Usage:
// 1. Install dependencies: npm install mammoth
// 2. Run: node scripts/add-hear-transcripts.js

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const transcriptDocx = path.join(__dirname, '../public/audio/transcripts/Mathland Full Audio Transcripts.docx');

async function main() {
  // Extract text from the docx file
  const { value: text } = await mammoth.extractRawText({ path: transcriptDocx });

  // Split into lines and normalize
  const lines = text.split(/\r?\n/).map(l => l.trim());

  // Parse lessons
  const lessons = {};
  let currentLesson = null;
  let buffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lessonMatch = line.match(/^Lesson (\d+\.\d+):/);
    if (lessonMatch) {
      if (currentLesson && buffer.length) {
        lessons[currentLesson] = buffer.join('\n').trim();
      }
      currentLesson = lessonMatch[1];
      buffer = [];
      continue;
    }
    if (line.startsWith('Duration:')) continue;
    if (currentLesson) buffer.push(line);
  }
  // Add last lesson
  if (currentLesson && buffer.length) {
    lessons[currentLesson] = buffer.join('\n').trim();
  }

  // Update JSON files
  for (const [lessonId, body] of Object.entries(lessons)) {
    const paragraphs = body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const [moduleNum] = lessonId.split('.');
    const lessonFile = path.join(__dirname, `../src/lessons/module${moduleNum}/lesson-${lessonId}.json`);
    if (fs.existsSync(lessonFile)) {
      const lessonData = JSON.parse(fs.readFileSync(lessonFile, 'utf8'));
      lessonData.hearTranscript = paragraphs;
      fs.writeFileSync(lessonFile, JSON.stringify(lessonData, null, 2));
      console.log(`Updated ${lessonFile}`);
    } else {
      console.warn(`Lesson file not found: ${lessonFile}`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 