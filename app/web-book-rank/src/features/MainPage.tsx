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
    <div className="h-screen max-w-8xl mx-auto p-4">
      <div className="flex h-full flex-col gap-4 lg:flex-row">
        {/* Ranking Area */}
        <div className="flex min-h-0 flex-2 flex-col space-y-4 items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold">📚 Readerboard</h1>
            <p className="text-muted-foreground">
              Rank books head-to-head and build a personalized leaderboard.
            </p>
          </div>

          <div className="w-full max-w-4xl lg:max-h-[80vh] lg:items-center lg:justify-center flex-1 lg:py-10">
            <VotingArea refreshLeaderboard={refreshLeaderboard} />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="min-h-0 flex-1">
          <LeaderboardView books={data} />
        </div>
      </div>
    </div>
  );
}
