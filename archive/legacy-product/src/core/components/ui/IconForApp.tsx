import { BarChart, Globe, Calculator, Cpu, Users, FileSpreadsheet, Code, TrendingUp, ShieldCheck, FlaskConical, BookOpen, Image, Film, Search, Bot, Activity, CloudSun, Stethoscope, ShoppingCart, Truck, FlaskRound, Award, UserCheck, GraduationCap, Brain, Shield, Layers, PieChart, Mail, CheckCircle, AlertTriangle, Star, Briefcase, Settings } from "lucide-react";
import React from "react";

// Map keywords to Lucide icons
const keywordIconMap: Record<string, React.ElementType> = {
  spreadsheet: FileSpreadsheet,
  excel: FileSpreadsheet,
  programming: Code,
  code: Code,
  data: BarChart,
  business: TrendingUp,
  quality: ShieldCheck,
  gps: Globe,
  navigation: Globe,
  recommendation: Users,
  netflix: Users,
  graphics: Image,
  computer: Cpu,
  machine: Cpu,
  learning: Brain,
  facial: UserCheck,
  recognition: UserCheck,
  image: Image,
  economic: TrendingUp,
  modeling: TrendingUp,
  animation: Film,
  google: Search,
  pagerank: Search,
  robotics: Bot,
  principal: Award,
  earthquake: AlertTriangle,
  financial: TrendingUp,
  risk: Shield,
  compression: Layers,
  weather: CloudSun,
  medical: Stethoscope,
  mri: Stethoscope,
  economics: ShoppingCart,
  engineering: FlaskConical,
  design: FlaskConical,
  neural: Brain,
  optimization: TrendingUp,
  autonomous: Truck,
  portfolio: PieChart,
  supply: Truck,
  drug: FlaskRound,
  insurance: ShieldCheck,
  ab: CheckCircle,
  sports: Award,
  clinical: Stethoscope,
  market: ShoppingCart,
  environmental: CloudSun,
  education: GraduationCap,
  manufacturing: Settings,
  spam: Mail,
  fraud: AlertTriangle,
  scientific: FlaskConical,
  capstone: Star,
  predictive: BarChart,
  intelligence: Brain,
  research: FlaskConical,
  career: Briefcase,
};

// Fallback icon
const fallbackIcon = Briefcase;

export function IconForApp({ title, idx, color }: { title: string, idx: number, color?: string }) {
  // Try to find a keyword match in the title
  const lower = title.toLowerCase();
  const bgClass = color ? `bg-gradient-to-br ${color}` : "bg-gradient-to-br from-orange-400 to-orange-600";
  for (const [keyword, Icon] of Object.entries(keywordIconMap)) {
    if (lower.includes(keyword)) {
      return <Icon className={`w-8 h-8 text-white ${bgClass} rounded-full p-1.5 shadow`} />;
    }
  }
  // Fallback: cycle through a few icons for variety
  const icons = [Briefcase, BarChart, Globe, Cpu, Users, FileSpreadsheet, Code, TrendingUp, ShieldCheck, FlaskConical, BookOpen, Image, Film, Search, Bot, Activity, CloudSun, Stethoscope, ShoppingCart, Truck, FlaskRound, Award, UserCheck, GraduationCap, Brain, Shield, Layers, PieChart, Mail, CheckCircle, AlertTriangle, Star, Settings];
  const Icon = icons[idx % icons.length] || fallbackIcon;
  return <Icon className={`w-8 h-8 text-white ${bgClass} rounded-full p-1.5 shadow`} />;
} 