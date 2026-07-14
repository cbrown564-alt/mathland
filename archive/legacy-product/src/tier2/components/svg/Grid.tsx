import React from 'react';
import { BaseSVGProps, SVGPoint } from './index';

interface GridProps extends BaseSVGProps {
  size: { width: number; height: number };
  origin: SVGPoint;
  spacing: number;
  showMajorLines?: boolean;
  showMinorLines?: boolean;
  majorSpacing?: number;
  showLabels?: boolean;
}

const Grid: React.FC<GridProps> = ({
  size,
  origin,
  spacing,
  showMajorLines = true,
  showMinorLines = true,
  majorSpacing = 5,
  showLabels = false,
  style = {},
  className = '',
  onClick,
  onHover
}) => {
  const {
    color = '#E5E7EB',
    strokeWidth = 0.5,
    opacity = 1
  } = style;

  const majorColor = '#D1D5DB';
  const minorColor = color;

  const commonProps = {
    className,
    onClick,
    onMouseEnter: onHover,
    style: { cursor: onClick ? 'pointer' : 'default' }
  };

  const renderGrid = () => {
    const elements = [];
    
    // Calculate grid bounds
    const leftX = origin.x - size.width / 2;
    const rightX = origin.x + size.width / 2;
    const topY = origin.y - size.height / 2;
    const bottomY = origin.y + size.height / 2;
    
    // Vertical lines
    const numVerticalLines = Math.floor(size.width / spacing);
    const startVertical = -Math.floor(numVerticalLines / 2);
    const endVertical = Math.ceil(numVerticalLines / 2);
    
    for (let i = startVertical; i <= endVertical; i++) {
      const x = origin.x + i * spacing;
      
      if (x < leftX || x > rightX) continue;
      
      const isMajor = i % majorSpacing === 0;
      const lineColor = isMajor && showMajorLines ? majorColor : minorColor;
      const lineStrokeWidth = isMajor && showMajorLines ? strokeWidth * 1.5 : strokeWidth;
      
      if ((isMajor && showMajorLines) || (!isMajor && showMinorLines)) {
        elements.push(
          <line
            key={`v-line-${i}`}
            x1={x}
            y1={topY}
            x2={x}
            y2={bottomY}
            stroke={lineColor}
            strokeWidth={lineStrokeWidth}
            opacity={opacity}
            {...commonProps}
          />
        );
      }
      
      // Labels for major lines
      if (isMajor && showLabels && i !== 0) {
        elements.push(
          <text
            key={`v-label-${i}`}
            x={x}
            y={origin.y + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill={majorColor}
          >
            {i}
          </text>
        );
      }
    }
    
    // Horizontal lines
    const numHorizontalLines = Math.floor(size.height / spacing);
    const startHorizontal = -Math.floor(numHorizontalLines / 2);
    const endHorizontal = Math.ceil(numHorizontalLines / 2);
    
    for (let i = startHorizontal; i <= endHorizontal; i++) {
      const y = origin.y + i * spacing;
      
      if (y < topY || y > bottomY) continue;
      
      const isMajor = i % majorSpacing === 0;
      const lineColor = isMajor && showMajorLines ? majorColor : minorColor;
      const lineStrokeWidth = isMajor && showMajorLines ? strokeWidth * 1.5 : strokeWidth;
      
      if ((isMajor && showMajorLines) || (!isMajor && showMinorLines)) {
        elements.push(
          <line
            key={`h-line-${i}`}
            x1={leftX}
            y1={y}
            x2={rightX}
            y2={y}
            stroke={lineColor}
            strokeWidth={lineStrokeWidth}
            opacity={opacity}
            {...commonProps}
          />
        );
      }
      
      // Labels for major lines
      if (isMajor && showLabels && i !== 0) {
        elements.push(
          <text
            key={`h-label-${i}`}
            x={origin.x - 15}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill={majorColor}
          >
            {-i}
          </text>
        );
      }
    }
    
    return elements;
  };

  return (
    <g>
      {renderGrid()}
      
      {/* Origin point */}
      <circle
        cx={origin.x}
        cy={origin.y}
        r="1.5"
        fill={majorColor}
        opacity={opacity}
      />
    </g>
  );
};

export default Grid;