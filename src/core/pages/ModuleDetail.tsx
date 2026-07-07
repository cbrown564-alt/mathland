import { useParams, useNavigate } from "react-router-dom";
import { modulesData } from "@/utils/modulesData";
import { characters } from "@/utils/characterData";
import { Card, CardContent } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, Map, Star, Briefcase } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/components/ui/tabs";
import { IconForApp } from "@/core/components/ui/IconForApp";

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const moduleId = Number(id);
  const module = modulesData.find((m) => m.id === moduleId);
  const character = module && characters.find(c => c.name === module.character.name || c.fullName === module.character.name);

  // Character-specific promises
  const characterPromises: Record<string, string> = {
    ollie: "I'll teach you to build mathematical confidence step by step. By the end of this module, you'll tackle any algebraic expression with the systematic precision of a master builder!",
    vera: "I'll teach you to think in directions and magnitudes. By the end of this module, you'll solve real navigation problems like a mathematical explorer!",
    eileen: "I'll help you uncover the hidden patterns in mathematical transformations. By the end of this module, you'll be a mathematical detective who can reveal the secret structure of any matrix!",
    delta: "I'll show you how to measure and understand change with mathematical precision. By the end of this module, you'll predict how things change and evolve like a mathematical scientist!",
    greta: "I'll guide you to the peaks of mathematical optimization. By the end of this module, you'll find the best solutions to complex problems by climbing the mathematical landscape with confidence!",
    pippa: "I'll teach you to navigate uncertainty with mathematical magic. By the end of this module, you'll make smart decisions under uncertainty and understand the hidden patterns in randomness!",
    sigmund: "I'll show you how to test ideas with mathematical elegance. By the end of this module, you'll evaluate evidence like a statistical detective and distinguish real patterns from random noise!",
    bayes: "I'll teach you to update your beliefs with mathematical wisdom. By the end of this module, you'll learn from evidence like a cunning investigator and make smarter predictions!",
    sage: "I'll help you weave all your mathematical knowledge into real-world impact. By the end of this project, you'll apply everything you've learned to solve meaningful problems like a mathematical architect!"
  };
  const charId = character?.id || 'vera';
  const characterPromise = characterPromises[charId] || characterPromises['vera'];

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Module Not Found</h2>
          <Button onClick={() => navigate("/course")}>Back to Roadmap</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="py-0 px-4 sm:px-6 lg:px-8">
        {/* Back to Roadmap Button - top right */}
        <div className="max-w-4xl mx-auto flex justify-end mt-4 mb-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/course")}> <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap</Button>
        </div>
        {/* HERO SECTION */}
        <section className="pt-12 pb-8 bg-gradient-to-b from-white to-slate-50 border-b-4 border-slate-300 mb-8">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 px-2 md:px-0">
            {/* Avatar */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className={`w-48 h-48 md:w-[22rem] md:h-[22rem] rounded-full overflow-hidden border-8 border-white shadow-xl bg-gradient-to-br ${module.color} mb-4 transition-all duration-300`}>
                {character && character.avatar ? (
                  <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl flex items-center justify-center w-full h-full">{module.character.name[0]}</span>
                )}
              </div>
              {/* Catchphrase */}
              {character && character.catchphrase && (
                <div className="mt-2 text-center text-lg font-semibold italic max-w-xs text-slate-700">
                  "{character.catchphrase}"
                </div>
              )}
            </div>
            {/* Main Info */}
            <div className="flex-1 text-center md:text-left">
              <div className={`inline-block px-3 py-1 bg-gradient-to-r ${module.color} text-white rounded-full text-xs font-semibold mb-2`}>Module {module.id}</div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{module.title}</h1>
              <div className="text-lg text-slate-600 mb-2">{module.subtitle}</div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {module.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {module.duration}</span>
                {/* Difficulty and success rate can be added here if available */}
              </div>
              <Button size="lg" className={`px-8 py-3 text-lg text-white mb-3 bg-gradient-to-r ${module.color} hover:opacity-90`} onClick={() => {/* TODO: route to first lesson */}}>
                Start Module <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
              {/* Character's Promise Box */}
              {character && (
                <div className="mt-3 bg-gradient-to-br from-white to-slate-50 border-l-4 border-slate-300 rounded-r px-4 py-3 text-left shadow-sm max-w-xl mx-auto md:mx-0">
                  <div className="font-semibold mb-1 text-slate-700">{character.name}'s Promise:</div>
                  <div className="text-sm text-slate-700">{characterPromise}</div>
                </div>
              )}
            </div>
          </div>
        </section>
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-0">
              <Tabs defaultValue="journey" className="w-full">
                <TabsList className={`w-full flex justify-center gap-0 bg-white rounded-xl border-b border-slate-100 shadow-sm overflow-hidden`}>
                  <TabsTrigger value="journey" className={`flex-1 px-0 py-3 font-semibold text-base transition-all flex items-center gap-2 justify-center
                    data-[state=active]:text-white data-[state=active]:bg-gradient-to-r ${module.color} data-[state=active]:shadow-none
                    data-[state=active]:rounded-none border-r border-slate-100 first:rounded-tl-xl last:rounded-tr-xl`}>
                    <Map className="w-4 h-4 mr-2" /> Learning Journey
                  </TabsTrigger>
                  <TabsTrigger value="concepts" className={`flex-1 px-0 py-3 font-semibold text-base transition-all flex items-center gap-2 justify-center
                    data-[state=active]:text-white data-[state=active]:bg-gradient-to-r ${module.color} data-[state=active]:shadow-none
                    data-[state=active]:rounded-none border-r border-slate-100 last:border-r-0`}>
                    <Star className="w-4 h-4 mr-2" /> What You'll Master
                  </TabsTrigger>
                  <TabsTrigger value="applications" className={`flex-1 px-0 py-3 font-semibold text-base transition-all flex items-center gap-2 justify-center
                    data-[state=active]:text-white data-[state=active]:bg-gradient-to-r ${module.color} data-[state=active]:shadow-none
                    data-[state=active]:rounded-none last:rounded-tr-xl`}>
                    <Briefcase className="w-4 h-4 mr-2" /> Real-World Applications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="journey" className="p-8">
                  {/* Visual stepper/roadmap with lesson titles, milestones, and progress preview */}
                  <div className="mb-8 flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl">{module.learningJourney.start.split(":")[0]}</span>
                      <span className="text-xs text-slate-500">{module.learningJourney.start.split(":")[1]}</span>
                    </div>
                    <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${module.color}`}></div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl">{module.learningJourney.milestone.split(":")[0]}</span>
                      <span className="text-xs text-slate-500">{module.learningJourney.milestone.split(":")[1]}</span>
                    </div>
                    <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${module.color}`}></div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl">{module.learningJourney.finish.split(":")[0]}</span>
                      <span className="text-xs text-slate-500">{module.learningJourney.finish.split(":")[1]}</span>
                    </div>
                  </div>
                  <div className="relative ml-6">
                    {/* Vertical line for stepper */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-200 to-slate-100 z-0 rounded-full" style={{marginLeft: '-0.75rem'}} />
                    <div>
                      {module.learningJourney.steps.map((step, i) => {
                        // Demo logic: first is current, previous are completed, rest are future
                        let state: 'completed' | 'current' | 'future' = 'future';
                        if (i === 0) state = 'current';
                        else if (i < 0) state = 'completed'; // For future: use real progress
                        // For demo, mark all before current as completed
                        // (In real app, use user progress)
                        if (i < 0) state = 'completed';
                        // For demo, mark all after current as future
                        if (i > 0) state = 'future';
                        // For demo, only first is current
                        if (i === 0) state = 'current';
                        // Color logic
                        const stateClass =
                          state === 'completed'
                            ? `border-green-400 bg-green-50 text-green-700`
                            : state === 'current'
                            ? `border-2 border-blue-500 bg-blue-50 text-blue-800`
                            : `border-gray-200 bg-white text-gray-400`;
                        const dotClass =
                          state === 'completed'
                            ? 'bg-green-400'
                            : state === 'current'
                            ? `bg-gradient-to-r ${module.color}`
                            : 'bg-gray-300';
                        return (
                          <div key={step.id} className="relative flex items-center mb-3 z-10">
                            {/* Stepper dot */}
                            <div className={`w-3 h-3 rounded-full absolute left-0 top-1/2 -translate-y-1/2 ${dotClass}`} />
                            <div className={`ml-8 flex-1 rounded-lg p-3 border ${stateClass} transition-all flex items-center gap-2`}> 
                              <span className="font-semibold text-xs w-10 text-left">{step.id}</span>
                              <span className="font-medium text-sm truncate">{step.title}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="concepts" className="p-8">
                  <h3 className="font-semibold text-slate-700 mb-4 text-xl">Key Concepts You'll Master</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {module.concepts.map((concept, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className={`inline-block w-1.5 h-6 rounded-full mr-3 bg-gradient-to-b ${module.color}`} />
                        <span className="text-slate-800 text-base">{concept}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="applications" className="p-8">
                  <h3 className="font-semibold text-slate-700 mb-1 text-xl">Real-World Applications</h3>
                  <div className="text-slate-500 mb-6 text-base">See how these concepts power the world around you.</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {module.applications && module.applications.map((app, idx) => {
                      const [title, ...desc] = app.split(":");
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-4 bg-slate-50 border-l-4 ${module.color} rounded-lg shadow-sm p-4 transition hover:shadow-md hover:-translate-y-1`}
                        >
                          <IconForApp title={title} idx={idx} color={module.color} />
                          <div>
                            <div className="font-semibold text-slate-800 mb-1 leading-tight">{title.trim()}</div>
                            <div className="text-slate-600 text-sm leading-snug">{desc.join(":").trim()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 