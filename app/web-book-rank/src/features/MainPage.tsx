import { useEffect, useState } from "react";
import { Leaderboard } from "./Leaderboard";
import BookVoteCard from "./BookVoteCard";
import LeaderboardView from "./LeaderboardView";

export default function MainPage() {
  const [session, setSession] = useState<any>({});
  const [bookA, setBookA] = useState<any>();
  const [bookB, setBookB] = useState<any>();

  const [nextBookA, setNextBookA] = useState<any>();
  const [nextBookB, setNextBookB] = useState<any>();

  useEffect(() => {
    getMatchup();
  }, []);

  const updateLeaderboard = () => {
    const updatedStats = JSON.parse(window.jsGetRankingData());
    setSession(updatedStats);
  };

  const prefetchCover = async (isbn: string) => {
    // Pre-fetch covers for next books to have image in browser cache
    const img = new Image();
    img.src = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  };

  const getMatchup = () => {
    // Pre-fetch the next matchup so we can pre-fetch the images
    const data = JSON.parse(window.jsGetMatchup());

    if (!bookA || !bookB) {
      setBookA(data.BookA);
      setBookB(data.BookB);

      const next = JSON.parse(window.jsGetMatchup());
      setNextBookA(next.BookA);
      setNextBookB(next.BookB);

      prefetchCover(next.BookA.isbn);
      prefetchCover(next.BookB.isbn);
    } else {
      setBookA(nextBookA);
      setBookB(nextBookB);

      setNextBookA(data.BookA);
      setNextBookB(data.BookB);

      prefetchCover(data.BookA.isbn);
      prefetchCover(data.BookB.isbn);
    }
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

          {bookA && bookB && (
            <div className="grid gap-4 md:grid-cols-2">
              <BookVoteCard
                title={bookA.title}
                author={bookA.author}
                isbn={bookA.isbn}
                handleVote={() => chooseWinnerA()}
                onRemoveBook={() => removeBook(bookA.bookId)}
              />
              <BookVoteCard
                title={bookB.title}
                author={bookB.author}
                isbn={bookB.isbn}
                handleVote={() => chooseWinnerB()}
                onRemoveBook={() => removeBook(bookB.bookId)}
              />
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <LeaderboardView books={session} />
        </div>
      </div>
    </div>
  );
}
