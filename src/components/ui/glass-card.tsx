import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function GlassCard({ 
  children, 
  className, 
  hover = false,
  glow = false,
  onClick,
  style
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
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
