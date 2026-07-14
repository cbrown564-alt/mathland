import { useEffect, useRef } from "react";
import { Target, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/core/components/ui/card";

interface JourneyStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorTheme: string;
  delay: number;
}

const journeySteps: JourneyStep[] = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Start with Purpose",
    description: "Connect mathematical concepts to real-world problems that matter to you. From Netflix recommendations to Google search algorithms, see how math powers the technology you use every day.",
    colorTheme: "from-blue-500 to-cyan-500",
    delay: 0
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Build Intuition",
    description: "Learn through character-guided exploration that matches your thinking style. Our mathematical companions help you develop deep understanding, not just memorization.",
    colorTheme: "from-purple-500 to-pink-500",
    delay: 200
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Apply with Confidence",
    description: "Transform your mathematical knowledge into career advancement. Master the skills that power machine learning, data science, and modern technology.",
    colorTheme: "from-green-500 to-emerald-500",
    delay: 400
  }
];

export const JourneyTransformation = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setTimeout(() => {
                entry.target.classList.add('animate-fade-in-up');
              }, journeySteps[index].delay);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Your Mathematical Transformation Journey
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            From curious learner to confident practitioner, discover how Mathland transforms your relationship with mathematics
          </p>
        </div>

        {/* Journey Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {journeySteps.map((step, index) => (
            <Card
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 opacity-0 transform translate-y-8 card-hover"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.colorTheme} opacity-5 gradient-bg`}></div>
              
              <CardContent className="relative p-8 text-center">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${step.colorTheme} text-white mb-6 shadow-lg icon-container`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Step Number */}
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${step.colorTheme} text-white text-sm font-bold flex items-center justify-center step-number`}>
                  {index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connection Line */}
        <div className="hidden md:block relative mt-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2 connection-line"></div>
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 connection-dot"></div>
          <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 connection-dot"></div>
        </div>

        {/* Transformation Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2 stat-item opacity-0">
            <div className="text-3xl font-bold text-blue-600">96</div>
            <div className="text-slate-600">Interactive Lessons</div>
          </div>
          <div className="space-y-2 stat-item opacity-0">
            <div className="text-3xl font-bold text-purple-600">10</div>
            <div className="text-slate-600">Expert Characters</div>
          </div>
          <div className="space-y-2 stat-item opacity-0">
            <div className="text-3xl font-bold text-green-600">∞</div>
            <div className="text-slate-600">Real-World Applications</div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(2rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes iconPulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes stepNumberGlow {
            0% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
          
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          
          .animate-fade-in-up .icon-container {
            animation: iconPulse 2s ease-in-out 0.8s infinite;
          }
          
          .animate-fade-in-up .step-number {
            animation: stepNumberGlow 2s ease-in-out 1s infinite;
          }
          
          .animate-fade-in-up .gradient-bg {
            background-size: 200% 200%;
            animation: gradientShift 3s ease-in-out 0.5s infinite;
          }
          
          .card-hover {
            transition: all 0.3s ease;
          }
          
          .card-hover:hover {
            transform: translateY(-4px);
          }
          
          .card-hover:hover .icon-container {
            transform: scale(1.1);
          }
          
          @keyframes connectionPulse {
            0% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
            100% {
              opacity: 0.6;
              transform: scale(1);
            }
          }
          
          @keyframes lineFlow {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
          
          .connection-line {
            background-size: 200% 100%;
            animation: lineFlow 3s ease-in-out infinite;
          }
          
          .connection-dot {
            animation: connectionPulse 2s ease-in-out infinite;
          }
          
          .connection-dot:nth-child(2) {
            animation-delay: 0.5s;
          }
          
          .connection-dot:nth-child(3) {
            animation-delay: 1s;
          }
          
          @keyframes statCount {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .stat-item {
            animation: statCount 0.8s ease-out forwards;
          }
          
          .stat-item:nth-child(1) {
            animation-delay: 1.5s;
          }
          
          .stat-item:nth-child(2) {
            animation-delay: 1.7s;
          }
          
          .stat-item:nth-child(3) {
            animation-delay: 1.9s;
          }
        `
      }} />
    </section>
  );
}; 