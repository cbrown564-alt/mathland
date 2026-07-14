import { ChevronRight } from "lucide-react";
import { characters } from "@/utils/characterData";
import { Link } from "react-router-dom";

const SimpleCourseTimeline = () => {
  const modules = [
    { id: 1, title: "Prerequisites & Refresher", status: "available", color: characters.find(c => c.id === "ollie")?.color, image: characters.find(c => c.id === "ollie")?.image, characterName: characters.find(c => c.id === "ollie")?.name },
    { id: 2, title: "Vectors & Vector Spaces", status: "locked", color: characters.find(c => c.id === "vera")?.color, image: characters.find(c => c.id === "vera")?.image, characterName: characters.find(c => c.id === "vera")?.name },
    { id: 3, title: "Matrices & Linear Mappings", status: "locked", color: characters.find(c => c.id === "max")?.color, image: characters.find(c => c.id === "max")?.image, characterName: characters.find(c => c.id === "max")?.name },
    { id: 4, title: "Eigenvalues & Eigenvectors", status: "locked", color: characters.find(c => c.id === "eileen")?.color, image: characters.find(c => c.id === "eileen")?.image, characterName: characters.find(c => c.id === "eileen")?.name },
    { id: 5, title: "Multivariate Calculus", status: "locked", color: characters.find(c => c.id === "delta")?.color, image: characters.find(c => c.id === "delta")?.image, characterName: characters.find(c => c.id === "delta")?.name },
    { id: 6, title: "Optimization & Gradient Descent", status: "locked", color: characters.find(c => c.id === "greta")?.color, image: characters.find(c => c.id === "greta")?.image, characterName: characters.find(c => c.id === "greta")?.name },
    { id: 7, title: "Probability & Distributions", status: "locked", color: characters.find(c => c.id === "pippa")?.color, image: characters.find(c => c.id === "pippa")?.image, characterName: characters.find(c => c.id === "pippa")?.name },
    { id: 8, title: "Hypothesis Testing", status: "locked", color: characters.find(c => c.id === "sigmund")?.color, image: characters.find(c => c.id === "sigmund")?.image, characterName: characters.find(c => c.id === "sigmund")?.name },
    { id: 9, title: "Bayesian Inference", status: "locked", color: characters.find(c => c.id === "bayes")?.color, image: characters.find(c => c.id === "bayes")?.image, characterName: characters.find(c => c.id === "bayes")?.name },
    { id: 10, title: "Capstone Project", status: "locked", color: characters.find(c => c.id === "sage")?.color, image: characters.find(c => c.id === "sage")?.image, characterName: "Sage the Eagle" },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Learning Path</h2>
          <p className="text-lg text-slate-600">Progress through 10 comprehensive modules</p>
        </div>
        
        {/* Desktop Timeline */}
        <div className="hidden lg:flex items-center justify-between relative">
          <div className="absolute top-14 left-6 right-6 h-0.5 bg-slate-200"></div>
          <div className="absolute top-14 left-6 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-1000" style={{ width: '10%' }}></div>
          
          {modules.map((module, index) => {
            const clickable = module.status === 'available';
            const content = (
              <div className={`flex flex-col items-center relative z-10 ${clickable ? 'cursor-pointer group' : ''}`}
                tabIndex={clickable ? 0 : -1}
                aria-disabled={!clickable}
              >
                {/* Character name above image for desktop */}
                <div className="text-xs text-slate-400 mb-1 text-center w-28 leading-tight min-h-[2rem] flex items-end justify-center">
                  {module.characterName}
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${module.color} flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg ${clickable ? 'ring-2 ring-blue-200 group-hover:ring-4 group-hover:scale-110 transition-all' : ''} overflow-hidden`}>
                  <img src={module.image} alt={module.title} className="w-full h-full object-cover" />
                </div>
                <div className="mt-3 text-center max-w-32">
                  <div className={`text-sm font-medium ${module.status === 'locked' ? 'text-slate-400' : 'text-slate-700'} leading-tight`}>
                    {module.title}
                  </div>
                </div>
              </div>
            );
            return clickable ? (
              <Link to={`/module/${module.id}`} key={module.id} tabIndex={0} aria-label={`Go to ${module.title}`}>{content}</Link>
            ) : (
              <div key={module.id}>{content}</div>
            );
          })}
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-4">
          {modules.map((module, index) => {
            const clickable = module.status === 'available';
            const content = (
              <div className={`flex items-center gap-4 ${clickable ? 'cursor-pointer group' : ''}`}
                tabIndex={clickable ? 0 : -1}
                aria-disabled={!clickable}
              >
                <div className={`w-10 h-10 rounded-full ${module.status === 'locked' ? 'opacity-50' : ''} flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden border-2 border-white ${clickable ? 'ring-2 ring-blue-200 group-hover:ring-4 group-hover:scale-110 transition-all' : ''}`}>
                  <img 
                    src={module.image} 
                    alt={module.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${module.status === 'locked' ? 'text-slate-400' : 'text-slate-700'}`}>
                    {module.title}
                  </div>
                  {/* Character name underneath module name for mobile */}
                  <div className="text-xs text-slate-400 mt-1">
                    {module.characterName}
                  </div>
                </div>
                {module.status === 'available' && (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
                {index < modules.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                )}
              </div>
            );
            return clickable ? (
              <Link to={`/module/${module.id}`} key={module.id} tabIndex={0} aria-label={`Go to ${module.title}`}>{content}</Link>
            ) : (
              <div key={module.id}>{content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { SimpleCourseTimeline };
