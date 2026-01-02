import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

// Configuration - Replace this URL with your uploaded logo URL later
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3212/3212567.png";
const APP_NAME = "Brahmand";

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
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-pale-nebula via-cosmic-purple to-nebula-pink shadow-lg group-hover:shadow-pale-nebula/20 transition-shadow">
          {/* Replace LOGO_URL constant at the top of this file with your custom logo */}
          <img 
            src={LOGO_URL} 
            alt={`${APP_NAME} Logo`} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-heading font-semibold text-xl text-foreground">
          {APP_NAME}
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
