import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { 
  ProcessFlowTemplate,
  ComparisonFrameworkTemplate,
  ApplicationContextTemplate,
  MathematicalDiagramTemplate
} from '@/tier2';
import type {
  ProcessFlowTemplate as ProcessFlowConfig,
  ComparisonFrameworkTemplate as ComparisonConfig,
  ApplicationContextTemplate as ApplicationConfig,
  MathematicalDiagramTemplate as DiagramConfig,
  CharacterIntegrationConfig
} from '@/tier2/types/templateTypes';

const Tier2Gallery: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('process-flow');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('greta');
  const [interactiveMode, setInteractiveMode] = useState<boolean>(true);

  const characters = [
    { id: 'ollie', name: 'Ollie', icon: '🔧', description: 'Algebraic Foundations' },
    { id: 'vera', name: 'Vera', icon: '🧭', description: 'Vector Operations' },
    { id: 'max', name: 'Max', icon: '📊', description: 'Matrix Transformations' },
    { id: 'eileen', name: 'Eileen', icon: '🔍', description: 'Eigenvalue Analysis' },
    { id: 'delta', name: 'Delta', icon: '📈', description: 'Partial Derivatives' },
    { id: 'greta', name: 'Greta', icon: '⛰️', description: 'Gradient Descent' },
    { id: 'pippa', name: 'Pippa', icon: '🪄', description: 'Probability Magic' },
    { id: 'sigmund', name: 'Sigmund', icon: '👁️', description: 'Hypothesis Testing' },
    { id: 'bayes', name: 'Bayes', icon: '🧪', description: 'Bayesian Analysis' },
    { id: 'sage', name: 'Sage', icon: '🧠', description: 'Data Science Synthesis' }
  ];

  const templates = [
    { id: 'process-flow', name: 'Process Flow', description: 'Step-by-step procedures' },
    { id: 'comparison', name: 'Comparison Framework', description: 'Method comparisons' },
    { id: 'application', name: 'Application Context', description: 'Real-world scenarios' },
    { id: 'diagram', name: 'Mathematical Diagram', description: 'Interactive visualizations' }
  ];

  // Sample character configuration
  const characterConfig: CharacterIntegrationConfig = {
    voice: {
      introNarrative: `Welcome to ${characters.find(c => c.id === selectedCharacter)?.name}'s educational template! Let's explore this concept together.`,
      explanationStyle: 'encouraging and methodical'
    },
    visualPresence: {
      avatarStyle: 'friendly',
      colorScheme: 'character-themed',
      animationStyle: 'subtle'
    },
    interactionPatterns: {
      encouragementTriggers: ['completion', 'correct-answer'],
      hintDelivery: 'contextual',
      feedbackStyle: 'constructive'
    }
  };

  // Sample configurations for each template type
  const processFlowConfig: ProcessFlowConfig = {
    characterId: selectedCharacter,
    templateType: 'process-flow',
    title: 'Gradient Descent Optimization',
    description: 'Learn the step-by-step process of finding the minimum of a function using gradient descent.',
    targetAudience: 'intermediate',
    educationalObjectives: [
      'Understand the gradient descent algorithm',
      'Apply iterative optimization techniques',
      'Recognize convergence patterns'
    ],
    steps: [
      {
        id: 'initialize',
        title: 'Initialize Parameters',
        description: 'Set starting values for parameters and learning rate',
        formula: 'θ₀ = random_values, α = 0.01',
        example: 'θ₀ = [0.5, -0.3], α = 0.01',
        characterInsight: 'Choose your starting point wisely - it affects convergence speed!'
      },
      {
        id: 'compute-gradient',
        title: 'Compute Gradient',
        description: 'Calculate the partial derivatives of the cost function',
        formula: '∇J(θ) = ∂J/∂θ',
        example: 'For θ = [2, 1], gradient = [-0.4, 0.6]',
        characterInsight: 'The gradient points in the direction of steepest ascent, so we go opposite!'
      },
      {
        id: 'update-parameters',
        title: 'Update Parameters',
        description: 'Move in the direction opposite to the gradient',
        formula: 'θ = θ - α∇J(θ)',
        example: 'θ_new = [2, 1] - 0.01 × [-0.4, 0.6] = [2.004, 0.994]',
        characterInsight: 'Small steps lead to steady progress!'
      },
      {
        id: 'check-convergence',
        title: 'Check Convergence',
        description: 'Determine if the algorithm has found the minimum',
        formula: '|θ_new - θ_old| < ε',
        example: 'If |change| < 0.001, we\'ve converged!',
        characterInsight: 'Patience is key - convergence takes time but ensures accuracy.'
      }
    ],
    visualFlow: 'vertical',
    interactionHints: [
      'Try adjusting the learning rate to see how it affects convergence',
      'Watch how the gradient changes as we approach the minimum',
      'Observe the parameter updates in each iteration'
    ]
  };

  const comparisonConfig: ComparisonConfig = {
    characterId: selectedCharacter,
    templateType: 'comparison',
    title: 'Optimization Algorithms Comparison',
    description: 'Compare different optimization algorithms to choose the best one for your problem.',
    targetAudience: 'intermediate',
    educationalObjectives: [
      'Understand trade-offs between optimization methods',
      'Choose appropriate algorithms for different scenarios',
      'Evaluate performance characteristics'
    ],
    items: [
      {
        id: 'gradient-descent',
        name: 'Gradient Descent',
        description: 'Basic iterative optimization using gradients',
        advantages: {
          'simplicity': 'high',
          'memory': 'low',
          'speed': 'medium',
          'convergence': 'good'
        },
        useCases: ['Large datasets', 'Smooth functions', 'Linear models'],
        limitations: ['Slow convergence', 'Sensitive to learning rate', 'Local minima'],
        characterInsight: 'A solid foundation - reliable but not the fastest!'
      },
      {
        id: 'adam',
        name: 'Adam Optimizer',
        description: 'Adaptive learning rate with momentum',
        advantages: {
          'simplicity': 'medium',
          'memory': 'medium',
          'speed': 'high',
          'convergence': 'excellent'
        },
        useCases: ['Deep learning', 'Non-convex functions', 'Noisy gradients'],
        limitations: ['Higher memory usage', 'More hyperparameters', 'Complex implementation'],
        characterInsight: 'The modern choice - adaptive and efficient!'
      },
      {
        id: 'newton-method',
        name: 'Newton\'s Method',
        description: 'Second-order optimization using Hessian matrix',
        advantages: {
          'simplicity': 'low',
          'memory': 'high',
          'speed': 'fast',
          'convergence': 'excellent'
        },
        useCases: ['Small datasets', 'Smooth functions', 'High precision needs'],
        limitations: ['Expensive computation', 'Memory intensive', 'Unstable for large problems'],
        characterInsight: 'Powerful but resource-hungry - use wisely!'
      }
    ],
    criteria: [
      {
        id: 'simplicity',
        name: 'Ease of Implementation',
        description: 'How simple is the algorithm to understand and implement?',
        icon: '🎯'
      },
      {
        id: 'memory',
        name: 'Memory Usage',
        description: 'How much memory does the algorithm require?',
        icon: '💾'
      },
      {
        id: 'speed',
        name: 'Convergence Speed',
        description: 'How quickly does the algorithm reach the optimum?',
        icon: '⚡'
      },
      {
        id: 'convergence',
        name: 'Convergence Quality',
        description: 'How reliably does the algorithm find good solutions?',
        icon: '🎯'
      }
    ],
    decisionGuide: [
      {
        condition: 'Large dataset, simple model',
        recommendation: 'Use Gradient Descent for reliability and low memory usage'
      },
      {
        condition: 'Deep learning, complex model',
        recommendation: 'Use Adam for adaptive learning and fast convergence'
      },
      {
        condition: 'Small dataset, high precision needed',
        recommendation: 'Use Newton\'s Method for quadratic convergence'
      }
    ],
    characterSummary: 'Each algorithm has its strengths - choose based on your specific constraints and requirements!'
  };

  const applicationConfig: ApplicationConfig = {
    characterId: selectedCharacter,
    templateType: 'application',
    title: 'Machine Learning in Healthcare',
    description: 'Explore how optimization algorithms are applied in real-world medical applications.',
    targetAudience: 'intermediate',
    educationalObjectives: [
      'Connect mathematical concepts to healthcare applications',
      'Understand the importance of optimization in medical AI',
      'Apply algorithmic thinking to real problems'
    ],
    scenarios: [
      {
        id: 'medical-diagnosis',
        title: 'Medical Image Diagnosis',
        description: 'Using gradient descent to train neural networks for medical image analysis',
        icon: '🏥',
        difficulty: 'intermediate',
        problemStatement: 'How can we train a neural network to accurately detect tumors in medical scans?',
        mathematicalConcepts: ['Gradient Descent', 'Backpropagation', 'Loss Functions', 'Regularization'],
        industryContext: 'Radiology departments need automated tools to assist doctors in detecting abnormalities in X-rays, MRIs, and CT scans.',
        realWorldImpact: 'Early detection of diseases can save lives and reduce healthcare costs through timely intervention.',
        expectedOutcome: 'A trained model that can highlight suspicious areas in medical images with high accuracy.',
        steps: [
          {
            id: 'data-collection',
            title: 'Collect Medical Images',
            type: 'data-collection',
            description: 'Gather labeled medical images from hospitals and research institutions',
            mathematicalApproach: 'Ensure balanced datasets with proper labels for supervised learning',
            toolsAndTechniques: ['DICOM imaging', 'Data augmentation', 'Cross-validation'],
            example: 'Collect 10,000 chest X-rays with radiologist annotations',
            expectedOutput: 'Clean, labeled dataset ready for training',
            characterInsight: 'Quality data is the foundation of any successful ML model!'
          },
          {
            id: 'model-architecture',
            title: 'Design Neural Network',
            type: 'modeling',
            description: 'Create a convolutional neural network architecture for image classification',
            mathematicalApproach: 'Use convolutional layers to extract features and fully connected layers for classification',
            toolsAndTechniques: ['CNN architecture', 'Dropout', 'Batch normalization'],
            example: 'Design a ResNet-based architecture with 50 layers',
            expectedOutput: 'Model architecture optimized for medical image analysis',
            characterInsight: 'The right architecture can make or break your model performance!'
          },
          {
            id: 'training-optimization',
            title: 'Optimize Training Process',
            type: 'analysis',
            description: 'Apply gradient descent variants to train the network effectively',
            mathematicalApproach: 'Use Adam optimizer with learning rate scheduling and regularization',
            toolsAndTechniques: ['Adam optimizer', 'Learning rate decay', 'L2 regularization'],
            example: 'Train for 100 epochs with initial learning rate 0.001',
            expectedOutput: 'Converged model with high accuracy and low overfitting',
            characterInsight: 'Optimization is an art - balance speed with stability!'
          }
        ],
        characterInsight: 'Healthcare AI requires both mathematical precision and ethical responsibility!'
      }
    ],
    industryConnections: [
      {
        industry: 'Healthcare',
        icon: '🏥',
        description: 'Medical imaging, drug discovery, personalized treatment',
        examples: ['Cancer detection', 'Drug molecule optimization', 'Treatment planning']
      },
      {
        industry: 'Finance',
        icon: '💰',
        description: 'Risk assessment, fraud detection, algorithmic trading',
        examples: ['Credit scoring', 'Market prediction', 'Portfolio optimization']
      },
      {
        industry: 'Technology',
        icon: '💻',
        description: 'Search engines, recommendation systems, autonomous vehicles',
        examples: ['Google Search ranking', 'Netflix recommendations', 'Self-driving cars']
      }
    ],
    characterSummary: 'Mathematics isn\'t just theory - it\'s the engine driving innovation in every industry!'
  };

  const diagramConfig: DiagramConfig = {
    characterId: selectedCharacter,
    templateType: 'diagram',
    title: 'Gradient Descent Visualization',
    description: 'Interactive visualization showing how gradient descent finds the minimum of a function.',
    targetAudience: 'intermediate',
    educationalObjectives: [
      'Visualize the gradient descent process',
      'Understand the effect of learning rate',
      'Observe convergence patterns'
    ],
    width: 600,
    height: 400,
    elements: [
      {
        id: 'function-curve',
        type: 'path',
        pathData: 'M 50 350 Q 150 100 250 200 Q 350 300 450 150 Q 550 50 650 100',
        color: '#3B82F6',
        strokeWidth: 3,
        filled: false,
        label: 'Cost Function J(θ)',
        description: 'The function we want to minimize'
      },
      {
        id: 'current-point',
        type: 'circle',
        x: 150,
        y: 250,
        radius: 8,
        color: '#EF4444',
        filled: true,
        label: 'Current θ',
        description: 'Current parameter value',
        interactionEffects: [
          {
            interactionId: 'theta-position',
            property: 'x',
            multiplier: 3
          }
        ]
      },
      {
        id: 'gradient-arrow',
        type: 'arrow',
        x: 150,
        y: 250,
        x2: 200,
        y2: 220,
        color: '#10B981',
        strokeWidth: 2,
        label: 'Gradient Direction',
        description: 'Direction of steepest ascent',
        interactionEffects: [
          {
            interactionId: 'theta-position',
            property: 'x',
            multiplier: 3
          },
          {
            interactionId: 'learning-rate',
            property: 'x2',
            multiplier: 50
          }
        ]
      },
      {
        id: 'step-arrow',
        type: 'arrow',
        x: 150,
        y: 250,
        x2: 120,
        y2: 270,
        color: '#F59E0B',
        strokeWidth: 2,
        label: 'Update Step',
        description: 'Direction of parameter update',
        interactionEffects: [
          {
            interactionId: 'theta-position',
            property: 'x',
            multiplier: 3
          },
          {
            interactionId: 'learning-rate',
            property: 'x2',
            multiplier: -30
          }
        ]
      },
      {
        id: 'minimum-point',
        type: 'circle',
        x: 400,
        y: 180,
        radius: 6,
        color: '#8B5CF6',
        filled: true,
        label: 'Global Minimum',
        description: 'The optimal solution we\'re seeking'
      }
    ],
    interactions: [
      {
        id: 'theta-position',
        label: 'Parameter Position (θ)',
        description: 'Move the current parameter position along the function',
        min: 0,
        max: 100,
        defaultValue: 30,
        step: 1
      },
      {
        id: 'learning-rate',
        label: 'Learning Rate (α)',
        description: 'Adjust the step size for parameter updates',
        min: 0.1,
        max: 2.0,
        defaultValue: 0.5,
        step: 0.1
      },
      {
        id: 'iterations',
        label: 'Iterations',
        description: 'Number of optimization steps taken',
        min: 0,
        max: 50,
        defaultValue: 10,
        step: 1
      }
    ],
    mathematicalConcepts: [
      {
        name: 'Gradient',
        description: 'The slope of the function at a given point',
        formula: '∇J(θ) = dJ/dθ'
      },
      {
        name: 'Learning Rate',
        description: 'Controls the size of each optimization step',
        formula: 'θ_new = θ_old - α∇J(θ)'
      },
      {
        name: 'Convergence',
        description: 'When the algorithm reaches the minimum',
        formula: '|θ_new - θ_old| < ε'
      }
    ],
    learningObjectives: [
      'Understand how gradient descent navigates the parameter space',
      'See the effect of learning rate on convergence speed and stability',
      'Recognize when the algorithm has converged to a minimum'
    ],
    characterSummary: 'Gradient descent is like hiking downhill - follow the steepest path to reach the bottom!'
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'process-flow':
        return (
          <ProcessFlowTemplate
            config={processFlowConfig}
            characterConfig={characterConfig}
            interactive={interactiveMode}
          />
        );
      case 'comparison':
        return (
          <ComparisonFrameworkTemplate
            config={comparisonConfig}
            characterConfig={characterConfig}
            interactive={interactiveMode}
          />
        );
      case 'application':
        return (
          <ApplicationContextTemplate
            config={applicationConfig}
            characterConfig={characterConfig}
            interactive={interactiveMode}
          />
        );
      case 'diagram':
        return (
          <MathematicalDiagramTemplate
            config={diagramConfig}
            characterConfig={characterConfig}
            interactive={interactiveMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tier 2 Template Gallery
          </h1>
          <p className="text-lg text-gray-600">
            Explore all four template types with different characters and interaction modes
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Template Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <span className="font-semibold">{template.name}</span>
                    <span className="text-xs text-gray-600">{template.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Character Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Character Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {characters.map((character) => (
                  <Button
                    key={character.id}
                    variant={selectedCharacter === character.id ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                    onClick={() => setSelectedCharacter(character.id)}
                  >
                    <span className="text-xl">{character.icon}</span>
                    <span className="font-medium text-sm">{character.name}</span>
                    <span className="text-xs text-gray-600">{character.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Display Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  variant={interactiveMode ? "default" : "outline"}
                  onClick={() => setInteractiveMode(!interactiveMode)}
                >
                  {interactiveMode ? "📱 Interactive Mode" : "📄 Static Mode"}
                </Button>
                <Badge variant="secondary">
                  Current: {templates.find(t => t.id === selectedTemplate)?.name} + {characters.find(c => c.id === selectedCharacter)?.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Display */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">
                  {characters.find(c => c.id === selectedCharacter)?.icon}
                </span>
                {templates.find(t => t.id === selectedTemplate)?.name} Template
                <Badge variant="outline">
                  {interactiveMode ? "Interactive" : "Static"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg bg-white">
                {renderTemplate()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Information */}
        <Card>
          <CardHeader>
            <CardTitle>Template System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Template Types</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Process Flow:</strong> Step-by-step procedures</li>
                      <li>• <strong>Comparison:</strong> Method evaluations</li>
                      <li>• <strong>Application:</strong> Real-world scenarios</li>
                      <li>• <strong>Diagram:</strong> Interactive visualizations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Features</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Character-specific theming</li>
                      <li>• Interactive and static modes</li>
                      <li>• Mobile-responsive design</li>
                      <li>• Accessibility support</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="characters" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map((character) => (
                    <Card key={character.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{character.icon}</span>
                        <div>
                          <h4 className="font-semibold">{character.name}</h4>
                          <p className="text-sm text-gray-600">{character.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="usage" className="space-y-4">
                <div className="prose max-w-none">
                  <h4 className="font-semibold mb-2">How to Use Templates</h4>
                  <ol className="space-y-2 text-sm">
                    <li>1. Choose the appropriate template type based on your content</li>
                    <li>2. Select a character that matches your learning objectives</li>
                    <li>3. Configure the template with your specific content</li>
                    <li>4. Toggle between interactive and static modes as needed</li>
                    <li>5. Test across different devices and screen sizes</li>
                  </ol>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Educational Use Cases</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Algorithm explanations</li>
                      <li>• Method comparisons</li>
                      <li>• Real-world applications</li>
                      <li>• Interactive demonstrations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Content Creation</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 2-4 hour development time</li>
                      <li>• Consistent character integration</li>
                      <li>• Professional quality output</li>
                      <li>• Cross-platform compatibility</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tier2Gallery;