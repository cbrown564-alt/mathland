import React from 'react';
import { BaseSVGProps, SVGPoint } from './index';

interface MathematicalShapeProps extends BaseSVGProps {
  type: 'circle' | 'ellipse' | 'rectangle' | 'triangle' | 'polygon' | 'line' | 'arc';
  center: SVGPoint;
  size: { width: number; height: number } | { radius: number };
  points?: SVGPoint[];
  rotation?: number;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const MathematicalShape: React.FC<MathematicalShapeProps> = ({
  type,
  center,
  size,
  points = [],
  rotation = 0,
  label,
  labelPosition = 'center',
  style = {},
  animation,
  className = '',
  onClick,
  onHover
}) => {
  const {
    color = '#3B82F6',
    strokeWidth = 2,
    fillColor = 'none',
    opacity = 1,
    dashArray
  } = style;

  const commonProps = {
    className,
    onClick,
    onMouseEnter: onHover,
    style: { cursor: onClick ? 'pointer' : 'default' }
  };

  const renderShape = () => {
    switch (type) {
      case 'circle': {
        const radius = 'radius' in size ? size.radius : Math.min(size.width, size.height) / 2;
        return (
          <circle
            cx={center.x}
            cy={center.y}
            r={radius}
            fill={fillColor}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={dashArray}
            {...commonProps}
          />
        );
      }

      case 'ellipse': {
        const rx = 'width' in size ? size.width / 2 : 50;
        const ry = 'height' in size ? size.height / 2 : 30;
        return (
          <ellipse
            cx={center.x}
            cy={center.y}
            rx={rx}
            ry={ry}
            fill={fillColor}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={dashArray}
            transform={rotation ? `rotate(${rotation} ${center.x} ${center.y})` : undefined}
            {...commonProps}
          />
        );
      }

      case 'rectangle': {
        const width = 'width' in size ? size.width : 100;
        const height = 'height' in size ? size.height : 50;
        return (
          <rect
            x={center.x - width / 2}
            y={center.y - height / 2}
            width={width}
            height={height}
            fill={fillColor}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={dashArray}
            transform={rotation ? `rotate(${rotation} ${center.x} ${center.y})` : undefined}
            {...commonProps}
          />
        );
      }

      case 'triangle': {
        const trianglePoints = points.length >= 3 ? points : [
          { x: center.x, y: center.y - 30 },
          { x: center.x - 25, y: center.y + 20 },
          { x: center.x + 25, y: center.y + 20 }
        ];
        return (
          <polygon
            points={trianglePoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill={fillColor}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={dashArray}
            transform={rotation ? `rotate(${rotation} ${center.x} ${center.y})` : undefined}
            {...commonProps}
          />
        );
      }

      case 'polygon':
        if (points.length < 3) return null;
        return (
          <polygon
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            fill={fillColor}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={dashArray}
            transform={rotation ? `rotate(${rotation} ${center.x} ${center.y})` : undefined}
            {...commonProps}
          />
        );

      case 'line':
        if (points.length < 2) return null;
        return (
          <line
            x1={points[0].x}
            y1={points[0].y}
            x2={points[1].x}
            y2={points[1].y}
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={dashArray}
            {...commonProps}
          />
        );

      case 'arc': {
        if (points.length < 2) return null;
        const startAngle = Math.atan2(points[0].y - center.y, points[0].x - center.x);
        const endAngle = Math.atan2(points[1].y - center.y, points[1].x - center.x);
        const arcRadius = 'radius' in size ? size.radius : 50;
        
        const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
        const sweepFlag = endAngle > startAngle ? 1 : 0;
        
        const startX = center.x + arcRadius * Math.cos(startAngle);
        const startY = center.y + arcRadius * Math.sin(startAngle);
        const endX = center.x + arcRadius * Math.cos(endAngle);
        const endY = center.y + arcRadius * Math.sin(endAngle);
        
        return (
          <path
            d={`M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={dashArray}
            {...commonProps}
          />
        );
      }

      default:
        return null;
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    
    let labelX = center.x;
    let labelY = center.y;
    let textAnchor = 'middle';
    let dominantBaseline = 'middle';
    
    const offset = 25;
    
    switch (labelPosition) {
      case 'top':
        labelY = center.y - offset;
        dominantBaseline = 'bottom';
        break;
      case 'bottom':
        labelY = center.y + offset;
        dominantBaseline = 'top';
        break;
      case 'left':
        labelX = center.x - offset;
        textAnchor = 'end';
        break;
      case 'right':
        labelX = center.x + offset;
        textAnchor = 'start';
        break;
      case 'center':
      default:
        // Already set above
        break;
    }
    
    return (
      <text
        x={labelX}
        y={labelY}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fontSize="14"
        fill={color}
        fontWeight="semibold"
      >
        {label}
      </text>
    );
  };

  return (
    <g>
      {renderShape()}
      {renderLabel()}
      {animation && (
        <animateTransform
          attributeName="transform"
          type={animation.type}
          from={animation.from.toString()}
          to={animation.to.toString()}
          dur={`${animation.duration}s`}
          repeatCount="indefinite"
        />
      )}
    </g>
  );
};

export default MathematicalShape;