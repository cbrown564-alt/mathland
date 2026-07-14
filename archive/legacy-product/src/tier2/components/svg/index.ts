// SVG Component Library for Tier 2 Templates
// Reusable SVG components for mathematical diagrams and visualizations

export { default as MathematicalShape } from './MathematicalShape';
export { default as Axis } from './Axis';
export { default as Grid } from './Grid';
export { default as Arrow } from './Arrow';
export { default as Function } from './Function';
export { default as Annotation } from './Annotation';
export { default as GeometricShape } from './GeometricShape';
export { default as FlowDiagram } from './FlowDiagram';

// Common SVG types
export interface SVGPoint {
  x: number;
  y: number;
}

export interface SVGSize {
  width: number;
  height: number;
}

export interface SVGStyle {
  color?: string;
  strokeWidth?: number;
  fillColor?: string;
  opacity?: number;
  dashArray?: string;
}

export interface SVGAnimation {
  type: 'translate' | 'rotate' | 'scale' | 'opacity';
  from: string | number;
  to: string | number;
  duration: number;
  easing?: string;
}

export interface BaseSVGProps {
  id?: string;
  className?: string;
  style?: SVGStyle;
  animation?: SVGAnimation;
  onClick?: (event: React.MouseEvent) => void;
  onHover?: (event: React.MouseEvent) => void;
}