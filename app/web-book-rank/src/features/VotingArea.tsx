import {
  type Matchup,
  wasmInstance,
  type BookId,
} from "@/types/wasm";
import BookVoteCard from "./BookVoteCard";
import { useEffect, useState } from "react";

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
      <div className="grid gap-4 md:grid-cols-2">
        <BookVoteCard
          book={matchup.bookA}
          handleVote={() =>
            chooseWinner(matchup.bookA.bookId, matchup.bookB.bookId)
          }
          onRemoveBook={() => removeBook(matchup.bookA.bookId)}
        />
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
