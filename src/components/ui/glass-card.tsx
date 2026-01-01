import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className, 
  hover = false,
  glow = false,
  onClick 
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card p-4 relative overflow-hidden",
        hover && "transition-all duration-300 hover:border-pale-nebula/40 cursor-pointer",
        glow && "glow-accent",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
