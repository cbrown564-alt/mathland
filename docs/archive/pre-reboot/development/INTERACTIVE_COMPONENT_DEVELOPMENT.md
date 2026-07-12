# Interactive Component Development Guide

## Overview

Interactive components support concepts that benefit from manipulation, feedback, or spatial reasoning. Character identity should reinforce the teaching approach without competing with the mathematics.

## Current inventory and status

`src/interactive/demos/demo_registry.ts` is the only authoritative demo inventory. At the July 2026 documentation sweep it contains 30 entries, all marked `ready`, across all 10 characters.

In this registry, `ready` means the component is implemented and available to the application. It does **not** certify mathematical review, lesson integration, accessibility, responsive behavior, performance, or learner validation. Do not maintain a speculative “remaining component” list here; new work must be justified by a learning objective and prioritized in the root roadmap.

Before adding a new component, check whether an existing demo or Tier 2 visual can meet the objective. Before promoting an existing component to release scope, complete the quality review in [content_tiers.md](content_tiers.md).

## Core Development Patterns

### 1. Character-Driven Design

Each component must embody its character's unique personality:

```typescript
// Character theming examples
const characterThemes = {
  vera: {
    primary: 'emerald', // Green for nature/growth
    personality: 'encouraging, nurturing',
    language: 'Let\'s explore together!'
  },
  max: {
    primary: 'blue', // Blue for precision/logic
    personality: 'logical, systematic', 
    language: 'Observe the transformation...'
  },
  greta: {
    primary: 'amber', // Orange for adventure/energy
    personality: 'adventurous, goal-oriented',
    language: 'Time to climb this mountain!'
  }
};
```

### 2. Component Architecture

All interactive components follow a consistent structure:

```typescript
interface InteractiveComponentProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

const ComponentStructure = () => {
  // 1. State Management
  const [activeState, setActiveState] = useState();
  const [userProgress, setUserProgress] = useState(0);
  
  // 2. Character Theming
  const theme = useCharacterTheme(characterId);
  
  // 3. Mathematical Logic
  const calculations = useMathematicalCalculations();
  
  // 4. Visualization (Canvas/SVG)
  const visualization = useVisualization();
  
  // 5. User Interactions
  const interactions = useInteractions();
  
  return (
    <div className={`character-theme-${characterId}`}>
      {/* UI Components */}
    </div>
  );
};
```

### 3. Visualization Technologies

Components use different visualization approaches based on complexity:

#### Canvas-Based (High Performance)
- **Best for**: Real-time animations, complex mathematical plots
- **Examples**: Greta's terrain rendering, Delta's contour plots
- **Key Features**: Direct pixel manipulation, smooth animations

```typescript
const useCanvasVisualization = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Render mathematical visualization
  }, [dependencies]);
};
```

#### SVG-Based (Declarative)
- **Best for**: Geometric transformations, interactive elements
- **Examples**: Max's matrix transformations, Vera's vectors
- **Key Features**: CSS animations, easy interaction handling

```tsx
const SVGVisualization = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <g transform={`matrix(${transformMatrix.join(',')})`}>
      {/* Mathematical elements */}
    </g>
  </svg>
);
```

#### React Components (UI-Heavy)
- **Best for**: Form-based interactions, statistical displays
- **Examples**: Bayes' diagnosis interface, Eileen's investigation panels
- **Key Features**: Rich UI components, complex state management

### 4. Mathematical Integration

Components integrate mathematical concepts at multiple levels:

#### Real-Time Calculations
```typescript
const useMathematicalState = () => {
  const [parameters, setParameters] = useState(defaultParams);
  
  const results = useMemo(() => {
    // Perform mathematical calculations
    return calculateMathematicalResults(parameters);
  }, [parameters]);
  
  return { parameters, setParameters, results };
};
```

#### Educational Scaffolding
```typescript
const useEducationalScaffolding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hints, setHints] = useState([]);
  const [userUnderstanding, setUserUnderstanding] = useState(0);
  
  // Progressive disclosure based on user interaction
  const shouldShowAdvancedFeatures = userUnderstanding > 0.7;
  
  return { currentStep, hints, shouldShowAdvancedFeatures };
};
```

### 5. Mobile Responsiveness

All components must work seamlessly across devices:

```typescript
const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const touchProps = {
    touchAction: 'none', // Prevent scrolling during interaction
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
  
  return { isMobile, touchProps };
};
```

## Best Practices

### 1. Performance Optimization

#### Canvas Rendering
- Use `requestAnimationFrame` for smooth animations
- Implement dirty region tracking for large canvases
- Cache expensive calculations outside render loops

```typescript
const useAnimationFrame = (callback: () => void, deps: any[]) => {
  const requestRef = useRef<number>();
  
  useEffect(() => {
    const animate = () => {
      callback();
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, deps);
};
```

#### State Management
- Use `useMemo` for expensive calculations
- Implement `useCallback` for event handlers
- Minimize re-renders with proper dependency arrays

### 2. Accessibility

#### Keyboard Navigation
```typescript
const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          // Handle left navigation
          break;
        case 'Space':
          // Handle activation
          e.preventDefault();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

#### Screen Reader Support
- Provide meaningful `aria-label` attributes
- Use semantic HTML elements
- Implement live regions for dynamic content updates

### 3. Error Handling

```typescript
const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const handleError = useCallback((error: Error) => {
    console.error('Component error:', error);
    setError(error);
    // Optional: Report to error tracking service
  }, []);
  
  if (error) {
    return (
      <div className="error-fallback">
        <h3>Something went wrong</h3>
        <p>Please refresh and try again.</p>
      </div>
    );
  }
  
  return { handleError };
};
```

## Integration Patterns

### 1. Lesson Integration

Components integrate into lessons via the `customDoComponents` registry:

```typescript
// src/interactive/index.ts
export const customDoComponents = {
  component_name: ComponentWrapper,
};

// Lesson JSON
{
  "doType": "custom",
  "doComponent": "component_name",
  "doInstructions": "Character-specific instructions..."
}
```

### 2. Component Wrapper Pattern

All components use a consistent wrapper pattern for lesson integration:

```typescript
const ComponentWrapper: React.ComponentType<CustomComponentProps> = ({ lesson }) => {
  return React.createElement(ActualComponent, { 
    isPreview: false,
    // Additional props derived from lesson if needed
  });
};
```

### 3. Demo Registry Integration

Components are registered in the demo registry with comprehensive metadata:

```typescript
{
  id: 'character-component-name',
  characterId: 'character',
  title: 'User-Friendly Title',
  description: 'Engaging description...',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  estimatedTime: 'X-Y minutes',
  learningObjectives: ['Objective 1', 'Objective 2'],
  component: ComponentClass,
  status: 'ready' | 'in-development' | 'planned',
  tags: ['tag1', 'tag2']
}
```

## Unifying Design Principles

### 1. Progressive Disclosure
Start simple, reveal complexity gradually based on user interaction and understanding.

### 2. Character Consistency
Each component should feel like a natural extension of its character's personality and teaching style.

### 3. Mathematical Authenticity
All visualizations must be mathematically accurate and pedagogically sound.

### 4. Immediate Feedback
User actions should have immediate, visible consequences to reinforce learning.

### 5. Exploration Over Instruction
Encourage discovery rather than passive consumption of information.

### 6. Cross-Device Excellence
Components must work seamlessly on desktop, tablet, and mobile devices.

### 7. Performance First
Smooth interactions are crucial for maintaining engagement and learning flow.

## Development Workflow

### 1. Planning Phase
- Define learning objectives
- Choose appropriate visualization technology
- Design character integration
- Plan user interaction flow

### 2. Implementation Phase
- Set up component structure
- Implement mathematical logic
- Build visualization layer
- Add character theming
- Ensure mobile responsiveness

### 3. Integration Phase
- Create wrapper component
- Update demo registry
- Add to lesson JSON
- Test lesson integration

### 4. Quality Assurance
- Test across devices
- Verify mathematical accuracy
- Check accessibility compliance
- Performance optimization

## Future Considerations

### Advanced Features
- Multi-user collaborative components
- Adaptive difficulty based on performance
- Integration with external mathematical tools
- Real-time progress analytics

### Technical Improvements
- WebGL for complex 3D visualizations
- WebAssembly for computationally intensive calculations
- Service workers for offline functionality
- Advanced animation libraries for smoother interactions

---

This guide serves as the foundation for creating engaging, educational, and technically excellent interactive components that bring mathematical concepts to life through character-driven storytelling and hands-on exploration.
