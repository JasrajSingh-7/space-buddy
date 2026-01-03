import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import ObjectDetail from "./pages/ObjectDetail";
import Timeline from "./pages/Timeline";
import Favorites from "./pages/Favorites";
// 👇 1. ADD THIS IMPORT
import Articles from "./pages/Articles"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryDetail />} />
          <Route path="/object/:slug" element={<ObjectDetail />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/favorites" element={<Favorites />} />
          
          {/* 👇 2. ADD THIS ROUTE */}
          <Route path="/articles" element={<Articles />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
