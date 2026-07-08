import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'katex/dist/katex.min.css'
import { ensureInitialized } from './utils/lessonData'

// Initialize lesson data before rendering the app
async function initializeApp() {
  try {
    await ensureInitialized();
    console.log('Lesson data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize lesson data:', error);
  }

  // Render the app after initialization
  createRoot(document.getElementById("root")!).render(<App />);
}

// Start the initialization
initializeApp();
