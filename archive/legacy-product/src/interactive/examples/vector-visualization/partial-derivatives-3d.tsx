"use client"

import { useState, useMemo, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Calculator, Eye, BarChart3 } from "lucide-react"
import * as THREE from "three"

// Profit function: f(p,a) = 1000p - p² + 50a - a²
const profitFunction = (p: number, a: number) => {
  return 1000 * p - p * p + 50 * a - a * a
}

// Partial derivatives
const partialP = (p: number) => 1000 - 2 * p
const partialA = (a: number) => 50 - 2 * a

// Surface component
function ProfitSurface({
  price,
  advertising,
  showPriceDerivative,
  showAdvertisingDerivative,
}: {
  price: number
  advertising: number
  showPriceDerivative: boolean
  showAdvertisingDerivative: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Generate surface geometry
  const geometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(60, 60, 50, 50)
    const positions = geometry.attributes.position.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i] * 10 // Scale to 0-600 for price
      const z = positions[i + 2] * 0.5 + 15 // Scale to 0-30 for advertising
      const y = profitFunction(x, z) / 1000 // Scale down profit for visualization
      positions[i + 1] = y
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [])

  // Current point on surface
  const currentPoint = useMemo(() => {
    const profit = profitFunction(price, advertising)
    return [price / 10, profit / 1000, advertising - 15]
  }, [price, advertising])

  return (
    <group>
      {/* Surface */}
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4f46e5" transparent opacity={0.8} side={THREE.DoubleSide} wireframe={false} />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={geometry} position={[0, 0, 0]}>
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Current point marker */}
      <mesh position={currentPoint}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Partial derivative arrows */}
      {showPriceDerivative && (
        <group position={currentPoint}>
          <mesh position={[2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.3, 1]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[1, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>
      )}

      {showAdvertisingDerivative && (
        <group position={currentPoint}>
          <mesh position={[0, 0, 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.3, 1]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      )}

      {/* Axes */}
      <group>
        {/* Price axis (X) */}
        <mesh position={[30, -50, -15]}>
          <cylinderGeometry args={[0.1, 0.1, 60]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <Text position={[35, -50, -15]} fontSize={2} color="#374151" anchorX="center" anchorY="middle">
          Price ($)
        </Text>

        {/* Advertising axis (Z) */}
        <mesh position={[0, -50, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 30]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <Text position={[0, -50, 20]} fontSize={2} color="#374151" anchorX="center" anchorY="middle">
          Advertising ($1000s)
        </Text>

        {/* Profit axis (Y) */}
        <mesh position={[-30, 0, -15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 100]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <Text
          position={[-35, 30, -15]}
          fontSize={2}
          color="#374151"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          Profit ($)
        </Text>
      </group>
    </group>
  )
}

export default function PartialDerivatives3D() {
  const [price, setPrice] = useState([400])
  const [advertising, setAdvertising] = useState([20])
  const [showPriceDerivative, setShowPriceDerivative] = useState(false)
  const [showAdvertisingDerivative, setShowAdvertisingDerivative] = useState(false)

  const currentProfit = profitFunction(price[0], advertising[0])
  const currentPartialP = partialP(price[0])
  const currentPartialA = partialA(advertising[0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-sm">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Advanced Calculus</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Profit Optimization for Business
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore how partial derivatives help optimize business decisions using 3D visualization
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Visualization */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  3D Profit Surface
                </CardTitle>
                <p className="text-blue-100">Interactive visualization of f(p,a) = 1000p - p² + 50a - a²</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] bg-gradient-to-br from-slate-50 to-blue-50">
                  <Canvas camera={{ position: [50, 50, 50], fov: 60 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <ProfitSurface
                      price={price[0]}
                      advertising={advertising[0]}
                      showPriceDerivative={showPriceDerivative}
                      showAdvertisingDerivative={showAdvertisingDerivative}
                    />
                    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                  </Canvas>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Current Values */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Current Values
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Price:</span>
                    <span className="text-lg font-bold text-slate-800">${price[0]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Advertising:</span>
                    <span className="text-lg font-bold text-slate-800">${advertising[0]}k</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-slate-600">Profit:</span>
                    <span className="text-xl font-bold text-green-600">${currentProfit.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sliders */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-lg font-bold">Interactive Controls</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Price: ${price[0]}</label>
                  <Slider value={price} onValueChange={setPrice} max={600} min={0} step={10} className="w-full" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Advertising: ${advertising[0]}k</label>
                  <Slider
                    value={advertising}
                    onValueChange={setAdvertising}
                    max={30}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Derivative Controls */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Partial Derivatives
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowPriceDerivative(!showPriceDerivative)}
                    variant={showPriceDerivative ? "default" : "outline"}
                    className={`w-full ${
                      showPriceDerivative
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {showPriceDerivative ? "Hide" : "Show"} ∂f/∂p (Price Direction)
                  </Button>

                  <Button
                    onClick={() => setShowAdvertisingDerivative(!showAdvertisingDerivative)}
                    variant={showAdvertisingDerivative ? "default" : "outline"}
                    className={`w-full ${
                      showAdvertisingDerivative
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "border-amber-600 text-amber-600 hover:bg-amber-50"
                    }`}
                  >
                    {showAdvertisingDerivative ? "Hide" : "Show"} ∂f/∂a (Advertising Direction)
                  </Button>
                </div>

                {(showPriceDerivative || showAdvertisingDerivative) && (
                  <div className="space-y-3 pt-4 border-t">
                    {showPriceDerivative && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-800 mb-1">Price Derivative:</p>
                        <p className="text-sm text-green-700 font-mono">∂f/∂p = 1000 - 2p = {currentPartialP}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Profit changes by ${currentPartialP} per $1 price increase
                        </p>
                      </div>
                    )}

                    {showAdvertisingDerivative && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <p className="text-sm font-semibold text-amber-800 mb-1">Advertising Derivative:</p>
                        <p className="text-sm text-amber-700 font-mono">∂f/∂a = 50 - 2a = {currentPartialA}</p>
                        <p className="text-xs text-amber-600 mt-1">
                          Profit changes by ${currentPartialA} per $1k advertising increase
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mathematical Formulas */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-300">Profit Function</h3>
                <div className="bg-slate-700/50 p-4 rounded-xl font-mono text-lg">f(p,a) = 1000p - p² + 50a - a²</div>
                <p className="text-slate-300 text-sm mt-2">Where p = price ($), a = advertising ($1000s)</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-300">Partial Derivatives</h3>
                <div className="space-y-2">
                  <div className="bg-slate-700/50 p-3 rounded-lg font-mono">∂f/∂p = 1000 - 2p</div>
                  <div className="bg-slate-700/50 p-3 rounded-lg font-mono">∂f/∂a = 50 - 2a</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-900/30 rounded-xl border border-blue-700/50">
              <h4 className="text-lg font-bold text-blue-300 mb-2">Business Interpretation</h4>
              <p className="text-blue-100 leading-relaxed">
                The partial derivatives tell us how profit changes when we adjust one variable while keeping the other
                constant. At your current settings, increasing price by $1 changes profit by ${currentPartialP}, while
                increasing advertising by $1k changes profit by ${currentPartialA}. Use this information to optimize
                your business strategy!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
