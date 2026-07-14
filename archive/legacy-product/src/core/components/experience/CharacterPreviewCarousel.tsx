import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { characters } from "@/utils/characterData";

interface PreviewSample {
  id: string;
  character: {
    name: string;
    role: string;
    color: string;
    avatar: string;
  };
  quote: string;
  realWorldExample: string;
  visualPreview: {
    title: string;
    description: string;
    iconType: string;
  };
}

// Create preview samples from character data with real-world examples
const previewSamples: PreviewSample[] = characters.map(char => {
  // Define real-world examples and previews for each character
  const examples = {
    ollie: {
      realWorldExample: "Construction planning uses order of operations to calculate material costs and timelines",
      visualPreview: {
        title: "Mathematical Foundations",
        description: "Building blocks for all advanced concepts",
        iconType: "foundation"
      }
    },

    vera: {
      realWorldExample: "Netflix recommendations use vector similarity to suggest your next favorite show",
      visualPreview: {
        title: "Vector Similarity",
        description: "How Netflix finds shows you'll love",
        iconType: "recommendation"
      }
    },
    max: {
      realWorldExample: "Google PageRank uses matrix operations to determine website importance",
      visualPreview: {
        title: "Matrix Operations",
        description: "The math behind Google's search rankings",
        iconType: "search"
      }
    },
    eileen: {
      realWorldExample: "Facial recognition uses eigenvectors to identify unique facial features",
      visualPreview: {
        title: "Eigenvalue Analysis",
        description: "How computers recognize faces",
        iconType: "face"
      }
    },
    delta: {
      realWorldExample: "Weather forecasting uses partial derivatives to predict temperature changes",
      visualPreview: {
        title: "Multivariable Calculus",
        description: "Understanding change in complex systems",
        iconType: "weather"
      }
    },
    greta: {
      realWorldExample: "Machine learning uses gradient descent to optimize neural network parameters",
      visualPreview: {
        title: "Optimization Algorithms",
        description: "Finding the best solutions efficiently",
        iconType: "optimization"
      }
    },
    pippa: {
      realWorldExample: "Insurance companies use probability distributions to calculate risk and premiums",
      visualPreview: {
        title: "Probability Models",
        description: "Making sense of uncertainty",
        iconType: "probability"
      }
    },
    sigmund: {
      realWorldExample: "Medical trials use hypothesis testing to determine drug effectiveness",
      visualPreview: {
        title: "Statistical Testing",
        description: "Making data-driven decisions",
        iconType: "medical"
      }
    },
    bayes: {
      realWorldExample: "Spam filters use Bayesian inference to classify emails as spam or legitimate",
      visualPreview: {
        title: "Bayesian Inference",
        description: "Updating beliefs with new evidence",
        iconType: "spam"
      }
    },
    sage: {
      realWorldExample: "Data science projects synthesize multiple mathematical concepts into actionable insights",
      visualPreview: {
        title: "Capstone Synthesis",
        description: "Bringing it all together",
        iconType: "synthesis"
      }
    }
  };

  return {
    id: char.id,
    character: {
      name: char.name,
      role: char.concept,
      color: char.color,
      avatar: char.avatar
    },
    quote: char.catchphrase + " " + char.description.split('.')[0] + ".",
    realWorldExample: examples[char.id as keyof typeof examples].realWorldExample,
    visualPreview: examples[char.id as keyof typeof examples].visualPreview
  };
});

export const CharacterPreviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % previewSamples.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + previewSamples.length) % previewSamples.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-rotation logic
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setTimeout(() => {
        nextSlide();
      }, 6000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const currentSample = previewSamples[currentIndex];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Interactive Learning Previews
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Experience how our characters transform complex mathematical concepts into engaging, real-world applications
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Card */}
          <Card className="overflow-hidden shadow-xl border-0">
            <div className={`bg-gradient-to-br ${currentSample.character.color} p-8 text-white`}>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Character Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <img
                      src={currentSample.character.avatar}
                      alt={currentSample.character.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Character Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-2">{currentSample.character.name}</h3>
                  <p className="text-lg opacity-90 mb-4">{currentSample.character.role}</p>
                  <blockquote className="text-lg italic leading-relaxed">
                    "{currentSample.quote}"
                  </blockquote>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Real World Example */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-slate-800">Real-World Application</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">{currentSample.realWorldExample}</p>
                  </div>
                </div>

                {/* Visual Preview */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-slate-800">Interactive Preview</h4>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h5 className="font-semibold text-slate-800 mb-2">{currentSample.visualPreview.title}</h5>
                    <p className="text-slate-600 text-sm mb-3">{currentSample.visualPreview.description}</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Try Interactive Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {previewSamples.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
          >
            Try Interactive Previews
          </Button>
          <p className="text-slate-500 mt-4 text-sm">
            Explore hands-on demos of vector operations, matrix transformations, and pattern discovery
          </p>
        </div>
      </div>
    </section>
  );
}; 