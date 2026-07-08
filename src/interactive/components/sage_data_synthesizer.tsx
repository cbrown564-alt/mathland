import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Progress } from '@/core/components/ui/progress';
import { Slider } from '@/core/components/ui/slider';

interface SageDataSynthesizerProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  isPreview?: boolean;
}

type WorkflowStage = 'data-prep' | 'analysis' | 'modeling' | 'validation' | 'synthesis';

type MathematicalTechnique = {
  id: string;
  name: string;
  character: string;
  description: string;
  stage: WorkflowStage;
  complexity: number;
  impact: number;
  icon: string;
};

const MATHEMATICAL_TECHNIQUES: MathematicalTechnique[] = [
  {
    id: 'vector-operations',
    name: 'Vector Operations',
    character: 'Vera',
    description: 'Data representation and feature engineering',
    stage: 'data-prep',
    complexity: 2,
    impact: 3,
    icon: '🧭'
  },
  {
    id: 'matrix-transformations',
    name: 'Matrix Transformations',
    character: 'Max',
    description: 'Dimensionality reduction and data preprocessing',
    stage: 'data-prep',
    complexity: 4,
    impact: 4,
    icon: '📊'
  },
  {
    id: 'eigenvalue-analysis',
    name: 'Eigenvalue Analysis',
    character: 'Eileen',
    description: 'Principal component analysis and data structure discovery',
    stage: 'analysis',
    complexity: 5,
    impact: 5,
    icon: '🔍'
  },
  {
    id: 'partial-derivatives',
    name: 'Partial Derivatives',
    character: 'Delta',
    description: 'Feature importance and sensitivity analysis',
    stage: 'analysis',
    complexity: 4,
    impact: 4,
    icon: '📈'
  },
  {
    id: 'optimization',
    name: 'Gradient Descent',
    character: 'Greta',
    description: 'Model training and parameter optimization',
    stage: 'modeling',
    complexity: 5,
    impact: 5,
    icon: '⛰️'
  },
  {
    id: 'probability-distributions',
    name: 'Probability Distributions',
    character: 'Pippa',
    description: 'Uncertainty modeling and risk assessment',
    stage: 'modeling',
    complexity: 3,
    impact: 4,
    icon: '🪄'
  },
  {
    id: 'hypothesis-testing',
    name: 'Hypothesis Testing',
    character: 'Sigmund',
    description: 'Statistical validation and significance testing',
    stage: 'validation',
    complexity: 4,
    impact: 5,
    icon: '👁️'
  },
  {
    id: 'bayesian-inference',
    name: 'Bayesian Inference',
    character: 'Bayes',
    description: 'Decision making under uncertainty',
    stage: 'validation',
    complexity: 5,
    impact: 5,
    icon: '🧪'
  },
  {
    id: 'mathematical-foundations',
    name: 'Mathematical Foundations',
    character: 'Ollie',
    description: 'Algebraic manipulation and formula derivation',
    stage: 'synthesis',
    complexity: 3,
    impact: 3,
    icon: '🔧'
  }
];

type ProjectScenario = {
  id: string;
  title: string;
  domain: string;
  description: string;
  challenges: string[];
  requiredTechniques: string[];
  businessImpact: string;
  icon: string;
};

const PROJECT_SCENARIOS: ProjectScenario[] = [
  {
    id: 'customer-churn',
    title: 'Customer Churn Prediction',
    domain: 'Business Analytics',
    description: 'Predict which customers are likely to cancel their subscription to enable proactive retention strategies.',
    challenges: [
      'High-dimensional customer data requires dimensionality reduction',
      'Imbalanced dataset with few actual churners',
      'Need to quantify prediction uncertainty for business decisions',
      'Model interpretability required for actionable insights'
    ],
    requiredTechniques: ['vector-operations', 'matrix-transformations', 'optimization', 'hypothesis-testing', 'bayesian-inference'],
    businessImpact: 'Reduce churn by 25% through proactive interventions, saving $2M annually',
    icon: '📞'
  },
  {
    id: 'medical-diagnosis',
    title: 'Medical Image Classification',
    domain: 'Healthcare AI',
    description: 'Classify medical images to assist radiologists in detecting early-stage diseases with confidence intervals.',
    challenges: [
      'Complex image features require sophisticated preprocessing',
      'Statistical validation needed for medical safety',
      'Uncertainty quantification critical for clinical decisions',
      'Integration of domain expertise with data-driven insights'
    ],
    requiredTechniques: ['eigenvalue-analysis', 'partial-derivatives', 'optimization', 'probability-distributions', 'hypothesis-testing'],
    businessImpact: 'Improve early detection rates by 30% while reducing false positives',
    icon: '🏥'
  },
  {
    id: 'financial-risk',
    title: 'Portfolio Risk Assessment',
    domain: 'Financial Services',
    description: 'Develop comprehensive risk models for investment portfolios using mathematical synthesis.',
    challenges: [
      'Multiple risk factors require mathematical integration',
      'Market volatility needs probabilistic modeling',
      'Regulatory compliance demands statistical rigor',
      'Real-time optimization under uncertainty'
    ],
    requiredTechniques: ['matrix-transformations', 'optimization', 'probability-distributions', 'bayesian-inference', 'hypothesis-testing'],
    businessImpact: 'Optimize risk-adjusted returns and meet regulatory capital requirements',
    icon: '💰'
  }
];

const SageDataSynthesizer: React.FC<SageDataSynthesizerProps> = ({
  onComplete,
  onProgress,
  isPreview = false
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('customer-churn');
  const [currentStage, setCurrentStage] = useState<WorkflowStage>('data-prep');
  const [appliedTechniques, setAppliedTechniques] = useState<Set<string>>(new Set());
  const [stageProgress, setStageProgress] = useState<Record<WorkflowStage, number>>({
    'data-prep': 0,
    'analysis': 0,
    'modeling': 0,
    'validation': 0,
    'synthesis': 0
  });
  const [projectInsights, setProjectInsights] = useState<string[]>([]);
  const [synthesisPower, setSynthesisPower] = useState([1]);

  const scenario = PROJECT_SCENARIOS.find(s => s.id === selectedScenario)!;
  const availableTechniques = MATHEMATICAL_TECHNIQUES.filter(t => t.stage === currentStage);
  const totalProgress = Object.values(stageProgress).reduce((sum, val) => sum + val, 0) / 5;

  const applyTechnique = useCallback((techniqueId: string) => {
    const technique = MATHEMATICAL_TECHNIQUES.find(t => t.id === techniqueId)!;
    
    setAppliedTechniques(prev => new Set([...prev, techniqueId]));
    
    // Update stage progress
    setStageProgress(prev => ({
      ...prev,
      [currentStage]: Math.min(prev[currentStage] + 20, 100)
    }));

    // Generate insight based on technique and scenario
    const insight = generateInsight(technique, scenario);
    setProjectInsights(prev => [...prev, insight]);

    // Auto-advance stage when complete
    if (stageProgress[currentStage] >= 80) {
      const stages: WorkflowStage[] = ['data-prep', 'analysis', 'modeling', 'validation', 'synthesis'];
      const currentIndex = stages.indexOf(currentStage);
      if (currentIndex < stages.length - 1) {
        setTimeout(() => setCurrentStage(stages[currentIndex + 1]), 1000);
      }
    }

    if (onProgress) {
      const newProgress = (Object.values({...stageProgress, [currentStage]: Math.min(stageProgress[currentStage] + 20, 100)}).reduce((sum, val) => sum + val, 0) / 5) / 100;
      onProgress(newProgress);
    }
  }, [currentStage, stageProgress, onProgress]);

  const generateInsight = (technique: MathematicalTechnique, scenario: ProjectScenario): string => {
    const insights: Record<string, Record<string, string>> = {
      'customer-churn': {
        'vector-operations': `${technique.character}: Vectors represent each customer as a point in feature space, enabling similarity analysis for churn prediction.`,
        'matrix-transformations': `${technique.character}: Matrix operations organize customer data systematically, revealing hidden patterns in subscription behavior.`,
        'eigenvalue-analysis': `${technique.character}: Principal components reveal the most important customer characteristics that drive churn decisions.`,
        'optimization': `${technique.character}: Gradient descent optimizes our churn prediction model to minimize false positives and negatives.`,
        'hypothesis-testing': `${technique.character}: Statistical testing validates that our churn predictions are significantly better than random chance.`,
        'bayesian-inference': `${technique.character}: Bayesian methods update churn probabilities as new customer behavior data becomes available.`
      },
      'medical-diagnosis': {
        'eigenvalue-analysis': `${technique.character}: Eigenvalue decomposition extracts critical diagnostic features from complex medical images.`,
        'partial-derivatives': `${technique.character}: Sensitivity analysis reveals which image regions most strongly influence diagnostic decisions.`,
        'optimization': `${technique.character}: Gradient descent trains diagnostic models while climbing toward optimal accuracy and safety.`,
        'probability-distributions': `${technique.character}: Probability distributions quantify diagnostic uncertainty for clinical decision-making.`,
        'hypothesis-testing': `${technique.character}: Statistical validation ensures diagnostic accuracy meets medical safety standards.`
      },
      'financial-risk': {
        'matrix-transformations': `${technique.character}: Portfolio correlation matrices reveal hidden risk dependencies across asset classes.`,
        'optimization': `${technique.character}: Portfolio optimization climbs toward optimal risk-adjusted returns under constraints.`,
        'probability-distributions': `${technique.character}: Risk distributions model potential portfolio losses with magical precision.`,
        'bayesian-inference': `${technique.character}: Market beliefs update systematically as new economic data emerges.`,
        'hypothesis-testing': `${technique.character}: Statistical tests validate risk model assumptions with elegant mathematical rigor.`
      }
    };

    return insights[scenario.id]?.[technique.id] || 
           `${technique.character}: ${technique.description} provides crucial insights for ${scenario.title}.`;
  };

  const getSynthesisRecommendations = (): string[] => {
    const appliedCount = appliedTechniques.size;
    const powerLevel = synthesisPower[0];
    
    if (appliedCount < 3) {
      return [
        "🌱 Early Stage: Start by applying foundational techniques to build your analytical foundation.",
        "📊 Focus on data preparation and exploratory analysis before moving to complex modeling.",
        "🔧 Ollie's algebraic foundations will help you understand the mathematical relationships."
      ];
    } else if (appliedCount < 6) {
      return [
        "🚀 Growing Synthesis: You're beginning to see how different mathematical concepts connect!",
        "🎯 Integration opportunities emerging between statistical and optimization approaches.",
        "⚡ The synergy between techniques is amplifying your analytical power exponentially."
      ];
    } else {
      return [
        "🦅 Master-Level Synthesis: You've achieved true mathematical integration across domains!",
        "💎 Each technique enhances the others, creating insights greater than the sum of parts.",
        "🌟 You're demonstrating the visionary perspective that defines expert data scientists.",
        "🎖️ This level of synthesis transforms mathematical knowledge into real-world impact!"
      ];
    }
  };

  const getStageDescription = (stage: WorkflowStage): string => {
    const descriptions = {
      'data-prep': 'Foundation building with vectors and matrices for data organization and preprocessing',
      'analysis': 'Deep exploration using calculus and linear algebra to uncover patterns and relationships',
      'modeling': 'Advanced techniques combining optimization and probability for predictive power',
      'validation': 'Statistical rigor ensuring results are reliable and scientifically sound',
      'synthesis': 'Integration of all mathematical concepts into comprehensive solutions'
    };
    return descriptions[stage];
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white/90 mb-2">
          🧠 Sage's Data Science Synthesizer 🧠
        </h2>
        <p className="text-white/55">
          Welcome to the pinnacle of mathematical integration! Let's synthesize everything you've learned from your Mathland journey into real-world data science mastery.
        </p>
      </div>

      {/* Project Scenario Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🦅 Choose Your Capstone Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROJECT_SCENARIOS.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedScenario === project.id
                    ? 'ring-2 ring-blue-400 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedScenario(project.id)}
              >
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{project.icon}</div>
                    <h3 className="font-semibold text-white/90">{project.title}</h3>
                    <Badge variant="outline" className="mt-1">{project.domain}</Badge>
                  </div>
                  <p className="text-sm text-white/55 mb-3">{project.description}</p>
                  <div className="text-xs text-white/45">
                    <strong>Impact:</strong> {project.businessImpact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Data Science Workflow Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Overall Synthesis Progress</span>
              <span className="text-xl font-bold text-blue-600">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            
            <div className="grid grid-cols-5 gap-2 text-xs">
              {(['data-prep', 'analysis', 'modeling', 'validation', 'synthesis'] as WorkflowStage[]).map((stage) => (
                <div
                  key={stage}
                  className={`p-2 rounded text-center cursor-pointer transition-colors ${
                    currentStage === stage
                      ? 'bg-blue-100 border-2 border-blue-400'
                      : stageProgress[stage] === 100
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-gray-100 border border-white/10'
                  }`}
                  onClick={() => setCurrentStage(stage)}
                >
                  <div className="font-semibold capitalize">{stage.replace('-', ' ')}</div>
                  <div className="text-xs text-white/55">{stageProgress[stage]}%</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mathematical Techniques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔬 Available Techniques - {currentStage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-blue-100 rounded-lg text-sm">
              <p className="text-blue-800">{getStageDescription(currentStage)}</p>
            </div>
            
            <div className="space-y-3">
              {availableTechniques.map((technique) => {
                const isApplied = appliedTechniques.has(technique.id);
                const isRequired = scenario.requiredTechniques.includes(technique.id);
                
                return (
                  <div
                    key={technique.id}
                    className={`p-3 border rounded-lg ${
                      isApplied
                        ? 'bg-green-50 border-green-300'
                        : isRequired
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{technique.icon}</span>
                        <div>
                          <h4 className="font-semibold text-sm">{technique.name}</h4>
                          <p className="text-xs text-white/55">by {technique.character}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {isRequired && <Badge variant="secondary" className="text-xs">Required</Badge>}
                        {isApplied && <Badge variant="secondary" className="bg-green-100 text-emerald-300/90 text-xs">Applied</Badge>}
                      </div>
                    </div>
                    
                    <p className="text-xs text-white/55 mb-2">{technique.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 text-xs">
                        <span>Complexity: {'★'.repeat(technique.complexity)}</span>
                        <span>Impact: {'★'.repeat(technique.impact)}</span>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => applyTechnique(technique.id)}
                        disabled={isApplied}
                        className="text-xs h-6"
                      >
                        {isApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Project Insights & Synthesis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Synthesis Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
              <h4 className="font-semibold text-white/90 mb-2">Current Project: {scenario.title}</h4>
              <p className="text-sm text-white/70 mb-3">{scenario.description}</p>
              <div className="text-xs">
                <strong>Applied Techniques:</strong> {appliedTechniques.size} / {scenario.requiredTechniques.length}
              </div>
            </div>

            {/* Synthesis Power Control */}
            <div className="p-3 bg-purple-100 rounded-lg">
              <label className="text-sm font-medium text-white/70 mb-2 block">
                Synthesis Power Level: {synthesisPower[0]}x
              </label>
              <Slider
                value={synthesisPower}
                onValueChange={setSynthesisPower}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-white/55 mt-1">
                Higher synthesis amplifies the synergy between mathematical techniques
              </p>
            </div>

            {/* Project Insights */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h5 className="font-semibold text-white/90">Character Insights:</h5>
              {projectInsights.length === 0 ? (
                <p className="text-sm text-white/45 italic">
                  Apply mathematical techniques to generate insights from your Mathland companions...
                </p>
              ) : (
                projectInsights.map((insight, index) => (
                  <div key={index} className="p-2 bg-white/[0.04] border border-white/10 rounded text-xs">
                    {insight}
                  </div>
                ))
              )}
            </div>

            {/* Synthesis Recommendations */}
            <div className="p-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg">
              <h5 className="font-semibold text-white/90 mb-2">🦅 Sage's Synthesis Guidance:</h5>
              {getSynthesisRecommendations().map((rec, index) => (
                <p key={index} className="text-sm text-white/70 mb-1">{rec}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sage's Wisdom */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🦅 Sage's Visionary Wisdom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
            <p className="text-white/70 mb-3">
              <strong>The Art of Mathematical Synthesis:</strong> True data science mastery emerges when you stop seeing mathematical techniques as isolated tools and start recognizing them as interconnected components of a greater whole. Each character's expertise amplifies the others - Vera's vectors enable Max's transformations, which reveal patterns that Greta can optimize, while Sigmund validates and Bayes guides decisions.
            </p>
            <p className="text-white/70">
              From this elevated perspective, you see that mathematics isn't just calculation - it's a language for understanding reality, a framework for making decisions under uncertainty, and a pathway for turning insight into impact. You've earned your wings in the mathematical world!
            </p>
          </div>
        </CardContent>
      </Card>

      {!isPreview && totalProgress >= 80 && appliedTechniques.size >= 6 && (
        <div className="text-center mt-6">
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-lg px-8 py-3"
          >
            🌟 Synthesis Mastery Achieved! 🌟
          </Button>
        </div>
      )}
    </div>
  );
};

export default SageDataSynthesizer;