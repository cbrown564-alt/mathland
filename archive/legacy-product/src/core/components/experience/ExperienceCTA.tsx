import { ArrowRight, Users, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";

export const ExperienceCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Main CTA */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Ready to Transform Your Mathematical Journey?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                Join thousands of learners who've discovered the joy of mathematics through character-driven storytelling and real-world applications.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/course">
                  Start Your Mathematical Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <Link to="/course">
                  View Full Roadmap
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="flex items-center justify-center space-x-2 text-slate-600">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Join 10,000+ learners</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-600">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">4.9/5 average rating</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-slate-600">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">96 interactive lessons</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="border-t border-slate-200 pt-8">
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Start learning immediately</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Learn at your own pace</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Benefits */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Career-Ready Skills</h3>
            <p className="text-slate-600">
              Master the mathematical foundations that power machine learning, data science, and modern technology.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Deep Understanding</h3>
            <p className="text-slate-600">
              Build intuition through character-guided exploration that matches your natural thinking style.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 