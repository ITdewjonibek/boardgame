import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import AddTest from "@/pages/AddTest";
import PlayerProfile from "@/pages/PlayerProfile";
import Leaderboard from "@/pages/Leaderboard";
import WheelGame from "@/pages/games/WheelGame";
import BarabanGame from "@/pages/games/BarabanGame";
import MemoryGame from "@/pages/games/MemoryGame";
import QuizGame from "@/pages/games/QuizGame";
import MathGame from "@/pages/games/MathGame";
import WordGame from "@/pages/games/WordGame";
import MillionaireGame from "@/pages/games/MillionaireGame";
import TugOfWarGame from "@/pages/games/TugOfWarGame";
import WordSearchGame from "@/pages/games/WordSearchGame";
import CountryGame from "@/pages/games/CountryGame";
import ChampionGame from "@/pages/games/ChampionGame";
import SpeedRoundGame from "@/pages/games/SpeedRoundGame";
import CrosswordGame from "@/pages/games/CrosswordGame";
import BiggestGame from "@/pages/games/BiggestGame";
import DuelGame from "@/pages/games/DuelGame";
import ChainGame from "@/pages/games/ChainGame";
import CosmicQuiz from "@/pages/games/CosmicQuiz";
import MolecularLab from "@/pages/games/MolecularLab";
import BattleOfWits from "@/pages/games/BattleOfWits";
import VerbalQuest from "@/pages/games/VerbalQuest";
import LogicMaster from "@/pages/games/LogicMaster";
import PuzzleGame from "@/pages/games/PuzzleGame";
import WordChainGame from "@/pages/games/WordChainGame";
import NotFound from "@/pages/NotFound";
import TestManager from "@/pages/admin/TestManager";
import { Toaster } from "sonner";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Toaster theme="dark" position="top-center" richColors />
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/add-test" element={<Layout><AddTest /></Layout>} />
          <Route path="/profile" element={<Layout><PlayerProfile /></Layout>} />
          <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
          <Route path="/test-manager" element={<Layout><TestManager /></Layout>} />
          <Route path="/games" element={<Navigate to="/" replace />} />
          <Route path="/games/wheel" element={<Layout><WheelGame /></Layout>} />
          <Route path="/games/baraban" element={<Layout><BarabanGame /></Layout>} />
          <Route path="/games/memory" element={<Layout><MemoryGame /></Layout>} />
          <Route path="/games/quiz" element={<Layout><QuizGame /></Layout>} />
          <Route path="/games/math" element={<Layout><MathGame /></Layout>} />
          <Route path="/games/word" element={<Layout><WordGame /></Layout>} />
          <Route path="/games/millionaire" element={<Layout><MillionaireGame /></Layout>} />
          <Route path="/games/tug-of-war" element={<Layout><TugOfWarGame /></Layout>} />
          <Route path="/games/word-search" element={<Layout><WordSearchGame /></Layout>} />
          <Route path="/games/country" element={<Layout><CountryGame /></Layout>} />
          <Route path="/games/champion" element={<Layout><ChampionGame /></Layout>} />
          <Route path="/games/speed-round" element={<Layout><SpeedRoundGame /></Layout>} />
          <Route path="/games/crossword" element={<Layout><CrosswordGame /></Layout>} />
          <Route path="/games/biggest" element={<Layout><BiggestGame /></Layout>} />
          <Route path="/games/duel" element={<Layout><DuelGame /></Layout>} />
          <Route path="/games/chain" element={<Layout><ChainGame /></Layout>} />
          <Route path="/games/cosmic-quiz" element={<Layout><CosmicQuiz /></Layout>} />
          <Route path="/games/molecular-lab" element={<Layout><MolecularLab /></Layout>} />
          <Route path="/games/battle-of-wits" element={<Layout><BattleOfWits /></Layout>} />
          <Route path="/games/verbal-quest" element={<Layout><VerbalQuest /></Layout>} />
          <Route path="/games/logic-master" element={<Layout><LogicMaster /></Layout>} />
          <Route path="/games/puzzle" element={<Layout><PuzzleGame /></Layout>} />
          <Route path="/games/word-chain" element={<Layout><WordChainGame /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
