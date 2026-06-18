import { type Matchup, wasmInstance, type BookId } from "@/types/wasm";
import BookVoteCard from "./BookVoteCard";
import { useEffect, useState } from "react";
import { Swords } from "lucide-react";

export default function VotingArea({
  refreshLeaderboard,
}: {
  refreshLeaderboard: () => void;
}) {
  const [matchup, setMatchup] = useState<Matchup | undefined>(undefined);
  const [nextMatchup, setNextMatchup] = useState<Matchup | undefined>(
    undefined,
  );

  useEffect(() => {
    getMatchup();
  }, []);

  const getMatchup = () => {
    if (!matchup) {
      setMatchup(wasmInstance.getMatchup());
    } else {
      setMatchup(nextMatchup);
    }

    const next = wasmInstance.getMatchup();
    setNextMatchup(next);

    prefetchCover(next.bookA.isbn);
    prefetchCover(next.bookB.isbn);
  };

  const prefetchCover = async (isbn: string) => {
    // Pre-fetch covers for next books to have image in browser cache
    const img = new Image();
    img.src = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  };

  const chooseWinner = (winner: BookId, loser: BookId) => {
    wasmInstance.storeMatchupResult(winner, loser, 1);
    getMatchup();
    refreshLeaderboard();
  };

  const removeBook = (id: string) => {
    wasmInstance.removeBook(id);
    getMatchup();
    refreshLeaderboard();
  };

  return (
    matchup && (
      <div className="h-full w-full grid gap-4 grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-[1fr_auto_1fr]">
        <BookVoteCard
          book={matchup.bookA}
          handleVote={() =>
            chooseWinner(matchup.bookA.bookId, matchup.bookB.bookId)
          }
          onRemoveBook={() => removeBook(matchup.bookA.bookId)}
        />

        <div className="hidden md:flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full border bg-background px-3 py-2 shadow-sm">
              <Swords size={20} />
            </div>
            <div className="text-xs text-muted-foreground tracking-widest">
              VS
            </div>
          </div>
        </div>

        <BookVoteCard
          book={matchup.bookB}
          handleVote={() =>
            chooseWinner(matchup.bookB.bookId, matchup.bookA.bookId)
          }
          onRemoveBook={() => removeBook(matchup.bookB.bookId)}
        />
      </div>
    )
  );
}
