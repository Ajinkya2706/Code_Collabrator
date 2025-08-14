import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MovingBorderButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  className?: string;
}

export function MovingBorderButton({ children, className, ...props }: MovingBorderButtonProps) {
  return (
    <  motion.button
      whileHover={{ boxShadow: "0 0 0 4px #6366f1, 0 0 0 8px #a5b4fc" }}
      className={cn(
        "relative px-6 py-3 rounded-lg border-2 border-indigo-500 bg-black text-white font-semibold transition-all duration-300 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
      <span className="absolute inset-0 border-2 border-indigo-400 animate-border-move pointer-events-none rounded-lg" />
    </motion.button>
  );
}