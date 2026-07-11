import { Menu, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/core/components/ui/button";
import { getLessonOrderForModuleAsync } from "@/utils/lessonData";
import { isLessonCompleted } from "@/core/hooks/useLessonProgress";
import { modulesData } from "@/utils/modulesData";
import { characters } from "@/utils/characterData";

function characterIdForName(name: string): string {
  return characters.find((c) => c.name === name || c.fullName === name)?.id ?? "ollie";
}

// Resolve the accent character from the current route so the global chrome
// reflects the active guide (Path B2 extended to the site header).
function resolveCharacterId(pathname: string): string {
  const lessonMatch = pathname.match(/^\/lesson\/(.+)$/);
  if (lessonMatch) {
    const moduleId = lessonMatch[1].split(".")[0];
    const module = modulesData.find((m) => String(m.id) === moduleId);
    if (module) return characterIdForName(module.character.name);
  }
  const modMatch = pathname.match(/^\/module-detail\/(\d+)$/);
  if (modMatch) {
    const module = modulesData.find((m) => String(m.id) === modMatch[1]);
    if (module) return characterIdForName(module.character.name);
  }
  return "ollie";
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nextLessonId, setNextLessonId] = useState("1.1");
  const [isNew, setIsNew] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const characterId = useMemo(() => resolveCharacterId(location.pathname), [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    const findNextLesson = async () => {
      const lessonOrder = await getLessonOrderForModuleAsync("1");
      if (cancelled || lessonOrder.length === 0) return;

      const nextId = lessonOrder.find((id) => !isLessonCompleted(id, 8));
      if (nextId) {
        setNextLessonId(nextId);
        setIsNew(nextId === lessonOrder[0]);
      } else {
        setNextLessonId(lessonOrder[lessonOrder.length - 1]);
        setIsNew(false);
      }
    };

    void findNextLesson();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/lesson/${nextLessonId}`);
  };

  return (
    <header data-character={characterId} className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 character-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">Mathland</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:character-accent-text transition-colors">Home</Link>
            <Link to="/world" className="text-slate-600 hover:character-accent-text transition-colors">Map</Link>
            <Link to="/experience" className="text-slate-600 hover:character-accent-text transition-colors">Experience</Link>
            <Link to="/course" className="text-slate-600 hover:character-accent-text transition-colors">Roadmap</Link>
            <Link to="/tier2-gallery" className="text-slate-600 hover:character-accent-text transition-colors">Templates</Link>
            <Link to="/interactive-gallery" className="text-slate-600 hover:character-accent-text transition-colors">Interactive</Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="character-accent text-white hover:opacity-90" onClick={handleContinue}>
              {isNew ? "Start Learning" : "Continue Learning"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-slate-600 hover:character-accent-text transition-colors">Home</Link>
              <Link to="/world" className="text-slate-600 hover:character-accent-text transition-colors">Map</Link>
              <Link to="/experience" className="text-slate-600 hover:character-accent-text transition-colors">Experience</Link>
              <Link to="/course" className="text-slate-600 hover:character-accent-text transition-colors">Roadmap</Link>
              <Link to="/tier2-gallery" className="text-slate-600 hover:character-accent-text transition-colors">Templates</Link>
              <Link to="/interactive-gallery" className="text-slate-600 hover:character-accent-text transition-colors">Interactive</Link>
              <div className="pt-4">
                <Button className="character-accent text-white w-full hover:opacity-90" onClick={handleContinue}>
                  {isNew ? "Start Learning" : "Continue Learning"}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
