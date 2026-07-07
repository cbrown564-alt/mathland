import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { Badge } from '@/core/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';

// Import all interactive components
import {
  VeraVectorPlayground,
  VeraVectorArithmetic,
  VeraLinearCombination,
  MaxMatrixTransformer,
  MaxDeterminantExplorer,
  BayesMedicalDiagnosis,
  EileenEigenvalueDetective,
  EileenDiagonalizationExplorer,
  EileenPCADimensionReducer,
  EileenMatrixPowers,
  EileenComplexEigenvalues,
  DeltaPartialDerivativeExplorer,
  DeltaGradientExplorer,
  DeltaConstrainedOptimization,
  GretaGradientDescentClimber,
  GretaHessianAnalyzer,
  PippaProbabilityMagic,
  PippaCLTDemonstration,
  PippaRandomVariables,
  SigmundHypothesisArena,
  OllieFoundationBuilder,
  OllieEquationSolver,
  OllieFunctionGrapher,
  SageDataSynthesizer
} from '@/interactive';
// The registry is the single source of truth for the interactive component
// count (Path A7). The gallery keeps richer display metadata, but the count
// shown here derives from the registry so the two cannot drift.
import { interactiveDemos } from '@/interactive/demos/demo_registry';

const InteractiveGallery: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('vera-vector-playground');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');

  const components = [
    // Module 1 - Ollie Components
    {
      id: 'ollie-foundation-builder',
      name: 'Foundation Builder',
      character: 'ollie',
      characterName: 'Ollie',
      icon: '🔧',
      description: 'Build algebraic foundations with interactive manipulation',
      features: ['Algebraic Manipulation', 'Expression Building', 'Step-by-step Solutions', 'Pattern Recognition'],
      complexity: 'Medium',
      lines: 506,
      module: 'Module 1',
      lesson: 'Lesson 1.2',
      component: OllieFoundationBuilder,
      mathConcepts: ['Algebraic Expressions', 'Factoring', 'Expansion', 'Equation Solving'],
      keyFeatures: 'Construction-themed algebraic manipulation with building metaphors'
    },
    {
      id: 'ollie-equation-solver',
      name: 'Equation Balance Builder',
      character: 'ollie',
      characterName: 'Ollie',
      icon: '⚖️',
      description: 'Master linear and quadratic equations with step-by-step solutions',
      features: ['Balance Visualization', 'Step-by-step Solutions', 'Equation Types', 'Solution Verification'],
      complexity: 'Medium',
      lines: 520,
      module: 'Module 1',
      lesson: 'Lesson 1.3',
      component: OllieEquationSolver,
      mathConcepts: ['Linear Equations', 'Quadratic Equations', 'Balance Principle', 'Solution Methods'],
      keyFeatures: 'Interactive equation solving with balance visualization and progress tracking'
    },
    {
      id: 'ollie-function-grapher',
      name: 'Blueprint Function Grapher',
      character: 'ollie',
      characterName: 'Ollie',
      icon: '📐',
      description: 'Visualize functions as engineering blueprints with interactive controls',
      features: ['Function Graphing', 'Parameter Controls', 'Multiple Function Types', 'Blueprint Theme'],
      complexity: 'Medium',
      lines: 510,
      module: 'Module 1',
      lesson: 'Lesson 1.6',
      component: OllieFunctionGrapher,
      mathConcepts: ['Linear Functions', 'Quadratic Functions', 'Exponential Functions', 'Function Properties'],
      keyFeatures: 'Engineering-themed function visualization with interactive parameter controls'
    },
    
    // Module 2 - Vera Components
    {
      id: 'vera-vector-playground',
      name: 'Vector Playground',
      character: 'vera',
      characterName: 'Vera',
      icon: '🧭',
      description: 'Interactive vector operations with drag-and-drop functionality',
      features: ['Canvas Rendering', 'Drag Interactions', 'Vector Math', 'Real-time Calculations'],
      complexity: 'High',
      lines: 476,
      module: 'Module 2',
      lesson: 'Lesson 2.1',
      component: VeraVectorPlayground,
      mathConcepts: ['Vector Addition', 'Scalar Multiplication', 'Dot Product', 'Vector Magnitude'],
      keyFeatures: 'Drag vectors to see real-time calculations and visualizations'
    },
    {
      id: 'vera-vector-arithmetic',
      name: 'Vector Arithmetic Adventure',
      character: 'vera',
      characterName: 'Vera',
      icon: '🔢',
      description: 'Master vector addition, subtraction, and dot products with interactive exploration',
      features: ['Vector Operations', 'Geometric Visualization', 'Interactive Controls', 'Step-by-step Calculations'],
      complexity: 'Medium',
      lines: 450,
      module: 'Module 2',
      lesson: 'Lesson 2.2',
      component: VeraVectorArithmetic,
      mathConcepts: ['Vector Addition', 'Vector Subtraction', 'Dot Product', 'Scalar Multiplication'],
      keyFeatures: 'Interactive vector arithmetic with geometric interpretation'
    },
    {
      id: 'vera-linear-combination',
      name: 'Linear Combination Laboratory',
      character: 'vera',
      characterName: 'Vera',
      icon: '🔬',
      description: 'Explore how vectors combine to span spaces and understand linear independence',
      features: ['Linear Combinations', 'Vector Span', 'Independence Analysis', 'Interactive Coefficients'],
      complexity: 'High',
      lines: 480,
      module: 'Module 2',
      lesson: 'Lesson 2.4',
      component: VeraLinearCombination,
      mathConcepts: ['Linear Combinations', 'Vector Span', 'Linear Independence', 'Coefficient Effects'],
      keyFeatures: 'Laboratory-style exploration of vector combinations and span'
    },
    
    // Module 3 - Max Components
    {
      id: 'max-matrix-transformer',
      name: 'Matrix Transformer',
      character: 'max',
      characterName: 'Max',
      icon: '📊',
      description: 'Real-time matrix transformations with geometric visualization',
      features: ['Matrix Operations', 'Geometric Transformations', 'Real-time Updates', 'Interactive Grid'],
      complexity: 'Medium',
      lines: 433,
      module: 'Module 3',
      lesson: 'Lesson 3.3',
      component: MaxMatrixTransformer,
      mathConcepts: ['Matrix Multiplication', 'Linear Transformations', 'Eigenvalues', 'Geometric Interpretation'],
      keyFeatures: 'Interactive matrix manipulation with geometric transformation preview'
    },
    {
      id: 'max-determinant-explorer',
      name: 'Determinant Detective Agency',
      character: 'max',
      characterName: 'Max',
      icon: '🕵️',
      description: 'Investigate how matrices transform shapes and discover the geometric meaning of determinants',
      features: ['Determinant Calculation', 'Area Scaling', 'Matrix Transformations', 'Geometric Interpretation'],
      complexity: 'Medium',
      lines: 420,
      module: 'Module 3',
      lesson: 'Lesson 3.4',
      component: MaxDeterminantExplorer,
      mathConcepts: ['Determinants', 'Area Scaling', 'Matrix Transformations', 'Geometric Meaning'],
      keyFeatures: 'Detective-style determinant investigation with geometric visualization'
    },
    
    // Module 4 - Eileen Components
    {
      id: 'eileen-eigenvalue-detective',
      name: 'Eigenvalue Detective',
      character: 'eileen',
      characterName: 'Eileen',
      icon: '🔍',
      description: 'Investigate eigenvalues and eigenvectors with detective work',
      features: ['Eigenvalue Calculation', 'Eigenvector Visualization', 'Investigation Tools', 'Case Files'],
      complexity: 'High',
      lines: 437,
      module: 'Module 4',
      lesson: 'Lesson 4.2',
      component: EileenEigenvalueDetective,
      mathConcepts: ['Eigenvalues', 'Eigenvectors', 'Matrix Diagonalization', 'Spectral Analysis'],
      keyFeatures: 'Detective-style eigenvalue investigation with case file metaphors'
    },
    {
      id: 'eileen-diagonalization-explorer',
      name: 'Diagonalization Detective Lab',
      character: 'eileen',
      characterName: 'Eileen',
      icon: '🔬',
      description: 'Investigate how matrices can be diagonalized and discover the power of eigenvalue decomposition',
      features: ['Matrix Diagonalization', 'Eigenspace Visualization', 'P and D Matrix Construction', 'Decomposition Process'],
      complexity: 'High',
      lines: 580,
      module: 'Module 4',
      lesson: 'Lesson 4.5',
      component: EileenDiagonalizationExplorer,
      mathConcepts: ['Matrix Diagonalization', 'Eigenspaces', 'Matrix Decomposition', 'Linear Algebra'],
      keyFeatures: 'Laboratory-style diagonalization investigation with step-by-step decomposition'
    },
    {
      id: 'eileen-matrix-powers',
      name: 'Matrix Time Machine',
      character: 'eileen',
      characterName: 'Eileen',
      icon: '⏰',
      description: 'Discover how eigenvalues control the future! Watch systems evolve over time',
      features: ['Matrix Powers', 'Time Evolution', 'Population Dynamics', 'Eigenvalue Analysis'],
      complexity: 'High',
      lines: 712,
      module: 'Module 4',
      lesson: 'Lesson 4.7',
      component: EileenMatrixPowers,
      mathConcepts: ['Matrix Powers', 'Dynamic Systems', 'Population Models', 'Long-term Behavior'],
      keyFeatures: 'Time machine visualization of matrix powers and system evolution'
    },
    {
      id: 'eileen-complex-eigenvalues',
      name: 'Complex Eigenvalue Dance Studio',
      character: 'eileen',
      characterName: 'Eileen',
      icon: '🌀',
      description: 'Uncover the mysteries of complex eigenvalues and their spiraling motions',
      features: ['Complex Eigenvalues', 'Spiral Trajectories', 'Oscillatory Behavior', 'Complex Plane Visualization'],
      complexity: 'Advanced',
      lines: 798,
      module: 'Module 4',
      lesson: 'Lesson 4.8',
      component: EileenComplexEigenvalues,
      mathConcepts: ['Complex Eigenvalues', 'Oscillatory Motion', 'Spiral Trajectories', 'Stability Analysis'],
      keyFeatures: 'Dance studio visualization of complex eigenvalue behavior and spiral motions'
    },
    {
      id: 'eileen-pca-dimension-reducer',
      name: 'PCA Dimension Reducer',
      character: 'eileen',
      characterName: 'Eileen',
      icon: '📉',
      description: 'Discover hidden patterns in data and reduce dimensions while preserving variance',
      features: ['Principal Component Analysis', 'Dimensionality Reduction', 'Variance Preservation', 'Data Visualization'],
      complexity: 'High',
      lines: 650,
      module: 'Module 4',
      lesson: 'Lesson 4.9',
      component: EileenPCADimensionReducer,
      mathConcepts: ['Principal Component Analysis', 'Eigenvalue Decomposition', 'Dimensionality Reduction', 'Data Analysis'],
      keyFeatures: 'Interactive PCA with real data and variance preservation visualization'
    },
    
    // Module 5 - Delta Components
    {
      id: 'delta-partial-derivative-explorer',
      name: 'Partial Derivative Explorer',
      character: 'delta',
      characterName: 'Delta',
      icon: '📈',
      description: 'Explore multivariable calculus with interactive surface plots',
      features: ['3D Visualization', 'Surface Plots', 'Gradient Calculation', 'Interactive Controls'],
      complexity: 'High',
      lines: 495,
      module: 'Module 5',
      lesson: 'Lesson 5.1',
      component: DeltaPartialDerivativeExplorer,
      mathConcepts: ['Partial Derivatives', 'Gradients', 'Multivariable Functions', 'Surface Analysis'],
      keyFeatures: 'Interactive 3D surface with gradient visualization and controls'
    },
    {
      id: 'delta-gradient-explorer',
      name: 'Gradient Direction Laboratory',
      character: 'delta',
      characterName: 'Delta',
      icon: '🧭',
      description: 'Explore directional derivatives and discover how gradients point in the direction of steepest ascent',
      features: ['Directional Derivatives', 'Gradient Fields', 'Contour Lines', 'Steepest Ascent'],
      complexity: 'High',
      lines: 520,
      module: 'Module 5',
      lesson: 'Lesson 5.2',
      component: DeltaGradientExplorer,
      mathConcepts: ['Gradients', 'Directional Derivatives', 'Contour Lines', 'Optimization'],
      keyFeatures: 'Laboratory exploration of gradient fields and directional derivatives'
    },
    {
      id: 'delta-constrained-optimization',
      name: 'Constrained Optimization Lab',
      character: 'delta',
      characterName: 'Delta',
      icon: '🔗',
      description: 'Master Lagrange multipliers and solve optimization problems with real-world constraints',
      features: ['Lagrange Multipliers', 'Constrained Optimization', 'Constraint Visualization', 'Real-world Problems'],
      complexity: 'Advanced',
      lines: 680,
      module: 'Module 5',
      lesson: 'Lesson 5.4',
      component: DeltaConstrainedOptimization,
      mathConcepts: ['Lagrange Multipliers', 'Constrained Optimization', 'Equality Constraints', 'Optimization Theory'],
      keyFeatures: 'Advanced optimization laboratory with constraint visualization and real-world applications'
    },
    
    // Module 6 - Greta Components
    {
      id: 'greta-gradient-descent-climber',
      name: 'Gradient Descent Climber',
      character: 'greta',
      characterName: 'Greta',
      icon: '⛰️',
      description: 'Climb mountains using gradient descent optimization',
      features: ['Terrain Visualization', 'Optimization Path', 'Learning Rate Control', 'Convergence Analysis'],
      complexity: 'High',
      lines: 560,
      module: 'Module 6',
      lesson: 'Lesson 6.5',
      component: GretaGradientDescentClimber,
      mathConcepts: ['Gradient Descent', 'Optimization', 'Learning Rate', 'Convergence'],
      keyFeatures: 'Mountain terrain with interactive climbing and optimization visualization'
    },
    {
      id: 'greta-hessian-analyzer',
      name: 'Hessian Mountain Surveyor',
      character: 'greta',
      characterName: 'Greta',
      icon: '🏔️',
      description: 'Master the art of curvature analysis using the Hessian matrix',
      features: ['Hessian Matrix', 'Second Derivative Test', 'Critical Point Classification', 'Curvature Analysis'],
      complexity: 'Advanced',
      lines: 830,
      module: 'Module 6',
      lesson: 'Lesson 6.3',
      component: GretaHessianAnalyzer,
      mathConcepts: ['Hessian Matrix', 'Second Derivative Test', 'Critical Points', 'Curvature Analysis'],
      keyFeatures: 'Mountain surveying with Hessian analysis and critical point classification'
    },
    
    // Module 7 - Pippa Components
    {
      id: 'pippa-probability-magic',
      name: 'Probability Magic Show',
      character: 'pippa',
      characterName: 'Pippa',
      icon: '🪄',
      description: 'Magical probability distributions and statistical tricks',
      features: ['Distribution Visualization', 'Parameter Controls', 'Statistical Magic', 'Interactive Simulations'],
      complexity: 'Medium',
      lines: 423,
      module: 'Module 7',
      lesson: 'Lesson 7.4',
      component: PippaProbabilityMagic,
      mathConcepts: ['Probability Distributions', 'Statistical Inference', 'Random Variables', 'Simulation'],
      keyFeatures: 'Magic-themed probability exploration with interactive distributions'
    },
    {
      id: 'pippa-random-variables',
      name: 'Random Variable Magic Show',
      character: 'pippa',
      characterName: 'Pippa',
      icon: '🎲',
      description: 'Transform chaotic outcomes into mathematical magic with random variables',
      features: ['Random Variables', 'Distribution Functions', 'Probability Mass Functions', 'Experiment Design'],
      complexity: 'Medium',
      lines: 650,
      module: 'Module 7',
      lesson: 'Lesson 7.3',
      component: PippaRandomVariables,
      mathConcepts: ['Random Variables', 'PMF', 'PDF', 'Distribution Properties'],
      keyFeatures: 'Magic show exploration of random variables and their distributions'
    },
    {
      id: 'pippa-clt-demonstration',
      name: 'Central Limit Theorem Magic Show',
      character: 'pippa',
      characterName: 'Pippa',
      icon: '🎭',
      description: 'Witness the most magical theorem in probability through interactive demonstration',
      features: ['Central Limit Theorem', 'Sample Means', 'Normal Approximation', 'Interactive Sampling'],
      complexity: 'High',
      lines: 570,
      module: 'Module 7',
      lesson: 'Lesson 7.5',
      component: PippaCLTDemonstration,
      mathConcepts: ['Central Limit Theorem', 'Sampling Distributions', 'Normal Approximation', 'Standard Error'],
      keyFeatures: 'Interactive demonstration of CLT with various starting distributions'
    },
    
    // Module 8 - Sigmund Components
    {
      id: 'sigmund-hypothesis-arena',
      name: 'Hypothesis Testing Arena',
      character: 'sigmund',
      characterName: 'Sigmund',
      icon: '👁️',
      description: 'Statistical hypothesis testing with investigation scenarios',
      features: ['Hypothesis Testing', 'Evidence Analysis', 'Statistical Decisions', 'Case Studies'],
      complexity: 'Medium',
      lines: 508,
      module: 'Module 8',
      lesson: 'Lesson 8.4',
      component: SigmundHypothesisArena,
      mathConcepts: ['Hypothesis Testing', 'P-values', 'Statistical Significance', 'Type I/II Errors'],
      keyFeatures: 'Detective-style hypothesis testing with investigation scenarios'
    },
    
    // Module 9 - Bayes Components
    {
      id: 'bayes-medical-diagnosis',
      name: 'Medical Diagnosis System',
      character: 'bayes',
      characterName: 'Bayes',
      icon: '🧪',
      description: 'Apply Bayesian inference to medical diagnosis scenarios',
      features: ['Bayesian Inference', 'Medical Scenarios', 'Probability Updates', 'Decision Trees'],
      complexity: 'Medium',
      lines: 260,
      module: 'Module 9',
      lesson: 'Lesson 9.2',
      component: BayesMedicalDiagnosis,
      mathConcepts: ['Bayes\' Theorem', 'Conditional Probability', 'Medical Statistics', 'Decision Analysis'],
      keyFeatures: 'Medical diagnosis scenarios with Bayesian probability updates'
    },
    
    // Module 10 - Sage Components
    {
      id: 'sage-data-synthesizer',
      name: 'Data Science Synthesizer',
      character: 'sage',
      characterName: 'Sage',
      icon: '🧠',
      description: 'Synthesize mathematical concepts across data science domains',
      features: ['Cross-domain Integration', 'Project Scenarios', 'Workflow Management', 'Technique Selection'],
      complexity: 'High',
      lines: 544,
      module: 'Module 10',
      lesson: 'Lesson 10.5',
      component: SageDataSynthesizer,
      mathConcepts: ['Data Analysis', 'Statistical Modeling', 'Machine Learning', 'Cross-domain Synthesis'],
      keyFeatures: 'Capstone project synthesis with multiple mathematical techniques'
    }
  ];

  const characters = [
    { id: 'all', name: 'All Characters', icon: '🎭' },
    { id: 'ollie', name: 'Ollie', icon: '🔧' },
    { id: 'vera', name: 'Vera', icon: '🧭' },
    { id: 'max', name: 'Max', icon: '📊' },
    { id: 'eileen', name: 'Eileen', icon: '🔍' },
    { id: 'delta', name: 'Delta', icon: '📈' },
    { id: 'greta', name: 'Greta', icon: '⛰️' },
    { id: 'pippa', name: 'Pippa', icon: '🪄' },
    { id: 'sigmund', name: 'Sigmund', icon: '👁️' },
    { id: 'bayes', name: 'Bayes', icon: '🧪' },
    { id: 'sage', name: 'Sage', icon: '🧠' }
  ];

  const filteredComponents = selectedCharacter === 'all' 
    ? components 
    : components.filter(comp => comp.character === selectedCharacter);

  const selectedComponentData = components.find(comp => comp.id === selectedComponent);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderComponentPreview = () => {
    if (!selectedComponentData) return null;

    const ComponentToRender = selectedComponentData.component;
    
    return (
      <div className="border rounded-lg bg-white p-4 min-h-[400px]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">{selectedComponentData.icon}</span>
            {selectedComponentData.characterName}'s {selectedComponentData.name}
          </h3>
          <Badge className={getComplexityColor(selectedComponentData.complexity)}>
            {selectedComponentData.complexity} Complexity
          </Badge>
        </div>
        
        <div className="mb-4">
          <ComponentToRender />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interactive Components Gallery
          </h1>
          <p className="text-lg text-gray-600">
            Explore all {interactiveDemos.length} character-specific interactive mathematics components across 10 modules
          </p>
        </div>

        {/* Character Filter */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Character</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {characters.map((character) => (
                  <Button
                    key={character.id}
                    variant={selectedCharacter === character.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCharacter(character.id)}
                    className="flex items-center gap-2"
                  >
                    <span>{character.icon}</span>
                    {character.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Component List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Components ({filteredComponents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredComponents.map((component) => (
                    <div
                      key={component.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedComponent === component.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedComponent(component.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{component.icon}</span>
                          <span className="font-medium text-sm">{component.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {component.lines} lines
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{component.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{component.module}</span>
                        <Badge className={`text-xs ${getComplexityColor(component.complexity)}`}>
                          {component.complexity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Component Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {renderComponentPreview()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Component Details */}
        {selectedComponentData && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Component Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="math">Math Concepts</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="features" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <p className="text-sm text-gray-600 mb-3">{selectedComponentData.keyFeatures}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponentData.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="math" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Mathematical Concepts</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedComponentData.mathConcepts.map((concept, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                            {concept}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">{selectedComponentData.lines}</div>
                        <div className="text-sm text-gray-600">Lines of Code</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-green-600">{selectedComponentData.complexity}</div>
                        <div className="text-sm text-gray-600">Complexity</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">{selectedComponentData.features.length}</div>
                        <div className="text-sm text-gray-600">Features</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-orange-600">{selectedComponentData.mathConcepts.length}</div>
                        <div className="text-sm text-gray-600">Math Concepts</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usage" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Integration Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Module:</strong> {selectedComponentData.module}</div>
                        <div><strong>Lesson:</strong> {selectedComponentData.lesson}</div>
                        <div><strong>Character:</strong> {selectedComponentData.characterName}</div>
                        <div><strong>Component ID:</strong> {selectedComponentData.id}</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-blue-800">Interactive Components</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">10</div>
                  <div className="text-sm text-green-800">Character Integrations</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {components.reduce((sum, comp) => sum + comp.lines, 0)}
                  </div>
                  <div className="text-sm text-purple-800">Total Lines of Code</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">10</div>
                  <div className="text-sm text-orange-800">Modules Covered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGallery;