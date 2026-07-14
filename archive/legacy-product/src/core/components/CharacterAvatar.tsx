import { cn } from "@/core/lib/utils";
import { motion } from "framer-motion";

interface CharacterAvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20"
};

export const CharacterAvatar = ({ src, alt, size = "md", className }: CharacterAvatarProps) => {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      className={cn(
        "rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0",
        sizeClasses[size],
        className
      )}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};
