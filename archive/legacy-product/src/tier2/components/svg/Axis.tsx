import React from 'react';
import { BaseSVGProps, SVGPoint } from './index';

interface AxisProps extends BaseSVGProps {
  type: 'x' | 'y' | 'both';
  origin: SVGPoint;
  length: number;
  tickSpacing?: number;
  tickLength?: number;
  showArrows?: boolean;
  showLabels?: boolean;
  labelStep?: number;
  labelFormat?: (value: number) => string;
  title?: string;
  titlePosition?: 'start' | 'end';
}

const Axis: React.FC<AxisProps> = ({
  type,
  origin,
  length,
  tickSpacing = 20,
  tickLength = 5,
  showArrows = true,
  showLabels = true,
  labelStep = 1,
  labelFormat = (val) => val.toString(),
  title,
  titlePosition = 'end',
  style = {},
  className = '',
  onClick,
  onHover
}) => {
  const {
    color = '#374151',
    strokeWidth = 1,
    opacity = 1
  } = style;

  const commonProps = {
    className,
    onClick,
    onMouseEnter: onHover,
    style: { cursor: onClick ? 'pointer' : 'default' }
  };

  const renderXAxis = () => {
    const startX = origin.x - length / 2;
    const endX = origin.x + length / 2;
    
    const elements = [];
    
    // Main axis line
    elements.push(
      <line
        key="x-axis-line"
        x1={startX}
        y1={origin.y}
        x2={endX}
        y2={origin.y}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...commonProps}
      />
    );

    // Arrow at the end (if enabled)
    if (showArrows) {
      elements.push(
        <polygon
          key="x-axis-arrow"
          points={`${endX},${origin.y} ${endX - 8},${origin.y - 4} ${endX - 8},${origin.y + 4}`}
          fill={color}
          opacity={opacity}
        />
      );
    }

    // Ticks and labels
    if (tickSpacing > 0) {
      const numTicks = Math.floor(length / tickSpacing);
      const startTick = -Math.floor(numTicks / 2);
      const endTick = Math.ceil(numTicks / 2);

      for (let i = startTick; i <= endTick; i++) {
        if (i === 0) continue; // Skip origin
        
        const tickX = origin.x + i * tickSpacing;
        const tickValue = i * labelStep;
        
        // Tick mark
        elements.push(
          <line
            key={`x-tick-${i}`}
            x1={tickX}
            y1={origin.y - tickLength}
            x2={tickX}
            y2={origin.y + tickLength}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );

        // Tick label
        if (showLabels && i % labelStep === 0) {
          elements.push(
            <text
              key={`x-label-${i}`}
              x={tickX}
              y={origin.y + tickLength + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill={color}
            >
              {labelFormat(tickValue)}
            </text>
          );
        }
      }
    }

    // Title
    if (title) {
      const titleX = titlePosition === 'start' ? startX - 20 : endX + 10;
      elements.push(
        <text
          key="x-axis-title"
          x={titleX}
          y={origin.y - 5}
          textAnchor={titlePosition === 'start' ? 'end' : 'start'}
          dominantBaseline="middle"
          fontSize="12"
          fill={color}
          fontWeight="medium"
        >
          {title}
        </text>
      );
    }

    return elements;
  };

  const renderYAxis = () => {
    const startY = origin.y + length / 2;
    const endY = origin.y - length / 2;
    
    const elements = [];
    
    // Main axis line
    elements.push(
      <line
        key="y-axis-line"
        x1={origin.x}
        y1={startY}
        x2={origin.x}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...commonProps}
      />
    );

    // Arrow at the end (if enabled)
    if (showArrows) {
      elements.push(
        <polygon
          key="y-axis-arrow"
          points={`${origin.x},${endY} ${origin.x - 4},${endY + 8} ${origin.x + 4},${endY + 8}`}
          fill={color}
          opacity={opacity}
        />
      );
    }

    // Ticks and labels
    if (tickSpacing > 0) {
      const numTicks = Math.floor(length / tickSpacing);
      const startTick = -Math.floor(numTicks / 2);
      const endTick = Math.ceil(numTicks / 2);

      for (let i = startTick; i <= endTick; i++) {
        if (i === 0) continue; // Skip origin
        
        const tickY = origin.y - i * tickSpacing;
        const tickValue = i * labelStep;
        
        // Tick mark
        elements.push(
          <line
            key={`y-tick-${i}`}
            x1={origin.x - tickLength}
            y1={tickY}
            x2={origin.x + tickLength}
            y2={tickY}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );

        // Tick label
        if (showLabels && i % labelStep === 0) {
          elements.push(
            <text
              key={`y-label-${i}`}
              x={origin.x - tickLength - 10}
              y={tickY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill={color}
            >
              {labelFormat(tickValue)}
            </text>
          );
        }
      }
    }

    // Title
    if (title) {
      const titleY = titlePosition === 'start' ? startY + 20 : endY - 10;
      elements.push(
        <text
          key="y-axis-title"
          x={origin.x - 25}
          y={titleY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill={color}
          fontWeight="medium"
          transform={`rotate(-90 ${origin.x - 25} ${titleY})`}
        >
          {title}
        </text>
      );
    }

    return elements;
  };

  return (
    <g>
      {(type === 'x' || type === 'both') && renderXAxis()}
      {(type === 'y' || type === 'both') && renderYAxis()}
      
      {/* Origin point */}
      {type === 'both' && (
        <circle
          cx={origin.x}
          cy={origin.y}
          r="2"
          fill={color}
          opacity={opacity}
        />
      )}
    </g>
  );
};

export default Axis;