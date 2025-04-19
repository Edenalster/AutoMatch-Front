import { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router-dom";

const FindMatch = () => {
  const [entryFee, setEntryFee] = useState([0]);
  const [gameType, setGameType] = useState("any");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/"); // Navigate to the tournaments page
  };

  const handleSearch = () => {
    console.log("Searching with:", { entryFee: entryFee[0], gameType });
  };

  return (
    <div className="min-h-screen bg-chess-dark">
      {/* Background gradient with a chess board pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-chess-dark/90 via-chess-dark to-chess-dark/90 z-0"></div>
      <div className="absolute inset-0 chess-board-bg opacity-15 z-0"></div>

      {/* Decorative blurred elements for dynamic visuals */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-chess-gold/10 rounded-full filter blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-chess-secondary/10 rounded-full filter blur-3xl animate-pulse-soft"></div>
      <Navbar showItems={false} />

      <div className="pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md mb-4 animate-fade-in">
            Find Match
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 space-y-8">
            {/* Entry Fee Slider */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-white mb-2">
                Entry Fee
              </label>
              <div className="px-2">
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  value={entryFee}
                  onValueChange={setEntryFee}
                  className="w-full"
                />
              </div>
              <div className="text-right text-chess-gold font-bold">
                ${entryFee[0]}-Max
              </div>
            </div>

            {/* Game Type Select */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-white mb-2">
                Game Type
              </label>
              <Select value={gameType} onValueChange={setGameType}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select game type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="rapid">Rapid</SelectItem>
                  <SelectItem value="blitz">Blitz</SelectItem>
                  <SelectItem value="bullet">Bullet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="flex flex-row gap-10">
              <Button
                onClick={handleClick}
                className="w-full secondary-btn mt-8 bg-blue-900 text-white hover:bg-blue-700 "
              >
                Cancel
              </Button>

              <Button
                onClick={handleSearch}
                className="w-full primary-btn mt-8 "
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMatch;
