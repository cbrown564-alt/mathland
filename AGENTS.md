# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server (runs on port 8080)
- `npm run build` - Build production bundle
- `npm run build:dev` - Build development bundle
- `npm run preview` - Preview production build

### Testing & Quality
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests for CI (no watch, with coverage)
- `npm run lint` - Run ESLint on TypeScript/TSX files

## Project Architecture

### Core Structure
This is a React 18 + TypeScript educational platform built with Vite. The project uses a clean three-tier architecture:

1. **Core Application** (`src/core/`): Main UI components, pages, hooks, and TypeScript types
2. **Educational Content** (`src/content/`): JSON-based lesson data organized by modules
3. **Interactive Components** (`src/interactive/`): Educational demos and visualizations

### Key Architectural Patterns

#### Lesson Data System
- **Modular Organization**: Lessons are stored as JSON files in `src/content/lessons/module{X}/`
- **Dynamic Loading**: `src/utils/lessonLoader.ts` provides async lesson loading with caching
- **Type Safety**: All lesson data conforms to `LessonData` interface in `src/core/types/lesson.ts`
- **Module Structure**: Each module has an `index.json` with metadata and lesson list

#### Character-Driven Learning
- **Character System**: 10 unique mathematical characters defined in `src/utils/characterData.ts`
- **Character Integration**: Each lesson is associated with a character who guides the learning
- **Consistent Personality**: Characters have specific traits (reactionVerb, explainVerb, catchphrase)

#### Progress Management
- **Local Storage**: Progress tracked via localStorage using hooks in `src/core/hooks/`
- **Section-Based**: Lessons divided into 8 sections (narrativeHook, read, see, hear, do, memoryAids, conceptCheck, realWorld)
- **Completion Tracking**: Progress persisted across sessions

### Technology Stack
- **Frontend**: React 18 with TypeScript, Vite build tool
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Audio**: React H5 Audio Player for synchronized transcripts
- **Routing**: React Router DOM for navigation
- **State Management**: React hooks with localStorage persistence
- **Testing**: Jest with React Testing Library

### Component Organization
- **`src/core/components/ui/`**: Reusable shadcn/ui components
- **`src/core/components/lesson/`**: Lesson-specific components
- **`src/core/components/experience/`**: Landing page and experience components
- **`src/core/pages/`**: Route-level page components
- **`src/interactive/components/`**: Interactive educational demos (6 production-ready components)
- **`src/interactive/demos/`**: Component registry and metadata
- **`src/interactive/examples/`**: Prototype components for research

### Data Flow
1. **Lesson Loading**: `lessonLoader.ts` dynamically imports JSON lesson data
2. **Character Association**: Characters linked to lessons via `characterId` field
3. **Progress Tracking**: `useLessonProgress` hook manages section completion
4. **Audio Integration**: `useAudioTranscript` handles synchronized audio playback

### Module System
- **10 Modules**: Mathematics curriculum from prerequisites to capstone project
- **Consistent Structure**: Each module follows same lesson format and character integration
- **Progressive Learning**: Modules build upon each other with clear learning objectives

## Interactive Components

### Production-Ready Components (6)
1. **Vera's Vector Playground** - Module 2, Lesson 2.1 - Vector manipulation with drag interaction
2. **Max's Matrix Transformer** - Module 3, Lesson 3.3 - Real-time matrix transformations with canvas
3. **Bayes' Medical Diagnosis** - Module 9, Lesson 9.2 - Interactive probability scenarios
4. **Eileen's Eigenvalue Detective** - Module 4, Lesson 4.2 - Eigenvalue investigation with case files
5. **Delta's Partial Derivative Explorer** - Module 5, Lesson 5.1 - Multivariable calculus visualization
6. **Greta's Gradient Descent Climber** - Module 6, Lesson 6.5 - Optimization algorithm with mountain terrain

### Component Development Patterns
- **Character Integration**: Each component reflects the associated character's personality, color scheme, and teaching style
- **Canvas/SVG Visualization**: Mathematical concepts rendered using HTML5 Canvas or SVG with real-time updates
- **Interactive Controls**: Sliders, drag interactions, and preset buttons for exploration
- **Progress Tracking**: Optional onComplete and onProgress callbacks for lesson integration
- **Mobile Responsive**: Touch-friendly interactions with larger hit targets
- **Educational Scaffolding**: Progressive disclosure with guided exploration and character insights

### Integration Process
1. Create component in `src/interactive/components/`
2. Add to `src/interactive/demos/demo_registry.ts`
3. Export via `src/interactive/index.ts` with wrapper
4. Update lesson JSON: `"doType": "custom", "doComponent": "component_name"`
5. Test build and lesson integration

## Interactive Component Development

For comprehensive guidance on developing interactive components, see `docs/INTERACTIVE_COMPONENT_DEVELOPMENT.md`. This documentation covers:

- **Character Coverage**: Current status (6/10 characters) and planned components
- **Core Development Patterns**: Architecture, theming, and mathematical integration
- **Best Practices**: Performance optimization, accessibility, error handling
- **Integration Patterns**: Lesson integration, wrapper patterns, demo registry
- **Unifying Design Principles**: Progressive disclosure, character consistency, mathematical authenticity

### Character Component Status
- ✅ **Vera, Max, Bayes, Eileen, Delta, Greta** - Production ready
- 🎯 **Pippa, Sigmund, Ollie, Sage** - Planned for development

## Important Notes
- Lessons are numbered 1-10 within each module (not 0-9)
- Audio files and transcripts are synchronized using word-level timing
- All interactive demos are self-contained React components
- Progress is automatically saved to localStorage on section completion
- Character personalities should remain consistent across all interactions
- Interactive components use character-specific color gradients and terminology