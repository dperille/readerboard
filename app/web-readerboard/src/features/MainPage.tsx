import { useEffect, useState } from "react";
import LeaderboardView from "./LeaderboardView";
import { wasmInstance, type BookData } from "@/types/wasm";
import VotingArea from "./VotingArea";
import { useNavigate } from "react-router-dom";
import { ThemeSwitch } from "@/components/ui/ThemeToggle";

export default function MainPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<BookData>({});

  useEffect(() => {
    refreshLeaderboard();
  }, []);

  const refreshLeaderboard = () => {
    const updatedStats = wasmInstance.getRankingData();
    setData(updatedStats);
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row max-w-8xl mx-auto p-4 pb-0 gap-4">
      {/* Ranking area - includes header to give leaderboard more prominence */}
      <div className="flex flex-2 flex-col min-h-0 items-center space-y-4">
        {/* Header */}
        <div className="w-full flex flex-row-reverse md:flex-col items-center space-y-2 justify-between">
          <ThemeSwitch />
          <div className="text-center">
            <h1
              className="text-3xl font-bold hover:text-muted-foreground cursor-pointer"
              onClick={() => navigate("/")}
            >
              📚 Readerboard
            </h1>
            <p className="hidden md:flex text-muted-foreground">
              Rank books head-to-head and build a personalized leaderboard.
            </p>
          </div>
        </div>

        <div className="min-h-0 w-full max-w-4xl lg:max-h-[80vh] lg:items-center lg:justify-center flex-1 lg:py-10">
          <VotingArea refreshLeaderboard={refreshLeaderboard} />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex-1 min-h-0">
        <LeaderboardView books={data} />
      </div>
    </div>
  );
}
