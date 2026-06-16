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
    <div className="container mx-auto max-w-7xl p-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Main ranking area */}
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Book Ranker</h1>
            <p className="text-muted-foreground">
              Upload your library and rank books head-to-head.
            </p>
          </div>
          <VotingArea refreshLeaderboard={refreshLeaderboard} />
        </div>

        {/* Leaderboard */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <LeaderboardView books={data} />
        </div>
      </div>
    </div>
  );
}
