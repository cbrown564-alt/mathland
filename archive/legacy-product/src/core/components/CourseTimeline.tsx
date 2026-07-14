import { Badge } from "@/core/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { characters } from "@/utils/characterData";

const CourseTimeline = () => {
  const modules = [
    {
      id: 0,
      title: "Prerequisites & Refresher",
      subtitle: "Build Your Foundation",
      status: "available",
      color: characters.find(c => c.id === "ollie")?.color,
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50",
      lessons: 8,
      topics: ["Algebra basics", "Functions", "Graphing"],
      character: "Ollie the Otter",
      statusText: "Start Here"
    },
    {
      id: 1,
      title: "Vectors & Vector Spaces", 
      subtitle: "Direction and Magnitude",
      status: "locked",
      color: characters.find(c => c.id === "vera")?.color,
      borderColor: "border-red-200", 
      bgColor: "bg-red-50",
      lessons: 10,
      topics: ["Vector operations", "Linear combinations", "Basis"],
      character: "Vera the Vector",
      statusText: "Coming Soon"
    },
    {
      id: 2,
      title: "Matrices & Linear Mappings",
      subtitle: "Transforming Spaces",
      status: "locked",
      color: characters.find(c => c.id === "max")?.color,
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50", 
      lessons: 12,
      topics: ["Matrix operations", "Transformations", "Rank"],
      character: "Matrix Max",
      statusText: "Coming Soon"
    },
    {
      id: 3,
      title: "Eigenvalues & Eigenvectors",
      subtitle: "Special Directions",
      status: "locked",
      color: characters.find(c => c.id === "eileen")?.color,
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      lessons: 8,
      topics: ["Characteristic equations", "PCA applications"],
      character: "Eileen Eigen",
      statusText: "Coming Soon"
    },
    {
      id: 4,
      title: "Multivariate Calculus Foundations",
      subtitle: "Multiple Variables",
      status: "locked", 
      color: characters.find(c => c.id === "delta")?.color,
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      lessons: 10,
      topics: ["Partial derivatives", "Gradients", "Jacobians"],
      character: "Dr. Delta",
      statusText: "Coming Soon"
    },
    {
      id: 5,
      title: "Optimisation & Gradient Descent",
      subtitle: "Finding the Best",
      status: "locked",
      color: characters.find(c => c.id === "greta")?.color,
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
      lessons: 9,
      topics: ["Critical points", "Convexity", "Algorithms"],
      character: "Gradient Greta",
      statusText: "Coming Soon"
    },
    {
      id: 6,
      title: "Probability & Distributions",
      subtitle: "Understanding Uncertainty",
      status: "locked",
      color: characters.find(c => c.id === "pippa")?.color,
      borderColor: "border-pink-200", 
      bgColor: "bg-pink-50",
      lessons: 11,
      topics: ["Random variables", "Common distributions"],
      character: "Probability Pippa",
      statusText: "Coming Soon"
    },
    {
      id: 7,
      title: "Hypothesis Testing & Inference", 
      subtitle: "Making Decisions",
      status: "locked",
      color: characters.find(c => c.id === "sigmund")?.color,
      borderColor: "border-teal-200",
      bgColor: "bg-teal-50", 
      lessons: 10,
      topics: ["p-values", "Confidence intervals", "Errors"],
      character: "Sigmund the Swan",
      statusText: "Coming Soon"
    },
    {
      id: 8,
      title: "Bayesian Inference",
      subtitle: "Updating Beliefs", 
      status: "locked",
      color: characters.find(c => c.id === "bayes")?.color,
      borderColor: "border-indigo-200",
      bgColor: "bg-indigo-50",
      lessons: 8,
      topics: ["Prior/posterior", "Bayes' theorem applications"],
      character: "Bayes the Fox", 
      statusText: "Coming Soon"
    },
    {
      id: 9,
      title: "Capstone Project",
      subtitle: "Real-World Application",
      status: "locked",
      color: characters.find(c => c.id === "sage")?.color,
      borderColor: "border-slate-200",
      bgColor: "bg-slate-50",
      lessons: 1,
      topics: ["Real-world data science workflow"],
      character: "Sage the Synthesis Owl",
      statusText: "Final Project"
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Complete Learning Journey</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Master data science mathematics through 10 comprehensive modules, each guided by expert characters
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {modules.map((module, index) => (
            <div key={module.id} className="relative">
              {/* Connection line for larger screens */}
              {index < modules.length - 1 && (
                <div className="hidden xl:block absolute top-8 -right-3 z-10">
                  <ChevronRight className="w-6 h-6 text-slate-300" />
                </div>
              )}
              
              <div className={`relative ${module.bgColor} ${module.borderColor} border-2 rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg ${module.status === 'available' ? 'hover:scale-105' : 'opacity-75'}`}>
                {/* Module number badge */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${module.color} flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg`}>
                  {module.id}
                </div>
                
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={module.status === 'available' ? 'default' : 'secondary'}
                    className="text-xs font-medium"
                  >
                    {module.statusText}
                  </Badge>
                </div>
                
                {/* Module content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium">
                      {module.subtitle}
                    </p>
                  </div>
                  
                  {/* Character info */}
                  {module.character && (
                    <div className="text-xs text-slate-500">
                      <span className="font-medium">Guide:</span> {module.character}
                    </div>
                  )}
                  
                  {/* Lesson count */}
                  <div className="text-xs text-slate-500">
                    {module.lessons} lesson{module.lessons !== 1 ? 's' : ''}
                  </div>
                  
                  {/* Key topics */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">Key Topics:</div>
                    <div className="space-y-1">
                      {module.topics.map((topic, idx) => (
                        <div key={idx} className="flex items-start text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Prerequisites indicator */}
                {module.id > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="text-xs text-slate-500">
                      <span className="font-medium">Requires:</span> Module {module.id === 4 || module.id === 5 ? '2' : module.id === 7 || module.id === 8 ? '6' : module.id === 9 ? '1-8' : module.id - 1}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary stats */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10</div>
              <div className="text-slate-600 font-medium">Modules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">97</div>
              <div className="text-slate-600 font-medium">Total Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">9</div>
              <div className="text-slate-600 font-medium">Expert Guides</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">40+</div>
              <div className="text-slate-600 font-medium">Hours Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CourseTimeline };
