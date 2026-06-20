import { useEffect, useState } from "react";
import LeaderboardView from "./LeaderboardView";
import { wasmInstance, type BookData } from "@/types/wasm";
import VotingArea from "./VotingArea";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <div className="max-w-8xl mx-auto flex h-screen w-screen flex-col gap-4 p-4 pb-0 lg:flex-row">
      {/* Ranking area - includes header to give leaderboard more prominence */}
      <div className="flex min-h-0 flex-2 flex-col items-center space-y-4">
        {/* Header */}
        <div className="flex w-full flex-row-reverse items-center justify-between space-y-2 md:flex-col">
          <ThemeToggle />
          <div className="text-center">
            <h1
              className="hover:text-muted-foreground cursor-pointer text-3xl font-bold"
              onClick={() => navigate("/")}
            >
              📚 Readerboard
            </h1>
            <p className="text-muted-foreground hidden md:flex">
              Rank books head-to-head and build a personalized leaderboard.
            </p>
          </div>
        </div>

        <div className="min-h-0 w-full max-w-4xl flex-1 lg:max-h-[80vh] lg:items-center lg:justify-center lg:py-10">
          <VotingArea refreshLeaderboard={refreshLeaderboard} />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="min-h-0 flex-1">
        <LeaderboardView books={data} />
      </div>
    </div>
  );
}
