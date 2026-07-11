import { Toaster as Sonner } from "@/core/components/ui/sonner";
import { TooltipProvider } from "@/core/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./core/components/AppShell";

const Index = lazy(() => import("./core/pages/Index"));
const ModulePage = lazy(() => import("./core/pages/ModulePage"));
const LessonPage = lazy(() => import("./core/pages/LessonPage"));
const StoryPage = lazy(() => import("./core/pages/StoryPage"));
const CoupledLabPage = lazy(() => import("./core/pages/CoupledLabPage"));
const BeatLabPage = lazy(() => import("./core/pages/BeatLabPage"));
const NotFound = lazy(() => import("./core/pages/NotFound"));
const Course = lazy(() => import("./core/pages/Course"));
const ModuleDetail = lazy(() => import("./core/pages/ModuleDetail"));
const Experience = lazy(() => import("./core/pages/Experience"));
const Tier2Gallery = lazy(() => import("./core/pages/Tier2Gallery"));
const InteractiveGallery = lazy(() => import("./core/pages/InteractiveGallery"));
const WorldMapPage = lazy(() => import("./core/pages/WorldMapPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/module/:moduleId" element={<ModulePage />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/story/:lessonId" element={<StoryPage />} />
              <Route path="/lab/coupled" element={<CoupledLabPage />} />
              <Route path="/lab/beat" element={<BeatLabPage />} />
              <Route path="/course" element={<Course />} />
              <Route path="/module-detail/:id" element={<ModuleDetail />} />
              <Route path="/tier2-gallery" element={<Tier2Gallery />} />
              <Route path="/interactive-gallery" element={<InteractiveGallery />} />
              <Route path="/world" element={<WorldMapPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
