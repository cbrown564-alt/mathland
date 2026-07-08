import React, { useState, useRef, useEffect } from 'react';
import { Compass, Calculator, RotateCcw, Target } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Switch } from '@/core/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/core/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/core/components/ui/avatar';
import { Label } from '@/core/components/ui/label';
import { VectorArrow } from '@/core/components/narrative/VectorArrow';

// SVG grid/axes constants
const GRID_SIZE = 10; // units in each direction from origin
const GRID_STEP = 1; // grid line every 1 unit
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

// Map math coordinates to SVG coordinates
function mathToSvg(x: number, y: number) {
  // SVG origin is top-left, math origin is center
  return {
    x: SVG_WIDTH / 2 + (x * SVG_WIDTH) / (2 * GRID_SIZE),
    y: SVG_HEIGHT / 2 - (y * SVG_HEIGHT) / (2 * GRID_SIZE),
  };
}

// Example vectors (now stateful)
const initialVectors = [
  { id: 1, x: 7.5, y: 4.5, color: '#f87171', label: 'v₁' }, // red
  { id: 2, x: -6, y: 5, color: '#3b82f6', label: 'v₂' },   // blue
];

function snapToGrid(val: number) {
  return Math.round(val * 2) / 2;
}

function getMagnitude(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}
function getAngle(x: number, y: number) {
  return (Math.atan2(y, x) * 180) / Math.PI;
}

const VeraVectorPlayground = () => {
  const canvasRef = useRef(null);
  const [vectors, setVectors] = useState(initialVectors);
  const [selectedVector, setSelectedVector] = useState<number>(1);
  const [hoveredVector, setHoveredVector] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showMagnitude, setShowMagnitude] = useState(true);
  const [dragging, setDragging] = useState<null | { id: number; offsetX: number; offsetY: number }>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const gridSize = 20;
  const originX = 300;
  const originY = 200;

  // Convert SVG (px) to math coordinates
  function svgToMath(x: number, y: number) {
    return {
      x: ((x - SVG_WIDTH / 2) * (2 * GRID_SIZE)) / SVG_WIDTH,
      y: -((y - SVG_HEIGHT / 2) * (2 * GRID_SIZE)) / SVG_HEIGHT,
    };
  }

  // Handle drag events (now with better mobile support)
  function onPointerDown(vecId: number, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVector(vecId);
    const svg = svgRef.current;
    if (!svg) return;
    svg.setPointerCapture(e.pointerId);
    setDragging({ id: vecId, offsetX: 0, offsetY: 0 });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = SVG_WIDTH / rect.width;
    const scaleY = SVG_HEIGHT / rect.height;
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;
    const math = svgToMath(svgX, svgY);
    // Snap to 0.5 units
    const snapped = { x: snapToGrid(math.x), y: snapToGrid(math.y) };
    setVectors(vectors =>
      vectors.map(v =>
        v.id === dragging.id ? { ...v, x: snapped.x, y: snapped.y } : v
      )
    );
  }

  function onPointerUp(e: React.PointerEvent) {
    setDragging(null);
    const svg = svgRef.current;
    if (svg && e.pointerId !== undefined) {
      svg.releasePointerCapture(e.pointerId);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(originX, originY, 4, 0, 2 * Math.PI); ctx.fill();
    vectors.forEach(vector => {
      const endX = originX + vector.x * gridSize;
      const endY = originY - vector.y * gridSize;
      ctx.strokeStyle = vector.color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(endX, endY); ctx.stroke();
      const angle = Math.atan2(vector.y, vector.x);
      const arrowLength = 15; const arrowAngle = Math.PI / 6;
      ctx.beginPath(); ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowLength * Math.cos(angle - arrowAngle), endY + arrowLength * Math.sin(angle - arrowAngle));
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowLength * Math.cos(angle + arrowAngle), endY + arrowLength * Math.sin(angle + arrowAngle));
      ctx.stroke();
      ctx.fillStyle = vector.color; ctx.beginPath(); ctx.arc(endX, endY, 6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = vector.color; ctx.font = 'bold 12px system-ui'; ctx.fillText(`v${vector.id}`, endX + 10, endY - 10);
      if (showMagnitude) {
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '10px system-ui';
        ctx.fillText(`||v${vector.id}|| = ${magnitude.toFixed(2)}`, endX + 10, endY + 10);
      }
    });
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = 'bold 14px system-ui';
    ctx.fillText('x', canvas.width - 20, originY - 10);
    ctx.fillText('y', originX + 10, 20);
  }, [vectors, showGrid, showMagnitude]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const vectorX = Math.round((clickX - originX) / gridSize);
    const vectorY = Math.round((originY - clickY) / gridSize);
    setVectors(prev => prev.map(v => v.id === selectedVector ? { ...v, x: vectorX, y: vectorY } : v));
  };

  const updateVector = (id: number, field: string, value: string) => {
    setVectors(prev => prev.map(v => v.id === id ? { ...v, [field]: parseFloat(value) || 0 } : v));
  };

  const resetVectors = () => {
    setVectors(initialVectors);
  };

  // Axis/grid labels
  const axisLabels = Array.from({ length: 2 * GRID_SIZE + 1 }, (_, i) => i - GRID_SIZE);

  // Selected vector for control panel
  const selectedVec = vectors.find(v => v.id === selectedVector);
  const magnitude = selectedVec ? getMagnitude(selectedVec.x, selectedVec.y) : 0;
  const angle = selectedVec ? getAngle(selectedVec.x, selectedVec.y) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/lovable-uploads/vera.png" alt="Vera" />
          <AvatarFallback>V</AvatarFallback>
        </Avatar>
        <span className="text-lg font-semibold text-white/90">Vera's Vector Playground</span>
      </div>
      <div className="mb-2 text-white/80 text-base">Drag the vector endpoints to explore!</div>
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* SVG Grid and Axes */}
        <div className="flex-1 flex flex-col min-w-[320px] min-h-[480px]">
          <div className="border border-white/10 bg-white/[0.03] rounded-lg overflow-hidden flex-1 flex flex-col justify-center">
            <svg
              ref={svgRef}
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              aria-label="Vera interactive vector playground visualization"
              className="w-full h-auto select-none"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {/* Grid lines and labels */}
              <g>
                {axisLabels.map((v, i) => {
                  const { x } = mathToSvg(v, 0);
                  const { y } = mathToSvg(0, v);
                  return (
                    <React.Fragment key={i}>
                      {/* Vertical grid line */}
                      <line
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={SVG_HEIGHT}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={v === 0 ? 0 : 1}
                      />
                      {/* Horizontal grid line */}
                      <line
                        x1={0}
                        y1={y}
                        x2={SVG_WIDTH}
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={v === 0 ? 0 : 1}
                      />
                      {/* x-axis label (skip origin) */}
                      {v !== 0 && i % 2 === 0 && (
                        <text
                          x={x}
                          y={SVG_HEIGHT / 2 + 18}
                          fontSize="13"
                          fill="rgba(255,255,255,0.5)"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {v}
                        </text>
                      )}
                      {/* y-axis label (skip origin) */}
                      {v !== 0 && i % 2 === 0 && (
                        <text
                          x={SVG_WIDTH / 2 - 12}
                          y={y + 4}
                          fontSize="13"
                          fill="rgba(255,255,255,0.5)"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {v}
                        </text>
                      )}
                    </React.Fragment>
                  );
                })}
              </g>
              {/* Axes */}
              <g>
                {/* x-axis */}
                <line
                  x1={0}
                  y1={SVG_HEIGHT / 2}
                  x2={SVG_WIDTH}
                  y2={SVG_HEIGHT / 2}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={2}
                />
                {/* y-axis */}
                <line
                  x1={SVG_WIDTH / 2}
                  y1={0}
                  x2={SVG_WIDTH / 2}
                  y2={SVG_HEIGHT}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={2}
                />
              </g>
              {/* Vectors with arrowheads, labels, and drag handles */}
              <g>
                {vectors.map(vec => {
                  const origin = mathToSvg(0, 0);
                  const tip = mathToSvg(vec.x, vec.y);
                  const isActive = dragging && dragging.id === vec.id;
                  const isSelected = selectedVector === vec.id;
                  const isHovered = hoveredVector === vec.id;
                  return (
                    <g key={vec.id}
                      onPointerEnter={() => setHoveredVector(vec.id)}
                      onPointerLeave={() => setHoveredVector(null)}
                      onClick={() => setSelectedVector(vec.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <VectorArrow
                        x1={origin.x}
                        y1={origin.y}
                        x2={tip.x}
                        y2={tip.y}
                        color={vec.color}
                        strokeWidth={isActive || isSelected ? 5 : 3}
                        filter={isActive
                          ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))'
                          : isSelected
                          ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))'
                          : isHovered
                          ? 'drop-shadow(0 2px 8px rgba(59,130,246,0.18))'
                          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.10))'}
                      />
                      {/* Label at tip */}
                      <text
                        x={tip.x + 8}
                        y={tip.y - 8}
                        fontSize="20"
                        fontFamily="serif"
                        fill={vec.color}
                        fontWeight="bold"
                        style={{ textShadow: '0 1px 2px #fff', pointerEvents: 'none', transition: 'fill 0.15s' }}
                      >
                        {vec.label}
                      </text>
                      {/* Drag handle at tip - larger for mobile */}
                      <circle
                        cx={tip.x}
                        cy={tip.y}
                        r={isActive ? 24 : isSelected ? 18 : 15}
                        fill="#fff"
                        stroke={vec.color}
                        strokeWidth={3}
                        style={{
                          cursor: 'grab',
                          transition: 'r 0.15s, stroke 0.15s',
                          filter: isActive || isSelected ? 'drop-shadow(0 2px 8px rgba(59,130,246,0.18))' : undefined,
                          touchAction: 'none', // Prevents scroll on mobile
                        }}
                        onPointerDown={e => onPointerDown(vec.id, e)}
                        tabIndex={0}
                        aria-label={`Drag ${vec.label}`}
                      />
                    </g>
                  );
                })}
              </g>
              {/* Origin dot */}
              <circle
                cx={SVG_WIDTH / 2}
                cy={SVG_HEIGHT / 2}
                r={4}
                fill="rgba(255,255,255,0.5)"
                opacity={0.7}
              />
            </svg>
          </div>
        </div>
        {/* Controls panel */}
        <div className="w-full max-w-xs flex flex-col space-y-4 min-h-[480px]">
          {/* Vector selection buttons */}
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 flex gap-2 mb-2">
            {vectors.map(vec => (
              <button
                key={vec.id}
                onClick={() => setSelectedVector(vec.id)}
                className={`flex-1 flex flex-col items-center justify-center rounded-lg border-2 px-2 py-2 font-mono text-base transition-all
                  ${selectedVector === vec.id
                    ? 'border-2 shadow border-[${vec.color}] bg-white/[0.03]'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'}
                `}
                style={{ borderColor: selectedVector === vec.id ? vec.color : undefined }}
                aria-pressed={selectedVector === vec.id}
              >
                <span className="w-4 h-4 rounded-full mb-1" style={{ backgroundColor: vec.color }}></span>
                <span className="font-bold" style={{ color: vec.color }}>{vec.label}</span>
                <span className="text-xs text-white/45">[{vec.x}, {vec.y}]</span>
              </button>
            ))}
          </div>
          {/* Properties box */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 mb-2">
            <h4 className="font-semibold text-white/80 mb-2 text-sm">Properties</h4>
            {selectedVec && (
              <>
                <div className="mb-1">
                  <span className="block text-xs text-white/45 mb-0.5">Vector:</span>
                  <span className="font-mono text-sm">{selectedVec.label} = [{selectedVec.x}, {selectedVec.y}]</span>
                </div>
                <div className="mb-1">
                  <span className="block text-xs text-white/45 mb-0.5">Magnitude:</span>
                  <span className="font-mono text-sm">||{selectedVec.label}|| = {magnitude.toFixed(3)}</span>
                </div>
                <div className="mb-1">
                  <span className="block text-xs text-white/45 mb-0.5">Angle:</span>
                  <span className="font-mono text-sm">{angle.toFixed(1)}°</span>
                </div>
                <div className="mb-1">
                  <span className="block text-xs text-white/45 mb-0.5">Components:</span>
                  <div className="flex gap-2">
                    <span className="font-mono text-sm">x: {selectedVec.x}</span>
                    <span className="font-mono text-sm">y: {selectedVec.y}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Precise control box */}
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h4 className="font-semibold text-white/80 mb-2 text-sm">Precise Control</h4>
            {selectedVec && (
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={selectedVec.x}
                  onChange={e => {
                    const x = parseFloat(e.target.value);
                    setVectors(vectors => vectors.map(v => v.id === selectedVec.id ? { ...v, x } : v));
                  }}
                  className="w-16 px-2 py-1 border rounded text-sm font-mono"
                  aria-label="x-component"
                />
                <input
                  type="number"
                  step="0.5"
                  value={selectedVec.y}
                  onChange={e => {
                    const y = parseFloat(e.target.value);
                    setVectors(vectors => vectors.map(v => v.id === selectedVec.id ? { ...v, y } : v));
                  }}
                  className="w-16 px-2 py-1 border rounded text-sm font-mono"
                  aria-label="y-component"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Bottom row: tips and challenges, side by side */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="flex-1">
          <Alert className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 border-red-400/30 h-full">
            <AlertTitle className="text-red-800">🧭 Vera's Navigation Tips</AlertTitle>
            <AlertDescription>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Vectors have both magnitude (length) and direction</li>
                <li>• Components [x, y] show how far in each direction</li>
                <li>• Magnitude = √(x² + y²) gives the total distance</li>
                <li>• Try making vectors that point in different directions!</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
        <div className="flex-1">
          <Alert className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 border-orange-400/30 h-full">
            <AlertTitle className="text-orange-800">🎯 Vera's Exploration Challenges</AlertTitle>
            <AlertDescription>
              <ul className="text-sm text-orange-700 space-y-1">
                <li><b>1. Unit Vector Quest:</b> Can you navigate to a vector with magnitude exactly 1?</li>
                <li><b>2. Opposite Paths:</b> Make two vectors that point in exactly opposite directions.</li>
                <li><b>3. Right Angle Route:</b> Position vectors so they form a 90° angle.</li>
                <li><b>4. Compass Master:</b> Create vectors pointing North, South, East, and West.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default VeraVectorPlayground;