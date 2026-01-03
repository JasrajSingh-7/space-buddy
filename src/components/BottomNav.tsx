import { Link, useLocation } from "react-router-dom";
import { Home, Search, Star, History, Newspaper } from "lucide-react"; // Added Newspaper icon
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/categories" },
    { icon: Star, label: "Favorites", path: "/favorites" },
    { icon: History, label: "Timeline", path: "/timeline" },
    { icon: Newspaper, label: "Articles", path: "/articles" }, // New Item
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                isActive ? "text-pale-nebula" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive ? "scale-110" : "scale-100"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
