import React from 'react';
import { BaseSVGProps, SVGPoint } from './index';

interface ArrowProps extends BaseSVGProps {
  start: SVGPoint;
  end: SVGPoint;
  headSize?: number;
  curved?: boolean;
  curvature?: number;
  label?: string;
  labelPosition?: 'start' | 'middle' | 'end';
}

const Arrow: React.FC<ArrowProps> = ({
  start,
  end,
  headSize = 10,
  curved = false,
  curvature = 0.2,
  label,
  labelPosition = 'middle',
  style = {},
  className = '',
  onClick,
  onHover
}) => {
  const {
    color = '#3B82F6',
    strokeWidth = 2,
    opacity = 1,
    dashArray
  } = style;

  const commonProps = {
    className,
    onClick,
    onMouseEnter: onHover,
    style: { cursor: onClick ? 'pointer' : 'default' }
  };

  // Calculate arrow direction
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);

  // Calculate arrowhead points
  const headX1 = end.x - headSize * Math.cos(angle - Math.PI / 6);
  const headY1 = end.y - headSize * Math.sin(angle - Math.PI / 6);
  const headX2 = end.x - headSize * Math.cos(angle + Math.PI / 6);
  const headY2 = end.y - headSize * Math.sin(angle + Math.PI / 6);

  const renderArrowBody = () => {
    if (curved) {
      // Calculate control point for quadratic curve
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const perpX = -dy / length;
      const perpY = dx / length;
      const controlX = midX + perpX * curvature * length;
      const controlY = midY + perpY * curvature * length;

      return (
        <path
          d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
          strokeDasharray={dashArray}
          {...commonProps}
        />
      );
    } else {
      return (
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
          strokeDasharray={dashArray}
          {...commonProps}
        />
      );
    }
  };

  const renderArrowHead = () => {
    return (
      <polygon
        points={`${end.x},${end.y} ${headX1},${headY1} ${headX2},${headY2}`}
        fill={color}
        opacity={opacity}
        {...commonProps}
      />
    );
  };

  const renderLabel = () => {
    if (!label) return null;

    let labelX: number;
    let labelY: number;
    const textAnchor = 'middle';
    const dominantBaseline = 'middle';

    if (curved) {
      // For curved arrows, place label at the curve midpoint
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const perpX = -dy / length;
      const perpY = dx / length;
      const controlX = midX + perpX * curvature * length;
      const controlY = midY + perpY * curvature * length;
      
      labelX = controlX;
      labelY = controlY - 10;
    } else {
      // For straight arrows
      switch (labelPosition) {
        case 'start':
          labelX = start.x;
          labelY = start.y - 15;
          break;
        case 'end':
          labelX = end.x;
          labelY = end.y - 15;
          break;
        case 'middle':
        default:
          labelX = (start.x + end.x) / 2;
          labelY = (start.y + end.y) / 2 - 10;
          break;
      }
    }

    return (
      <text
        x={labelX}
        y={labelY}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fontSize="12"
        fill={color}
        fontWeight="medium"
      >
        {label}
      </text>
    );
  };

  return (
    <g>
      {renderArrowBody()}
      {renderArrowHead()}
      {renderLabel()}
    </g>
  );
};

export default Arrow;