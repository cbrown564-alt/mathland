import { Link } from "react-router-dom";

type MathlandBrandProps = {
  inverse?: boolean;
  compact?: boolean;
  className?: string;
};

/** Shared Orbit Node identity for navigation, footers, and immersive surfaces. */
export const MathlandBrand = ({ inverse = false, compact = false, className = "" }: MathlandBrandProps) => (
  <Link
    to="/"
    aria-label="Mathland home"
    className={`inline-flex items-center gap-2.5 ${className}`}
  >
    <img
      src={inverse ? "/mathland-mark-inverse.svg" : "/mathland-mark.svg"}
      alt=""
      aria-hidden="true"
      className={compact ? "h-8 w-8" : "h-10 w-10"}
    />
    {!compact && (
      <span className={`text-2xl font-bold tracking-[-0.03em] ${inverse ? "text-white" : "text-slate-800"}`}>
        Mathland
      </span>
    )}
  </Link>
);
