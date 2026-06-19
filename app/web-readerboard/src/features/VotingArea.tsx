import { type Matchup, wasmInstance, type BookId } from "@/types/wasm";
import BookVoteCard from "./BookVoteCard";
import { useEffect, useState } from "react";
import { Delete, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function VotingArea({
  refreshLeaderboard,
}: {
  refreshLeaderboard: () => void;
}) {
  const [matchup, setMatchup] = useState<Matchup | undefined>(undefined);
  const [nextMatchup, setNextMatchup] = useState<Matchup | undefined>(
    undefined,
  );

  const [hasUndo, setHasUndo] = useState(false);
  const handleUndo = () => {
    // Can't yet restore the previous matchup, so UI limits number of undos to 1
    // since beyond 1 action back it's not clear what you're undoing
    wasmInstance.undo();
    setHasUndo(false);
  };

  useEffect(() => {
    getMatchup();
  }, []);

  useEffect(() => {
    refreshLeaderboard();
  }, [matchup, hasUndo]);

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
    setHasUndo(true);
  };

  const removeBook = (id: string) => {
    wasmInstance.removeBook(id);
    getMatchup();
    setHasUndo(true);
  };

  return (
    matchup && (
      <div className="h-full w-full grid gap-4 grid-rows-[1fr_auto_1fr] grid-cols-1 md:grid-rows-1 md:grid-cols-[1fr_auto_1fr]">
        <BookVoteCard
          book={matchup.bookA}
          handleVote={() =>
            chooseWinner(matchup.bookA.bookId, matchup.bookB.bookId)
          }
          onRemoveBook={() => removeBook(matchup.bookA.bookId)}
        />

        <div className="flex flex-row md:flex-col items-center justify-center gap-2">
          <Button
            variant="ghost"
            disabled={!hasUndo}
            onClick={handleUndo}
            className={cn(
              "w-14 border border-dashed ring-1 dark:ring-2 ring-muted-foreground/20 hover:ring-muted-foreground/40 hover:bg-muted/30 transition-all",
              // Diagonal lines if not available
              hasUndo
                ? ""
                : "bg-[repeating-linear-gradient(135deg,rgba(120,120,120,0.25)_0px,rgba(120,120,120,0.25)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(135deg,rgba(120,120,120,0.75)_0px,rgba(120,120,120,0.75)_4px,transparent_4px,transparent_8px)]",
            )}
          >
            <Delete className="w-6! h-6!" />
          </Button>
          <div className="hidden md:flex flex-col rounded-full bg-background px-3 py-2 items-center">
            <Swords size={20} />
            <p className="text-xs text-muted-foreground tracking-widest">VS</p>
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
