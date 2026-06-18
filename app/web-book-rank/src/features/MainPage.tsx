import { useEffect, useState } from "react";
import LeaderboardView from "./LeaderboardView";
import { wasmInstance, type BookData } from "@/types/wasm";
import VotingArea from "./VotingArea";

export default function MainPage() {
  const [data, setData] = useState<BookData>({});

  useEffect(() => {
    refreshLeaderboard();
  }, []);

  const refreshLeaderboard = () => {
    const updatedStats = wasmInstance.getRankingData();
    setData(updatedStats);
  };

  return (
    <div className="container mx-auto max-w-8xl p-6">
      <div className="grid gap-8 lg:grid-rows-1 lg:grid-cols-[3fr_2fr]">
        {/* Main ranking area */}
        <div className="space-y-8 bg-blue-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold">📚 Readerboard</h1>
            <p className="text-muted-foreground">
              Rank books head-to-head and build a personalized leaderboard.
            </p>
          </div>
          <VotingArea refreshLeaderboard={refreshLeaderboard} />
        </div>

        {/* Leaderboard */}
        <div className="h-full min-w-0 bg-red-100 overflow-auto">
          <LeaderboardView books={data} />
        </div>
      </div>
    </div>
  );
}
