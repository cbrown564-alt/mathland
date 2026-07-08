import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface AppShellProps {
  children: ReactNode;
  /** Extra classes for the scroll container (e.g. a page-level background). */
  className?: string;
}

/** Routes that render full-bleed with no header/footer (immersive experiences). */
const BARE_ROUTES = [/^\/story\//];

/**
 * Shared page chrome (Path A5). Every top-level route renders through this so
 * the header/footer are consistent across the app and no route is bare — except
 * immersive routes (the guided story) which take over the whole viewport.
 *
 * The Header already resolves its accent character from the current route, so
 * mounting it here (rather than per-page) also fixes the lesson screen, which
 * previously had no chrome at all.
 */
export const AppShell = ({ children, className }: AppShellProps) => {
  const { pathname } = useLocation();
  const bare = BARE_ROUTES.some((re) => re.test(pathname));

  if (bare) return <>{children}</>;

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 ${className ?? ""}`}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
