// Comprehensive design system for Tier 2 template components
// Ensures visual consistency and professional quality across all static content

import { TemplateSystemConfig } from '../types/templateTypes';

// Character-specific color schemes aligned with existing character data
export const characterColorSchemes = {
  ollie: {
    primary: '#F59E0B', // amber-500
    secondary: '#FCD34D', // amber-300
    accent: '#FBBF24', // amber-400
    gradient: 'from-amber-500 to-orange-500',
    background: 'from-amber-50 to-orange-50'
  },
  vera: {
    primary: '#DC2626', // red-600
    secondary: '#F87171', // red-400
    accent: '#EF4444', // red-500
    gradient: 'from-red-600 to-orange-600',
    background: 'from-red-50 to-orange-50'
  },
  max: {
    primary: '#2563EB', // blue-600
    secondary: '#60A5FA', // blue-400
    accent: '#3B82F6', // blue-500
    gradient: 'from-blue-600 to-indigo-600',
    background: 'from-blue-50 to-indigo-50'
  },
  eileen: {
    primary: '#7C3AED', // violet-600
    secondary: '#A78BFA', // violet-400
    accent: '#8B5CF6', // violet-500
    gradient: 'from-violet-600 to-purple-600',
    background: 'from-violet-50 to-purple-50'
  },
  delta: {
    primary: '#059669', // emerald-600
    secondary: '#34D399', // emerald-400
    accent: '#10B981', // emerald-500
    gradient: 'from-green-600 to-emerald-600',
    background: 'from-green-50 to-emerald-50'
  },
  greta: {
    primary: '#D97706', // amber-600
    secondary: '#FBBF24', // amber-400
    accent: '#F59E0B', // amber-500
    gradient: 'from-amber-600 to-orange-600',
    background: 'from-amber-50 to-orange-50'
  },
  pippa: {
    primary: '#DB2777', // pink-600
    secondary: '#F472B6', // pink-400
    accent: '#EC4899', // pink-500
    gradient: 'from-pink-600 to-rose-600',
    background: 'from-pink-50 to-rose-50'
  },
  sigmund: {
    primary: '#0891B2', // cyan-600
    secondary: '#22D3EE', // cyan-400
    accent: '#06B6D4', // cyan-500
    gradient: 'from-teal-600 to-cyan-600',
    background: 'from-teal-50 to-cyan-50'
  },
  bayes: {
    primary: '#7C2D12', // amber-800
    secondary: '#F59E0B', // amber-500
    accent: '#D97706', // amber-600
    gradient: 'from-amber-700 to-orange-700',
    background: 'from-amber-50 to-orange-50'
  },
  sage: {
    primary: '#1D4ED8', // blue-700
    secondary: '#60A5FA', // blue-400
    accent: '#3B82F6', // blue-500
    gradient: 'from-blue-600 to-cyan-600',
    background: 'from-blue-50 to-cyan-50'
  }
} as const;

// Typography system for professional adult learning
export const typography = {
  fontFamily: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: 'JetBrains Mono, "Fira Code", Consolas, "Courier New", monospace',
    math: 'KaTeX_Main, "Times New Roman", serif'
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em'
  }
} as const;

// Spacing system based on 8px grid
export const spacing = {
  unit: 8, // Base spacing unit
  scales: {
    xs: 0.5,  // 4px
    sm: 1,    // 8px
    md: 2,    // 16px
    lg: 3,    // 24px
    xl: 4,    // 32px
    '2xl': 6, // 48px
    '3xl': 8, // 64px
    '4xl': 12, // 96px
    '5xl': 16  // 128px
  }
} as const;

// Layout system for responsive design
export const layout = {
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  gridColumns: 12,
  containerPadding: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  }
} as const;

// Color system with semantic meanings
export const colors = {
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },
  semantic: {
    success: {
      light: '#D1FAE5',
      DEFAULT: '#10B981',
      dark: '#047857'
    },
    warning: {
      light: '#FEF3C7',
      DEFAULT: '#F59E0B',
      dark: '#D97706'
    },
    error: {
      light: '#FEE2E2',
      DEFAULT: '#EF4444',
      dark: '#DC2626'
    },
    info: {
      light: '#DBEAFE',
      DEFAULT: '#3B82F6',
      dark: '#1D4ED8'
    }
  }
} as const;

// Shadow system for depth and elevation
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
} as const;

// Border radius system
export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px'
} as const;

// Animation and transition system
export const animation = {
  duration: {
    fast: '150ms',
    DEFAULT: '250ms',
    slow: '350ms',
    slower: '500ms'
  },
  easing: {
    linear: 'linear',
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

// Template-specific design tokens
export const templateDesign = {
  processFlow: {
    stepWidth: '200px',
    stepHeight: '120px',
    connectionWidth: '2px',
    arrowSize: '8px',
    spacing: '24px'
  },
  comparison: {
    columnMinWidth: '250px',
    criteriaHeight: '40px',
    scoreRadius: '20px',
    borderWidth: '1px'
  },
  application: {
    scenarioMinHeight: '200px',
    iconSize: '48px',
    impactCardWidth: '180px',
    flowArrowWidth: '2px'
  },
  diagram: {
    defaultStrokeWidth: '2px',
    labelPadding: '8px',
    pointRadius: '4px',
    arrowheadSize: '6px'
  }
} as const;

// Accessibility configuration
export const accessibility = {
  colorContrast: {
    normal: 4.5,    // WCAG AA standard
    large: 3,       // WCAG AA for large text
    enhanced: 7     // WCAG AAA standard
  },
  fontSize: {
    minimum: '14px',
    scalable: true,
    zoomSupport: true
  },
  focusRing: {
    width: '2px',
    style: 'solid',
    color: '#3B82F6',
    offset: '2px'
  },
  animation: {
    respectReducedMotion: true,
    maxDuration: '500ms'
  }
} as const;

// Complete system configuration
export const templateSystemConfig: TemplateSystemConfig = {
  designSystem: {
    typography: {
      fontFamily: typography.fontFamily.body,
      headingSizes: {
        h1: typography.fontSize['4xl'],
        h2: typography.fontSize['3xl'],
        h3: typography.fontSize['2xl'],
        h4: typography.fontSize.xl,
        h5: typography.fontSize.lg,
        h6: typography.fontSize.base
      },
      bodySize: typography.fontSize.base,
      codeSize: typography.fontSize.sm
    },
    colors: {
      primary: colors.neutral[800],
      secondary: colors.neutral[600],
      accent: colors.semantic.info.DEFAULT,
      neutral: Object.values(colors.neutral),
      semantic: {
        success: colors.semantic.success.DEFAULT,
        warning: colors.semantic.warning.DEFAULT,
        error: colors.semantic.error.DEFAULT,
        info: colors.semantic.info.DEFAULT
      }
    },
    spacing: {
      unit: spacing.unit,
      scales: spacing.scales
    },
    layout: {
      maxWidth: layout.maxWidth.xl,
      breakpoints: layout.breakpoints,
      gridColumns: layout.gridColumns
    }
  },
  performance: {
    targetLoadTime: '< 1s',
    imageSizeLimit: '100KB',
    svgComplexityLimit: 200
  },
  accessibility: {
    colorContrastRatio: accessibility.colorContrast.normal,
    fontSize: {
      minimum: accessibility.fontSize.minimum,
      scalable: accessibility.fontSize.scalable
    },
    navigation: {
      keyboardSupport: true,
      screenReaderSupport: true
    }
  }
};

// Utility functions for applying design system
export const getCharacterTheme = (characterId: string) => {
  return characterColorSchemes[characterId as keyof typeof characterColorSchemes] || characterColorSchemes.sage;
};

export const getSpacing = (scale: keyof typeof spacing.scales) => {
  return `${spacing.unit * spacing.scales[scale]}px`;
};

export const getFontSize = (size: keyof typeof typography.fontSize) => {
  return typography.fontSize[size];
};

export const getBreakpoint = (size: keyof typeof layout.breakpoints) => {
  return layout.breakpoints[size];
};

export const getShadow = (size: keyof typeof shadows) => {
  return shadows[size];
};

export const getBorderRadius = (size: keyof typeof borderRadius) => {
  return borderRadius[size];
};

// Template component class names generator
export const generateTemplateClasses = (characterId: string, templateType: string) => {
  const theme = getCharacterTheme(characterId);
  return {
    container: `tier2-template tier2-${templateType} character-${characterId}`,
    background: `bg-gradient-to-br ${theme.background}`,
    primaryColor: theme.primary,
    secondaryColor: theme.secondary,
    accentColor: theme.accent,
    gradient: `bg-gradient-to-r ${theme.gradient}`
  };
};