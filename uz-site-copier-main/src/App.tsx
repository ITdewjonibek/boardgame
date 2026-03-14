import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import GamesPage from "./pages/GamesPage.tsx";
import WheelGame from "./pages/games/WheelGame.tsx";
import MemoryGame from "./pages/games/MemoryGame.tsx";
import QuizGame from "./pages/games/QuizGame.tsx";
import MathGame from "./pages/games/MathGame.tsx";
import WordGame from "./pages/games/WordGame.tsx";
import MillionaireGame from "./pages/games/MillionaireGame.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/wheel" element={<WheelGame />} />
          <Route path="/games/memory" element={<MemoryGame />} />
          <Route path="/games/quiz" element={<QuizGame />} />
          <Route path="/games/math" element={<MathGame />} />
          <Route path="/games/word" element={<WordGame />} />
          <Route path="/games/millionaire" element={<MillionaireGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
