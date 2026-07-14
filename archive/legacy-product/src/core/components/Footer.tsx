import { Heart, Mail, Github, Twitter } from "lucide-react";
import { MathlandBrand } from "./MathlandBrand";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        <MathlandBrand className="mb-4 md:mb-0" />
        <nav className="flex flex-col md:flex-row md:items-center gap-4 text-base">
          <a href="/course" className="hover:text-blue-600 transition-colors">Course Overview</a>
          <a href="mailto:hello@mathland.com" className="hover:text-blue-600 transition-colors">Contact</a>
          <a href="#" className="hover:text-blue-600 transition-colors">About</a>
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        </nav>
      </div>
      <div className="border-t border-slate-200 mt-8 pt-6 text-center text-sm text-slate-500">
        © 2024 Mathland. Made with <Heart className="w-4 h-4 text-red-400 inline mx-1" /> for mathematical learning.
      </div>
    </footer>
  );
};
