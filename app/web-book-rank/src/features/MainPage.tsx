import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Leaderboard } from "./Leaderboard";
import BookVoteCard from "./BookVoteCard";

export default function MainPage() {
  const [session, setSession] = useState<any>({});
  const [bookA, setBookA] = useState<any>();
  const [bookB, setBookB] = useState<any>();

  useEffect(() => {
    getMatchup();
  }, []);

  const updateLeaderboard = () => {
    const updatedStats = JSON.parse(window.jsGetRankingData());
    setSession(updatedStats);
  };

  const getMatchup = () => {
    const data = JSON.parse(window.jsGetMatchup());

    setBookA(data.BookA);
    setBookB(data.BookB);
  };

  const chooseWinnerA = () => {
    // TODO - should just return rating updates for those involved, rather than whole leaderboard
    window.jsStoreMatchupResult(bookA.bookId, bookB.bookId, 1);
    updateLeaderboard();
    getMatchup();
  };
  const chooseWinnerB = () => {
    window.jsStoreMatchupResult(bookB.bookId, bookA.bookId, 1);
    updateLeaderboard();
    getMatchup();
  };

  const removeBook = (id: string) => {
    window.jsRemoveBook(id);
    updateLeaderboard();
    getMatchup();
  }

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

          {bookA && bookB && (
            <div className="grid gap-4 md:grid-cols-2">
              <BookVoteCard
                title={bookA.title}
                author={bookA.author}
                handleVote={() => chooseWinnerA()}
                onRemoveBook={() => removeBook(bookA.bookId)}
              />
              <BookVoteCard
                title={bookB.title}
                author={bookB.author}
                handleVote={() => chooseWinnerB()}
                onRemoveBook={() => removeBook(bookB.bookId)}
              />
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Leaderboard books={session} />
        </div>
      </div>
    </div>
  );
}
