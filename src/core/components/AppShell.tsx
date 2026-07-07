import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface AppShellProps {
  children: ReactNode;
  /** Extra classes for the scroll container (e.g. a page-level background). */
  className?: string;
}

/**
 * Shared page chrome (Path A5). Every top-level route renders through this so
 * the header/footer are consistent across the app and no route is bare.
 *
 * The Header already resolves its accent character from the current route, so
 * mounting it here (rather than per-page) also fixes the lesson screen, which
 * previously had no chrome at all.
 */
export const AppShell = ({ children, className }: AppShellProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 ${className ?? ""}`}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
