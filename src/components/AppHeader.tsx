import { cn } from "@/lib/utils";
import { Telescope, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  className?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function AppHeader({ className, showMenu = true, onMenuClick }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-10 px-4 py-4 flex items-center justify-between",
        "bg-background/60 backdrop-blur-md border-b border-border/30",
        className
      )}
    >
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pale-nebula via-cosmic-purple to-nebula-pink flex items-center justify-center shadow-lg group-hover:shadow-pale-nebula/20 transition-shadow">
          <Telescope className="w-5 h-5 text-white" />
        </div>
        <span className="font-heading font-semibold text-xl text-foreground">
          Shunya
        </span>
      </Link>

      {showMenu && (
        <button
          onClick={onMenuClick}
          className="touch-target flex items-center justify-center rounded-full bg-secondary/60 backdrop-blur-sm hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      )}
    </header>
  );
}
