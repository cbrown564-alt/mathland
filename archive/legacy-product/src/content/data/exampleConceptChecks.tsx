import React from 'react';
import { ScenarioConfig, StepConfig, VisualConfig, ChallengeConfig, ApproachConfig } from '@/types/conceptCheck';
// Example concept check configurations for testing EnhancedConceptCheck

export const EXAMPLE_CONCEPT_CHECKS = {
  'vera-vectors': {
    type: 'multi-step' as const,
    characterId: 'vera',
    scenario: {
      description: "Vera walks 4 meters east, then 3 meters north. Help her calculate her displacement vector and its magnitude.",
      successMessage: "Excellent navigation! You've found that I traveled 5 meters total, even though I walked in two separate directions. This is exactly how GPS calculates straight-line distances!"
    } as ScenarioConfig,
    steps: [
      {
        question: "What is the x-component of Vera's displacement?",
        placeholder: "Enter x-component",
        inputType: 'number',
        correctAnswer: "4",
        feedback: "Correct! 4 meters east",
        hint: "The x-component is how far Vera walked east."
      },
      {
        question: "What is the y-component of Vera's displacement?",
        placeholder: "Enter y-component",
        inputType: 'number',
        correctAnswer: "3",
        feedback: "Correct! 3 meters north",
        hint: "The y-component is how far Vera walked north."
      },
      {
        question: "What is the magnitude of Vera's displacement? (Use the Pythagorean theorem)",
        placeholder: "Enter magnitude",
        inputType: 'number',
        correctAnswer: "5",
        feedback: "That's right! 5 meters by Pythagoras.",
        hint: "Use the formula: sqrt(x² + y²)."
      }
    ] as StepConfig[],
    visual: {
      title: "Trail Map",
      component: () => (
        <div className="bg-white rounded-lg border border-slate-200 p-2 flex items-center justify-center" style={{ width: '100%', minHeight: 200 }}>
          <svg viewBox="-5 -5 10 10" width="100%" height="220" style={{ display: 'block' }}>
            {/* Grid lines */}
            <g>
              {Array.from({ length: 11 }, (_, i) => i - 5).map(i => (
                <>
                  <line key={`v${i}`} x1={i} y1={-5} x2={i} y2={5} stroke="#e5e7eb" strokeWidth="0.02" />
                  <line key={`h${i}`} x1={-5} y1={i} x2={5} y2={i} stroke="#e5e7eb" strokeWidth="0.02" />
                </>
              ))}
            </g>
            {/* Axes */}
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#64748b" strokeWidth="0.04" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#64748b" strokeWidth="0.04" />
            {/* Arrowhead markers */}
            <defs>
              <marker id="arrowhead-x" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,1 L8,4 L0,7 Z" fill="#f59e42" />
              </marker>
              <marker id="arrowhead-y" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,1 L8,4 L0,7 Z" fill="#3b82f6" />
              </marker>
              <marker id="arrowhead-disp" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,1 L8,4 L0,7 Z" fill="#10b981" />
              </marker>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0.08" dy="0.12" stdDeviation="0.08" floodColor="#10b981" floodOpacity="0.25" />
              </filter>
            </defs>
            {/* Vectors and points flipped so +y is up */}
            <g transform="scale(1,-1)">
              {/* x (east) */}
              <line x1="0" y1="0" x2="4" y2="0" stroke="#f59e42" strokeWidth="0.06" markerEnd="url(#arrowhead-x)" />
              {/* y (north) */}
              <line x1="4" y1="0" x2="4" y2="3" stroke="#3b82f6" strokeWidth="0.06" markerEnd="url(#arrowhead-y)" />
              {/* Displacement vector */}
              <line x1="0" y1="0" x2="4" y2="3" stroke="#10b981" strokeWidth="0.06" markerEnd="url(#arrowhead-disp)" filter="url(#shadow)" />
              {/* Points */}
              <circle cx="0" cy="0" r="0.09" fill="#64748b" />
              <circle cx="4" cy="0" r="0.09" fill="#f59e42" />
              <circle cx="4" cy="3" r="0.09" fill="#10b981" />
            </g>
            {/* Labels (not flipped) */}
            <text x="2" y="-0.3" fontSize="0.26" fill="#f59e42" textAnchor="middle">4 east</text>
            <text x="4.4" y="-2.7" fontSize="0.26" fill="#3b82f6">3 north</text>
            <text x="2.2" y="-1.1" fontSize="0.28" fill="#10b981">displacement</text>
          </svg>
        </div>
      )
    } as VisualConfig
  },
  'eileen-eigenvalues': {
    type: 'scenario' as const,
    characterId: 'eileen',
    challenge: {
      title: "The Case of the Mysterious Matrix",
      type: "Detective Investigation",
      description: "Eileen found a matrix that transforms most vectors chaotically, but some vectors only get scaled. Which approach will reveal these special eigenvectors?"
    } as ChallengeConfig,
    approaches: [
      {
        id: 'characteristic',
        title: 'Solve Characteristic Equation',
        description: 'Calculate det(A - λI) = 0 to find eigenvalues systematically',
        correct: true,
        explanation: 'Brilliant deduction! The characteristic equation reveals all eigenvalues mathematically.'
      },
      {
        id: 'guess',
        title: 'Guess and Check',
        description: 'Try plugging in random vectors to see what happens.',
        correct: false,
        explanation: 'That might work for simple cases, but it won\'t reveal all eigenvectors or eigenvalues.'
      },
      {
        id: 'graph',
        title: 'Graph the Transformation',
        description: 'Visualize the matrix action on a grid.',
        correct: false,
        explanation: 'Graphing can help, but the characteristic equation is the systematic approach.'
      }
    ] as ApproachConfig[]
  },
  'vera-addition-scenario': {
    type: 'scenario' as const,
    characterId: 'vera',
    challenge: {
      title: 'Combining Journeys',
      type: 'Vector Addition Scenario',
      description: "Vera and Max each walk their own vectors. Vera walks [3,2], Max walks [1,4]. Which approach correctly finds their combined displacement, and why does order not matter?"
    } as ChallengeConfig,
    approaches: [
      {
        id: 'add',
        title: 'Add the vectors component-wise',
        description: '[3+1, 2+4] = [4,6].',
        correct: true,
        explanation: 'Correct! Vector addition is done by adding each component. The commutative property means [3,2]+[1,4]=[1,4]+[3,2].'
      },
      {
        id: 'multiply',
        title: 'Multiply the vectors',
        description: '[3×1, 2×4] = [3,8].',
        correct: false,
        explanation: 'Multiplying components is not how vectors are added.'
      },
      {
        id: 'average',
        title: 'Average the vectors',
        description: '[(3+1)/2, (2+4)/2] = [2,3].',
        correct: false,
        explanation: 'Averaging gives the midpoint, not the sum.'
      }
    ] as ApproachConfig[]
  }
}; 