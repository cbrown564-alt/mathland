import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import MathlandWorldApp from "./world/app/MathlandWorldApp";
import { NotFoundPage, PrivacyPage, SupportPage } from "./world/app/WorldInfoPages";
import { recordProductEvent } from "./world/operations/analytics";
import { WorldErrorBoundary } from "./world/operations/WorldErrorBoundary";

const LegacyRouteRedirect = () => {
  const location = useLocation();
  useEffect(() => recordProductEvent("legacy_route_redirected", { legacyRoute: location.pathname }), [location.pathname]);
  return <Navigate to={`/?from=${encodeURIComponent(location.pathname)}`} replace />;
};

const App = () => <WorldErrorBoundary>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MathlandWorldApp />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/prototype/one-operation-three-worlds" element={<LegacyRouteRedirect />} />
      <Route path="/experience" element={<LegacyRouteRedirect />} />
      <Route path="/module/:moduleId" element={<LegacyRouteRedirect />} />
      <Route path="/lesson/:lessonId" element={<LegacyRouteRedirect />} />
      <Route path="/story/:lessonId" element={<LegacyRouteRedirect />} />
      <Route path="/lab/*" element={<LegacyRouteRedirect />} />
      <Route path="/course" element={<LegacyRouteRedirect />} />
      <Route path="/module-detail/:id" element={<LegacyRouteRedirect />} />
      <Route path="/tier2-gallery" element={<LegacyRouteRedirect />} />
      <Route path="/interactive-gallery" element={<LegacyRouteRedirect />} />
      <Route path="/world" element={<LegacyRouteRedirect />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
</WorldErrorBoundary>;

export default App;
