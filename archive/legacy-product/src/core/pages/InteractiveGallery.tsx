import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { interactiveDemos, InteractiveDemo } from "@/interactive/demos/demo_registry";
import { InteractiveShell } from "@/interactive/InteractiveShell";
import { characters } from "@/utils/characterData";

type GalleryEntry = {
  id: string;
  name: string;
  character: string;
  characterName: string;
  icon: string;
  description: string;
  features: string[];
  complexity: string;
  component: InteractiveDemo["component"];
  mathConcepts: string[];
  keyFeatures: string;
  estimatedTime: string;
  status: InteractiveDemo["status"];
};

const difficultyLabel = (difficulty: InteractiveDemo["difficulty"]) => {
  switch (difficulty) {
    case "advanced":
      return "High";
    case "intermediate":
      return "Medium";
    default:
      return "Low";
  }
};

const buildGalleryEntries = (): GalleryEntry[] => {
  const charById = new Map(characters.map((c) => [c.id, c]));

  return interactiveDemos.map((demo) => {
    const char = charById.get(demo.characterId);
    const shortName = char?.name.split(" ")[0] ?? demo.characterId;

    return {
      id: demo.id,
      name: demo.title,
      character: demo.characterId,
      characterName: shortName,
      icon: char?.icon ?? "🎭",
      description: demo.description,
      features: demo.learningObjectives,
      complexity: difficultyLabel(demo.difficulty),
      component: demo.component,
      mathConcepts: demo.tags,
      keyFeatures: demo.learningObjectives[0] ?? demo.description,
      estimatedTime: demo.estimatedTime,
      status: demo.status,
    };
  });
};

const characterFilters = [
  { id: "all", name: "All Characters", icon: "🎭" },
  ...characters.map((c) => ({
    id: c.id,
    name: c.name.split(" ")[0],
    icon: c.icon,
  })),
];

const InteractiveGallery: React.FC = () => {
  const components = useMemo(() => buildGalleryEntries(), []);
  const [selectedComponent, setSelectedComponent] = useState(components[0]?.id ?? "");
  const [selectedCharacter, setSelectedCharacter] = useState("all");

  const filteredComponents =
    selectedCharacter === "all"
      ? components
      : components.filter((comp) => comp.character === selectedCharacter);

  const selectedComponentData = components.find((comp) => comp.id === selectedComponent);
  const readyCount = interactiveDemos.filter((d) => d.status === "ready").length;
  const characterCount = new Set(interactiveDemos.map((d) => d.characterId)).size;

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderComponentPreview = () => {
    if (!selectedComponentData) return null;

    const ComponentToRender = selectedComponentData.component;

    return (
      <div className="interactive-panel rounded-lg border border-white/10 bg-[#0b0910] p-4 min-h-[400px]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white/90">
            <span className="text-2xl">{selectedComponentData.icon}</span>
            {selectedComponentData.characterName}&apos;s {selectedComponentData.name}
          </h3>
          <Badge className={getComplexityColor(selectedComponentData.complexity)}>
            {selectedComponentData.complexity} Complexity
          </Badge>
        </div>

        <div className="mb-4">
          <InteractiveShell ariaLabel={`${selectedComponentData.name} preview`}>
            <ComponentToRender isPreview />
          </InteractiveShell>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interactive Components Gallery</h1>
          <p className="text-lg text-gray-600">
            Explore all {interactiveDemos.length} character-specific interactive mathematics
            components across {characterCount} characters
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Character</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {characterFilters.map((character) => (
                  <Button
                    key={character.id}
                    variant={selectedCharacter === character.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCharacter(character.id)}
                    className="flex items-center gap-2"
                  >
                    <span>{character.icon}</span>
                    {character.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Components ({filteredComponents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredComponents.map((component) => (
                    <div
                      key={component.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedComponent === component.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedComponent(component.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{component.icon}</span>
                          <span className="font-medium text-sm">{component.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {component.estimatedTime}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{component.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize">{component.status}</span>
                        <Badge className={`text-xs ${getComplexityColor(component.complexity)}`}>
                          {component.complexity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>{renderComponentPreview()}</CardContent>
            </Card>
          </div>
        </div>

        {selectedComponentData && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Component Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="math">Math Concepts</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <p className="text-sm text-gray-600 mb-3">{selectedComponentData.keyFeatures}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponentData.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="math" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Mathematical Concepts</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedComponentData.mathConcepts.map((concept, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                            {concept}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedComponentData.estimatedTime}
                        </div>
                        <div className="text-sm text-gray-600">Est. Time</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedComponentData.complexity}
                        </div>
                        <div className="text-sm text-gray-600">Complexity</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedComponentData.features.length}
                        </div>
                        <div className="text-sm text-gray-600">Objectives</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedComponentData.mathConcepts.length}
                        </div>
                        <div className="text-sm text-gray-600">Tags</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="usage" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Integration Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Character:</strong> {selectedComponentData.characterName}
                        </div>
                        <div>
                          <strong>Component ID:</strong> {selectedComponentData.id}
                        </div>
                        <div>
                          <strong>Status:</strong> {selectedComponentData.status}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{interactiveDemos.length}</div>
                  <div className="text-sm text-blue-800">Interactive Components</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{characterCount}</div>
                  <div className="text-sm text-green-800">Character Integrations</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{readyCount}</div>
                  <div className="text-sm text-purple-800">Production Ready</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">10</div>
                  <div className="text-sm text-orange-800">Modules Covered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveGallery;
