# Tier 2 Template System Documentation

## Overview

The Tier 2 template system provides a comprehensive framework for creating enhanced static graphics and educational content that can be produced efficiently (2-4 hours per component). This system bridges the gap between interactive Tier 1 components and narrative Tier 3 content.

## Architecture

### Core Components

#### 1. ProcessFlowTemplate
**Purpose**: Step-by-step procedures and methodologies  
**Use Cases**: Algorithm explanations, mathematical proofs, problem-solving workflows  
**Features**:
- Multiple visual flow layouts (vertical, horizontal, branching, cyclical)
- Interactive step progression
- Character insights per step
- Visual elements (formulas, calculations, diagrams)
- Dependency tracking

**Example Usage**:
```typescript
import { ProcessFlowTemplate } from '@/tier2';

const config = {
  characterId: 'greta',
  templateType: 'process-flow',
  title: 'Gradient Descent Algorithm',
  description: 'Step-by-step optimization process',
  steps: [
    {
      id: 'initialize',
      title: 'Initialize Parameters',
      description: 'Set starting values and learning rate',
      formula: 'θ₀ = random_values, α = 0.01'
    }
  ],
  visualFlow: 'vertical'
};

<ProcessFlowTemplate config={config} characterConfig={characterConfig} interactive={true} />
```

#### 2. ComparisonFrameworkTemplate
**Purpose**: Method and approach comparisons  
**Use Cases**: Algorithm comparisons, technique trade-offs, decision frameworks  
**Features**:
- Card and table view modes
- Criterion-based evaluation
- Advantage/disadvantage analysis
- Decision guide integration
- Interactive selection

**Example Usage**:
```typescript
import { ComparisonFrameworkTemplate } from '@/tier2';

const config = {
  characterId: 'sigmund',
  templateType: 'comparison',
  title: 'Hypothesis Testing Methods',
  items: [
    {
      id: 't-test',
      name: 'Student\'s t-test',
      description: 'Tests mean differences with unknown variance',
      advantages: {
        'simplicity': 'high',
        'robustness': 'medium',
        'speed': 'fast'
      },
      useCases: ['Small sample sizes', 'Normal distributions']
    }
  ],
  criteria: [
    {
      id: 'simplicity',
      name: 'Ease of Use',
      description: 'How simple is the method to apply?',
      icon: '🎯'
    }
  ]
};

<ComparisonFrameworkTemplate config={config} characterConfig={characterConfig} />
```

#### 3. ApplicationContextTemplate
**Purpose**: Real-world applications and scenarios  
**Use Cases**: Industry connections, practical examples, case studies  
**Features**:
- Scenario-based learning
- Industry context integration
- Step-by-step solution walkthroughs
- Mathematical concept mapping
- Professional relevance

**Example Usage**:
```typescript
import { ApplicationContextTemplate } from '@/tier2';

const config = {
  characterId: 'bayes',
  templateType: 'application',
  title: 'Medical Diagnosis Applications',
  scenarios: [
    {
      id: 'covid-testing',
      title: 'COVID-19 Test Accuracy',
      description: 'Analyzing test reliability using Bayes\' theorem',
      problemStatement: 'Given test sensitivity and specificity, what is the probability of having COVID given a positive test?',
      mathematicalConcepts: ['Bayes\' Theorem', 'Conditional Probability', 'Sensitivity/Specificity'],
      steps: [
        {
          id: 'data-collection',
          title: 'Gather Test Data',
          type: 'data-collection',
          description: 'Collect sensitivity, specificity, and prevalence data'
        }
      ]
    }
  ]
};

<ApplicationContextTemplate config={config} characterConfig={characterConfig} />
```

#### 4. MathematicalDiagramTemplate
**Purpose**: Interactive mathematical visualizations  
**Use Cases**: Geometric concepts, function graphs, mathematical relationships  
**Features**:
- SVG-based rendering
- Interactive parameter controls
- Element selection and details
- Mathematical concept explanations
- Responsive design

**Example Usage**:
```typescript
import { MathematicalDiagramTemplate } from '@/tier2';

const config = {
  characterId: 'vera',
  templateType: 'diagram',
  title: 'Vector Addition Visualization',
  width: 600,
  height: 400,
  elements: [
    {
      id: 'vector-a',
      type: 'arrow',
      x: 100,
      y: 200,
      x2: 200,
      y2: 150,
      color: '#3B82F6',
      label: 'Vector A'
    }
  ],
  interactions: [
    {
      id: 'vector-magnitude',
      label: 'Vector A Magnitude',
      min: 0,
      max: 200,
      defaultValue: 100,
      description: 'Adjust the length of Vector A'
    }
  ]
};

<MathematicalDiagramTemplate config={config} characterConfig={characterConfig} interactive={true} />
```

### Design System

#### Character Integration
Each template automatically integrates with the character system:
- Character-specific color schemes
- Consistent avatar placement
- Character voice and personality
- Themed visual elements

#### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Scalable typography

#### Accessibility
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast color options
- Screen reader compatibility

### SVG Component Library

#### Core Components
- **MathematicalShape**: Circles, rectangles, polygons, arcs
- **Arrow**: Straight and curved arrows with labels
- **Axis**: X/Y coordinate systems with ticks and labels
- **Grid**: Coordinate grids with major/minor lines
- **Annotation**: Text labels and callouts
- **Function**: Mathematical function plotting

#### Usage Example
```typescript
import { MathematicalShape, Arrow, Axis } from '@/tier2/components/svg';

<svg width={600} height={400}>
  <Axis 
    type="both" 
    origin={{ x: 300, y: 200 }} 
    length={300}
    showLabels={true}
    title="Position"
  />
  <MathematicalShape
    type="circle"
    center={{ x: 350, y: 150 }}
    size={{ radius: 30 }}
    style={{ color: '#10B981', fillColor: '#10B981' }}
    label="Point A"
  />
  <Arrow
    start={{ x: 300, y: 200 }}
    end={{ x: 350, y: 150 }}
    label="Vector"
    style={{ color: '#3B82F6' }}
  />
</svg>
```

## Development Workflow

### 1. Template Selection
Choose the appropriate template based on content type:
- **Process Flow**: Sequential steps, algorithms
- **Comparison**: Multiple options, trade-offs
- **Application**: Real-world scenarios
- **Diagram**: Visual/geometric concepts

### 2. Configuration Setup
Define template configuration with:
- Character association
- Content structure
- Interactive elements
- Learning objectives

### 3. Content Creation
Develop content using:
- Character-specific language
- Progressive complexity
- Clear learning objectives
- Professional relevance

### 4. Testing and Validation
- Cross-device compatibility
- Accessibility compliance
- Character consistency
- Educational effectiveness

## Integration with Existing System

### Lesson Integration
Templates integrate seamlessly with the existing lesson system:

```json
{
  "seeType": "tier2",
  "seeComponent": "process-flow",
  "seeConfig": {
    "characterId": "greta",
    "title": "Gradient Descent Steps",
    "steps": [...]
  }
}
```

### Character Data
Templates automatically access character data:
- Color schemes
- Personality traits
- Voice patterns
- Visual styling

### Design Consistency
Templates maintain consistency with:
- Existing UI components
- Typography system
- Color palette
- Spacing standards

## Best Practices

### Content Creation
1. **Character Alignment**: Ensure content matches character personality
2. **Progressive Disclosure**: Layer complexity appropriately
3. **Clear Objectives**: Define specific learning outcomes
4. **Professional Relevance**: Connect to real-world applications

### Technical Implementation
1. **Performance**: Optimize for mobile devices
2. **Accessibility**: Include ARIA labels and keyboard navigation
3. **Responsive Design**: Test across screen sizes
4. **Error Handling**: Provide graceful fallbacks

### Quality Assurance
1. **Cross-browser Testing**: Ensure compatibility
2. **Content Review**: Verify mathematical accuracy
3. **User Testing**: Validate educational effectiveness
4. **Performance Monitoring**: Track load times

## Future Enhancements

### Planned Features
- Animation system integration
- Advanced SVG effects
- Audio synchronization
- Multi-language support
- Analytics integration

### Extensibility
The template system is designed for easy extension:
- New template types
- Custom SVG components
- Enhanced interactions
- Advanced theming

This documentation provides a comprehensive guide for using and extending the Tier 2 template system. The system enables efficient creation of high-quality educational content while maintaining consistency with the overall Mathland platform.