import { type Matchup, wasmInstance, type BookId } from "@/types/wasm";
import BookVoteCard from "./BookVoteCard";
import { useEffect, useState } from "react";
import { Delete, FastForward, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, withTimeout } from "@/lib/utils";
import { motion } from "motion/react";

export default function VotingArea({
  refreshLeaderboard,
}: {
  refreshLeaderboard: () => void;
}) {
  const [matchup, setMatchup] = useState<Matchup | undefined>(undefined);
  const [nextMatchup, setNextMatchup] = useState<Matchup | undefined>(
    undefined,
  );

  // For animation
  const [removingId, setRemovingId] = useState<BookId | null>(null);
  const [winningId, setWinningId] = useState<BookId | null>(null);

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

  const chooseWinner = async (winner: BookId, loser: BookId) => {
    await withTimeout(
      () => setWinningId(winner),
      () => setWinningId(null),
      200,
    );

    wasmInstance.storeMatchupResult(winner, loser, 1);
    getMatchup();
    setHasUndo(true);
  };

  const removeBook = async (id: string) => {
    await withTimeout(
      () => setRemovingId(id),
      () => setRemovingId(null),
      200,
    );

    wasmInstance.removeBook(id);
    getMatchup();
    setHasUndo(true);
  };

  const getAnimationState = (bookId: BookId) => {
    if (removingId === bookId) return "removing";
    else if (winningId === bookId) return "winning";
    else if (removingId) return "fading";
    else if (winningId) return "losing";
    else return "idle";
  };

  return (
    matchup && (
      <div className="grid h-full min-h-0 w-full grid-cols-1 grid-rows-[1fr_auto_1fr] gap-4 md:grid-cols-[1fr_auto_1fr] md:grid-rows-1">
        <BookVoteCard
          book={matchup.bookA}
          animationState={getAnimationState(matchup.bookA.bookId)}
          handleVote={() =>
            chooseWinner(matchup.bookA.bookId, matchup.bookB.bookId)
          }
          onRemoveBook={() => removeBook(matchup.bookA.bookId)}
        />

        <div className="flex flex-row items-center gap-2 md:flex-col">
          <div className="bg-background hidden flex-1 flex-col items-center justify-end rounded-full px-3 py-2 md:flex">
            <Swords size={20} />
            <p className="text-muted-foreground text-xs tracking-widest">VS</p>
          </div>
          <div className="flex flex-1 justify-center gap-2 md:flex-col md:justify-end">
            <Button
              variant="ghost"
              onClick={getMatchup}
              className="ring-muted-foreground/20 hover:ring-muted-foreground/40 hover:bg-muted/30 w-14 border border-dashed ring-1 transition-all dark:ring-2"
            >
              <FastForward className="h-6! w-6!" />
            </Button>
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
          </div>
        </div>

        <BookVoteCard
          book={matchup.bookB}
          animationState={getAnimationState(matchup.bookB.bookId)}
          handleVote={() =>
            chooseWinner(matchup.bookB.bookId, matchup.bookA.bookId)
          }
          onRemoveBook={() => removeBook(matchup.bookB.bookId)}
        />
      </div>
    )
  );
}
