# Mathland: Character-Driven Math Learning Platform

> **📚 Complete documentation available at [docs/README.md](docs/README.md)**  
> **🏗️ Clean project structure implemented - see documentation for details**

## Quick Start

```bash
git clone <repository>
npm install
npm run dev
```

**New Project Structure:**
- **Core Application**: `src/core/` - UI components, pages, hooks, types
- **Educational Content**: `src/content/` - Lessons, data
- **Interactive Components**: `src/interactive/` - Educational demos and activities
- **Documentation**: `docs/` - All project documentation
- **Tools**: `tools/` - Build scripts and utilities

## Project Overview

Mathland is an interactive, web-based mathematics learning platform designed to make advanced mathematical concepts engaging and accessible for adult learners transitioning to data science. The platform features a comprehensive curriculum covering algebra, calculus, linear algebra, probability, and statistics through the lens of character-driven storytelling and real-world applications.

## 🎯 **Learning Philosophy**

Mathland transforms abstract mathematical concepts into memorable stories through:

- **Character Guides**: 10 unique mathematical personalities (Ollie the Otter, Vera the Vector, Matrix Max, etc.)
- **Narrative-Driven Learning**: Each concept is introduced through engaging stories and real-world scenarios
- **Progressive Complexity**: Carefully structured learning path from foundations to advanced applications
- **Interactive Elements**: Audio transcripts, visual demonstrations, and hands-on practice activities

## 📚 **Curriculum Structure**

### **10 Comprehensive Modules:**

1. **Module 1**: Prerequisites & Refresher (Algebra foundations)
2. **Module 2**: Vectors & Vector Spaces (Direction and magnitude)
3. **Module 3**: Matrices & Linear Mappings (Transforming spaces)
4. **Module 4**: Eigenvalues & Eigenvectors (Special directions)
5. **Module 5**: Multivariate Calculus Foundations (Multiple variables)
6. **Module 6**: Optimisation & Gradient Descent (Finding the best)
7. **Module 7**: Probability & Distributions (Understanding uncertainty)
8. **Module 8**: Hypothesis Testing & Inference (Making decisions)
9. **Module 9**: Bayesian Inference (Updating beliefs)
10. **Module 10**: Integration & Synthesis (Capstone application)

### **Lesson Structure:**

Each lesson follows a consistent 8-section format:

1. **Narrative Hook** - Story introduction with character interaction
2. **Read** - Core concept explanation with analogies and key points
3. **See** - Visual demonstrations and interactive elements
4. **Hear** - Audio explanations with synchronized transcripts
5. **Do** - Hands-on practice and interactive exercises
6. **Memory Aids** - Mnemonics and visual memory techniques
7. **Concept Check** - Interactive quizzes and assessments
8. **Real World** - Practical applications and career connections

## 🚀 **Current Status**

### **✅ Implemented Features:**

- **Complete Curriculum**: 96 lessons across 10 modules
- **Lesson v2 Pilot**: Beat-based guided story lessons for Module 2 (2.1–2.9)
- **Interactive Library**: 29 registered, production-ready mathematical demos
- **Character System**: 10 unique mathematical guides with distinct personalities and expertise
- **Interactive Learning**: Audio transcripts, progress tracking, and completion badges
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Progress Persistence**: Local storage-based progress tracking
- **Modular Architecture**: Clean, maintainable codebase with separated concerns

### **🎨 Technical Implementation:**

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Audio**: React H5 Audio Player with synchronized transcripts
- **State Management**: React hooks with localStorage persistence
- **Code Organization**: Modular lesson data structure for easy maintenance

## 🛠 **Recent Major Updates**

### **Modular Lesson Data Structure** (Latest)

- Split monolithic lesson data into 10 separate module files
- Improved code maintainability and organization
- Enhanced development workflow for content updates
- Maintained backward compatibility with existing API

### **Character-Driven Learning Experience**

- Implemented 10 unique mathematical character guides
- Each character specializes in specific mathematical domains
- Rich narrative integration throughout all lessons
- Consistent character voice and personality across modules

### **Comprehensive Audio Integration**

- Synchronized audio transcripts for all lessons
- Word-based timing for accurate transcript highlighting
- Audio player with progress tracking and controls
- Character voice integration in audio content

## 🔧 **Development & Deployment**

### **Local Development:**

```bash
git clone <repository>
npm install
npm run dev
```

### **Project Structure:**

```
src/
├── core/                # Pages, shared UI, hooks, and types
├── content/
│   ├── lessons/         # 96 JSON lessons in module1–module10
│   └── beats/           # Lesson v2 beat-authored Module 2 pilot
├── interactive/         # Production demos, registry, and prototypes
└── utils/               # Lesson loading, characters, and module metadata
```

### **Content Management:**

- **Lesson Data**: Edit JSON files in `src/content/lessons/module1`–`module10`
- **Lesson v2 Data**: Edit beat lessons in `src/content/beats/`
- **Character Data**: Update character information in `src/utils/characterData.ts`
- **Module Metadata**: Configure module settings in `src/utils/modulesData.ts`

## 🎯 **Target Audience**

- **Career Changers**: Transitioning to data science roles
- **Adult Learners**: Building mathematical confidence
- **Self-Directed Students**: Seeking structured learning paths
- **Professionals**: Refreshing mathematical foundations

## 🔮 **Future Development**

### **Planned Enhancements:**

- **User Accounts**: Cloud-synced progress and personalized learning paths
- **Advanced Interactives**: More sophisticated mathematical visualizations
- **Assessment System**: Comprehensive progress tracking and skill validation
- **Mobile App**: Native mobile experience with offline capabilities
- **Teacher Tools**: Classroom management and student progress monitoring

### **Content Expansion:**

- **Additional Modules**: Machine learning foundations, deep learning mathematics
- **Specialized Tracks**: Finance, healthcare, engineering applications
- **Advanced Topics**: Optimization algorithms, statistical modeling techniques

## 🌐 **Project URL**

[https://lovable.dev/projects/bce691bb-c063-4907-be7f-a51461ebc50d](https://lovable.dev/projects/bce691bb-c063-4907-be7f-a51461ebc50d)

## 🛠 **Tech Stack**

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Audio**: React H5 Audio Player
- **State Management**: React Hooks + localStorage
- **Deployment**: Lovable Platform

## 🤝 **Contributing**

### **Content Contributions:**

- Edit lesson content in the modular lesson data files
- Update character information and storylines
- Add new interactive elements and visualizations

### **Development Contributions:**

- Enhance UI components and user experience
- Improve audio synchronization and transcript features
- Add new interactive mathematical tools

### **Editing Options:**

- **Lovable Web Interface**: [Project Editor](https://lovable.dev/projects/bce691bb-c063-4907-be7f-a51461ebc50d)
- **Local Development**: Clone repository and run locally
- **GitHub**: Direct repository contributions

## 🚀 **Deployment**

Deploy through the Lovable platform:

1. Open project in Lovable
2. Use Share → Publish feature
3. Configure custom domain (optional)

## 🌍 **Custom Domains**

Custom domains are supported through Lovable:

- Go to Project > Settings > Domains
- Follow the [step-by-step guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

**Mathland** - Where mathematical concepts become unforgettable stories through character-driven learning adventures.
