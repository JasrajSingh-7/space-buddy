import { cn } from "@/lib/utils";
import { Home, Search, Star, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Star, label: "Favorites", path: "/favorites" },
  { icon: Clock, label: "Timeline", path: "/timeline" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200",
                "touch-target",
                isActive
                  ? "text-pale-nebula bg-pale-nebula/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "animate-pulse-glow")} />
              <span className="text-2xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
