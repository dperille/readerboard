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
      <div className="grid h-full min-h-0 w-full grid-cols-1 grid-rows-[1fr_auto_1fr] gap-4 md:grid-cols-[1fr_auto_1fr] md:grid-rows-1">
        <BookVoteCard
          book={matchup.bookA}
          handleVote={() =>
            chooseWinner(matchup.bookA.bookId, matchup.bookB.bookId)
          }
          onRemoveBook={() => removeBook(matchup.bookA.bookId)}
        />

        <div className="flex flex-row items-center justify-center gap-2 md:flex-col">
          <Button
            variant="ghost"
            disabled={!hasUndo}
            onClick={handleUndo}
            className={cn(
              "ring-muted-foreground/20 hover:ring-muted-foreground/40 hover:bg-muted/30 w-14 border border-dashed ring-1 transition-all dark:ring-2",
              // Diagonal lines if not available
              hasUndo
                ? ""
                : "bg-[repeating-linear-gradient(135deg,rgba(120,120,120,0.25)_0px,rgba(120,120,120,0.25)_4px,transparent_4px,transparent_8px)] dark:bg-[repeating-linear-gradient(135deg,rgba(120,120,120,0.75)_0px,rgba(120,120,120,0.75)_4px,transparent_4px,transparent_8px)]",
            )}
          >
            <Delete className="h-6! w-6!" />
          </Button>
          <div className="bg-background hidden flex-col items-center rounded-full px-3 py-2 md:flex">
            <Swords size={20} />
            <p className="text-muted-foreground text-xs tracking-widest">VS</p>
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
