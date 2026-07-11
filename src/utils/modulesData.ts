import { characters } from "./characterData";
import { getCharacterTheme } from "./theme";

function getModuleColor(characterName: string) {
  const char = characters.find((c) => c.name === characterName || c.fullName === characterName);
  return char ? getCharacterTheme(char.id).color : "from-gray-400 to-gray-600";
}

export const modulesData = [
  {
    id: 1,
    title: "Prerequisites & Refresher",
    subtitle: "Build Your Foundation",
    description: "Master the mathematical foundations needed for data science",
    duration: "4-5 hours",
    lessons: 8,
    status: "available",
    color: getModuleColor("Ollie the Otter"),
    character: {
      name: "Ollie the Otter",
      avatar: "/lovable-uploads/ollie.png"
    },
    concepts: [
      "Order-of-operations", "Factorising & expanding", "Linear & quadratic equations", 
      "Inequalities", "Function notation", "Domain/Range", "Graphing lines/quadratics/exponentials", 
      "Coordinate geometry (distance, midpoint)", "Basic vector notation", "Greek symbols", "Σ / Π conventions"
    ],
    applications: [
      "Spreadsheet Mastery: Excel formulas follow order of operations - build complex financial models",
      "Programming Logic: Code debugging requires algebraic thinking and systematic problem-solving",
      "Data Analysis: Statistical calculations need solid equation-solving and function understanding",
      "Business Planning: Growth projections use exponential functions and inequality constraints",
      "Quality Control: Manufacturing tolerances rely on inequality analysis and precision measurement"
    ],
    roadmapConcepts: [
      "Algebraic foundations",
      "Equations & inequalities",
      "Functions & graphing"
    ],
    prerequisites: "None - Start here!",
    learningJourney: {
      start: "🌟 Start: Order of Operations",
      milestone: "🎯 Milestone: Functions & Graphing",
      finish: "🏆 Finish: Mathematical Foundations",
      steps: [
        { id: "1.1", title: "Order of Operations & Algebraic Basics" },
        { id: "1.2", title: "Factoring & Expanding Expressions" },
        { id: "1.3", title: "Linear & Quadratic Equations" },
        { id: "1.4", title: "Inequalities & Absolute Values" },
        { id: "1.5", title: "Function Notation & Concepts" },
        { id: "1.6", title: "Graphing Functions" },
        { id: "1.7", title: "Coordinate Geometry Essentials" },
        { id: "1.8", title: "Vectors & Greek Symbols Preview" }
      ]
    }
  },
  {
    id: 2,
    title: "Vectors & Vector Spaces",
    subtitle: "Direction and Magnitude",
    description: "Understanding vectors, linear combinations, and vector spaces",
    duration: "5-6 hours",
    lessons: 10,
    status: "available",
    color: getModuleColor("Vera the Vector"),
    character: {
      name: "Vera the Vector",
      avatar: "/lovable-uploads/vera.png"
    },
    concepts: [
      "Vector addition/scalar multiplication", "Dot product & norm", "Unit vectors", 
      "Linear combination & span", "Linear independence", "Basis & dimension", 
      "Row/column picture", "Subspace & null space"
    ],
    applications: [
      "GPS Navigation: Your phone calculates displacement vectors to find optimal routes",
      "Netflix Recommendations: User preferences represented as vectors in multi-dimensional space",
      "Computer Graphics: 3D games use vectors for movement, rotation, and collision detection",
      "Machine Learning: AI represents data points as vectors to find patterns and make predictions",
      "Facial Recognition: Photos analyzed as high-dimensional vectors to identify faces"
    ],
    roadmapConcepts: [
      "Vector operations",
      "Linear combinations & span",
      "Vector spaces & subspaces"
    ],
    prerequisites: "Module 1",
    learningJourney: {
      start: "🌟 Start: Vector Operations",
      milestone: "🎯 Milestone: Linear Independence",
      finish: "🏆 Finish: Forest Mapping Capstone",
      steps: [
        { id: "2.1", title: "Vector Basics — Arrows with Purpose" },
        { id: "2.2", title: "Vector Addition & Scalar Multiplication" },
        { id: "2.3", title: "The Dot Product — Measuring Similarity" },
        { id: "2.4", title: "Vector Norms — Measuring Distance" },
        { id: "2.5", title: "Linear Combinations — Building New Vectors" },
        { id: "2.6", title: "Linear Independence — Fundamental Directions" },
        { id: "2.7", title: "Basis and Dimension — The Foundation Framework" },
        { id: "2.8", title: "Vector Spaces — The Abstract Framework" },
        { id: "2.9", title: "Vera's Forest Mapping Capstone Project" }
      ]
    }
  },
  {
    id: 3,
    title: "Matrices & Linear Mappings",
    subtitle: "Transforming Spaces",
    description: "Matrix operations, transformations, and their properties",
    duration: "6-7 hours",
    lessons: 12,
    status: "coming-soon",
    color: getModuleColor("Matrix Max"),
    character: {
      name: "Matrix Max",
      avatar: "/lovable-uploads/max.png"
    },
    concepts: [
      "Matrix addition/multiplication", "Identity & inverse", "Determinant & rank", 
      "Elementary row ops", "Matrix-vector product as transformation", "Composition of linear maps", 
      "Change of basis", "Block matrices"
    ],
    applications: [
      "Image Processing: Instagram filters multiply pixel matrices to create visual effects",
      "Economic Modeling: Input-output matrices predict how changes ripple through economies",
      "3D Animation: Movies use matrix transformations to create realistic character movements",
      "Google Search: PageRank uses matrix operations to rank billions of web pages",
      "Robotics: Industrial robots use matrices to calculate precise arm movements"
    ],
    roadmapConcepts: [
      "Matrix operations",
      "Linear transformations",
      "Determinants & inverses"
    ],
    prerequisites: "Module 2",
    learningJourney: {
      start: "🌟 Start: Matrix Operations",
      milestone: "🎯 Milestone: Linear Transformations",
      finish: "🏆 Finish: Matrix Spaces",
      steps: [
        { id: "3.1", title: "Matrix Addition & Multiplication" },
        { id: "3.2", title: "Identity & Inverse" },
        { id: "3.3", title: "Determinant & Rank" },
        { id: "3.4", title: "Elementary Row Operations" },
        { id: "3.5", title: "Matrix-Vector Product" },
        { id: "3.6", title: "Composition of Linear Maps" },
        { id: "3.7", title: "Change of Basis" },
        { id: "3.8", title: "Block Matrices" }
      ]
    }
  },
  {
    id: 4,
    title: "Eigenvalues & Eigenvectors",
    subtitle: "Special Directions",
    description: "Understanding eigenvalues, eigenvectors, and their applications",
    duration: "4-5 hours",
    lessons: 8,
    status: "coming-soon",
    color: getModuleColor("Eileen Eigen"),
    character: {
      name: "Eileen Eigen",
      avatar: "/lovable-uploads/eileen.png"
    },
    concepts: [
      "Characteristic equation", "Algebraic vs geometric multiplicity", "Diagonalisation", 
      "Spectral decomposition", "SVD (teaser)", "Power iteration", 
      "Real-world uses: PCA, PageRank, vibration modes"
    ],
    applications: [
      "Principal Component Analysis: Scientists compress genetic data to find population patterns",
      "Earthquake Engineering: Buildings designed using eigenvector analysis of vibration modes",
      "Financial Risk: Banks use eigenvalue methods to identify correlated market risks",
      "Google PageRank: Finds the principal eigenvector representing web page authority",
      "Data Compression: JPEG images use eigenvalue techniques to reduce file sizes"
    ],
    roadmapConcepts: [
      "Eigenvalues & eigenvectors",
      "Diagonalisation & spectral decomposition",
      "Real-world applications (PCA, PageRank, SVD)"
    ],
    prerequisites: "Module 3",
    learningJourney: {
      start: "🌟 Start: Eigenvalues & Eigenvectors",
      milestone: "🎯 Milestone: Diagonalisation",
      finish: "🏆 Finish: Special Directions",
      steps: [
        { id: "4.1", title: "Characteristic Equation" },
        { id: "4.2", title: "Algebraic vs Geometric Multiplicity" },
        { id: "4.3", title: "Diagonalisation" },
        { id: "4.4", title: "Spectral Decomposition" },
        { id: "4.5", title: "SVD (Singular Value Decomposition)" },
        { id: "4.6", title: "Power Iteration" },
        { id: "4.7", title: "Real-world Uses" }
      ]
    }
  },
  {
    id: 5,
    title: "Multivariate Calculus Foundations",
    subtitle: "Multiple Variables",
    description: "Calculus with multiple variables for optimization",
    duration: "5-6 hours",
    lessons: 10,
    status: "coming-soon",
    color: getModuleColor("Dr. Delta"),
    character: {
      name: "Dr. Delta",
      avatar: "/lovable-uploads/delta.png"
    },
    concepts: [
      "Limits in ℝ²/ℝ³", "Continuity surfaces", "Partial derivatives", 
      "Gradient vector", "Directional derivative", "Jacobian matrix"
    ],
    applications: [
      "Weather Forecasting: Meteorologists track how temperature changes across space and time",
      "Medical Imaging: MRI scans use gradient calculations to reconstruct 3D body images",
      "Economics: Companies optimize pricing using partial derivatives of demand functions",
      "Engineering Design: Stress analysis uses gradients to find optimal material thickness",
      "Machine Learning: Neural networks use gradients to automatically improve predictions"
    ],
    roadmapConcepts: [
      "Partial derivatives & gradients",
      "Multivariable functions",
      "Jacobian & rates of change"
    ],
    prerequisites: "Module 4",
    learningJourney: {
      start: "🌟 Start: Multivariable Calculus",
      milestone: "🎯 Milestone: Partial Derivatives",
      finish: "🏆 Finish: Multivariable Foundations",
      steps: [
        { id: "5.1", title: "Limits in ℝ²/ℝ³" },
        { id: "5.2", title: "Continuity & Surfaces" },
        { id: "5.3", title: "Partial Derivatives" },
        { id: "5.4", title: "Gradient Vector" },
        { id: "5.5", title: "Directional Derivative" },
        { id: "5.6", title: "Jacobian Matrix" }
      ]
    }
  },
  {
    id: 6,
    title: "Optimisation & Gradient Descent",
    subtitle: "Finding the Best",
    description: "Optimization techniques and gradient-based algorithms",
    duration: "4-5 hours",
    lessons: 9,
    status: "coming-soon",
    color: getModuleColor("Gradient Greta"),
    character: {
      name: "Gradient Greta",
      avatar: "/lovable-uploads/greta.png"
    },
    concepts: [
      "Critical points & Hessian", "Second-derivative test", "Convex vs non-convex", 
      "Gradient-descent algorithm (step size, convergence)", "Momentum & learning-rate scheduling (teaser)"
    ],
    applications: [
      "Netflix Algorithm: Optimizes recommendations by minimizing prediction errors",
      "Autonomous Vehicles: Cars find optimal paths while avoiding obstacles using gradient methods",
      "Portfolio Management: Financial advisors optimize investment returns while minimizing risk",
      "Supply Chain: Amazon optimizes warehouse locations and delivery routes globally",
      "Drug Discovery: Pharmaceutical companies optimize molecular structures for effectiveness"
    ],
    roadmapConcepts: [
      "Critical points & convexity",
      "Gradient descent algorithms",
      "Optimization in practice"
    ],
    prerequisites: "Module 5",
    learningJourney: {
      start: "🌟 Start: Optimisation",
      milestone: "🎯 Milestone: Gradient Descent",
      finish: "🏆 Finish: Finding the Best",
      steps: [
        { id: "6.1", title: "Critical Points & Hessian" },
        { id: "6.2", title: "Second-Derivative Test" },
        { id: "6.3", title: "Convex vs Non-Convex" },
        { id: "6.4", title: "Gradient Descent Algorithm" },
        { id: "6.5", title: "Momentum & Learning-Rate Scheduling" }
      ]
    }
  },
  {
    id: 7,
    title: "Probability & Distributions",
    subtitle: "Understanding Uncertainty",
    description: "Probability theory and common probability distributions",
    duration: "6-7 hours",
    lessons: 11,
    status: "coming-soon",
    color: getModuleColor("Probability Pippa"),
    character: {
      name: "Probability Pippa",
      avatar: "/lovable-uploads/pippa.png"
    },
    concepts: [
      "Sample space/events", "Conditional probability & independence", "Random variables", 
      "Bernoulli, Binomial, Poisson, Uniform, Exponential, Normal", "Expectation & variance", 
      "LLN & CLT", "PDF vs CDF", "Sampling variability"
    ],
    applications: [
      "Insurance Pricing: Companies use probability models to set fair premium rates",
      "Quality Control: Manufacturers use statistical sampling to ensure product reliability",
      "A/B Testing: Tech companies test website changes using probability and statistics",
      "Medical Diagnosis: Doctors interpret test results using probability and disease prevalence",
      "Sports Analytics: Teams use probability models to evaluate player performance"
    ],
    roadmapConcepts: [
      "Probability theory & random variables",
      "Common distributions",
      "Expectation, variance & sampling"
    ],
    prerequisites: "Module 6",
    learningJourney: {
      start: "🌟 Start: Probability",
      milestone: "🎯 Milestone: Random Variables",
      finish: "🏆 Finish: Understanding Uncertainty",
      steps: [
        { id: "7.1", title: "Sample Space & Events" },
        { id: "7.2", title: "Conditional Probability & Independence" },
        { id: "7.3", title: "Random Variables" },
        { id: "7.4", title: "Bernoulli, Binomial, Poisson, Uniform, Exponential, Normal" },
        { id: "7.5", title: "Expectation & Variance" },
        { id: "7.6", title: "Law of Large Numbers & Central Limit Theorem" },
        { id: "7.7", title: "Probability Density Function (PDF) vs Cumulative Distribution Function (CDF)" },
        { id: "7.8", title: "Sampling Variability" }
      ]
    }
  },
  {
    id: 8,
    title: "Hypothesis Testing & Inference",
    subtitle: "Making Decisions",
    description: "Statistical inference and hypothesis testing methods",
    duration: "5-6 hours",
    lessons: 10,
    status: "coming-soon",
    color: getModuleColor("Sigmund the Swan"),
    character: {
      name: "Sigmund the Swan",
      avatar: "/lovable-uploads/sigmund.png"
    },
    concepts: [
      "Sampling distribution & standard error", "Confidence intervals", "Null/alt hypotheses", 
      "Test statistics & p-values", "t-tests, χ², ANOVA (teaser)", "Type I/II error", "Statistical power"
    ],
    applications: [
      "Clinical Trials: Pharmaceutical companies prove drug effectiveness using statistical tests",
      "Market Research: Companies test whether advertising campaigns actually increase sales",
      "Environmental Science: Researchers prove whether pollution levels are decreasing",
      "Education: Schools test whether new teaching methods improve student outcomes",
      "Manufacturing: Engineers test whether process changes improve product quality"
    ],
    roadmapConcepts: [
      "Statistical inference",
      "Hypothesis testing",
      "Confidence intervals & errors"
    ],
    prerequisites: "Module 7",
    learningJourney: {
      start: "🌟 Start: Hypothesis Testing",
      milestone: "🎯 Milestone: Sampling Distribution",
      finish: "🏆 Finish: Statistical Inference",
      steps: [
        { id: "8.1", title: "Sampling Distribution & Standard Error" },
        { id: "8.2", title: "Confidence Intervals" },
        { id: "8.3", title: "Null/Alternative Hypotheses" },
        { id: "8.4", title: "Test Statistics & p-values" },
        { id: "8.5", title: "t-tests, χ², ANOVA" },
        { id: "8.6", title: "Type I/II Error" },
        { id: "8.7", title: "Statistical Power" }
      ]
    }
  },
  {
    id: 9,
    title: "Bayesian Inference",
    subtitle: "Updating Beliefs",
    description: "Bayesian statistics and probabilistic reasoning",
    duration: "4-5 hours",
    lessons: 8,
    status: "coming-soon",
    color: getModuleColor("Bayes the Fox"),
    character: {
      name: "Bayes the Fox",
      avatar: "/lovable-uploads/bayes.png"
    },
    concepts: [
      "Prior, likelihood, posterior", "Conjugate priors (β-Binomial, normal-normal)", 
      "Posterior predictive", "MAP vs MLE", "Bayes factors", 
      "Real-world cases: medical diagnosis, spam filtering"
    ],
    applications: [
      "Spam Filtering: Email systems learn to identify spam by updating probability estimates",
      "Medical Diagnosis: Doctors update disease probabilities as new test results arrive",
      "Recommendation Systems: Streaming services update your profile as viewing preferences evolve",
      "Fraud Detection: Banks update fraud probability as transaction patterns change",
      "Scientific Research: Climate scientists update models as new temperature data arrives"
    ],
    roadmapConcepts: [
      "Bayesian reasoning",
      "Priors, likelihoods & posteriors",
      "Real-world Bayesian applications"
    ],
    prerequisites: "Module 8",
    learningJourney: {
      start: "🌟 Start: Bayesian Inference",
      milestone: "🎯 Milestone: Bayesian Statistics",
      finish: "🏆 Finish: Updating Beliefs",
      steps: [
        { id: "9.1", title: "Prior, Likelihood, Posterior" },
        { id: "9.2", title: "Conjugate Priors" },
        { id: "9.3", title: "Posterior Predictive" },
        { id: "9.4", title: "Maximum A Posteriori (MAP) vs Maximum Likelihood Estimation (MLE)" },
        { id: "9.5", title: "Bayes Factors" },
        { id: "9.6", title: "Real-world Applications" }
      ]
    }
  },
  {
    id: 10,
    title: "Capstone Project",
    subtitle: "Real-World Application",
    description: "Apply all concepts in a comprehensive data science project",
    duration: "8-10 hours",
    lessons: 1,
    status: "coming-soon",
    color: getModuleColor("Sage the Visionary Eagle"),
    character: {
      name: "Sage the Visionary Eagle",
      avatar: "/lovable-uploads/sage.png"
    },
    concepts: [
      "End-to-end workflow: data wrangling → dimensionality reduction → model fitting → diagnostic inference → presentation"
    ],
    applications: [
      "Data Science Pipeline: Complete workflow from raw data to actionable business insights",
      "Predictive Analytics: Build models that forecast customer behavior and market trends",
      "Business Intelligence: Transform company data into strategic decision-making tools",
      "Research Applications: Apply mathematical techniques to solve real scientific problems",
      "Career Portfolio: Create projects that demonstrate mathematical problem-solving skills"
    ],
    roadmapConcepts: [
      "End-to-end data science workflow",
      "Modeling & inference",
      "Presentation & synthesis"
    ],
    prerequisites: "Modules 1-8",
    learningJourney: {
      start: "🌟 Start: Capstone Project",
      milestone: "🎯 Milestone: Data Science Project",
      finish: "🏆 Finish: Real-World Application",
      steps: [
        { id: "10.1", title: "End-to-End Workflow" },
        { id: "10.2", title: "Data Wrangling" },
        { id: "10.3", title: "Dimensionality Reduction" },
        { id: "10.4", title: "Model Fitting" },
        { id: "10.5", title: "Diagnostic Inference" },
         { id: "10.6", title: "Presentation" }
      ]
    }
  }
  // Add more modules here as needed
];
