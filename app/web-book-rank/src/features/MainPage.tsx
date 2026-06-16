import { useEffect, useState } from "react";
import BookVoteCard from "./BookVoteCard";
import LeaderboardView from "./LeaderboardView";
import { wasmInstance, type Book, type BookData } from "@/types/wasm";

export default function MainPage() {
  const [session, setSession] = useState<BookData>({});
  const [bookA, setBookA] = useState<Book>();
  const [bookB, setBookB] = useState<Book>();

  const [nextBookA, setNextBookA] = useState<Book>();
  const [nextBookB, setNextBookB] = useState<Book>();

  useEffect(() => {
    updateLeaderboard();
    getMatchup();
  }, []);

  const updateLeaderboard = () => {
    const updatedStats = wasmInstance.getRankingData();
    setSession(updatedStats);
  };

  const prefetchCover = async (isbn: string) => {
    // Pre-fetch covers for next books to have image in browser cache
    const img = new Image();
    img.src = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  };

  const getMatchup = () => {
    // Pre-fetch the next matchup so we can pre-fetch the images
    const data = wasmInstance.getMatchup();

    if (!bookA || !bookB) {
      setBookA(data.bookA);
      setBookB(data.bookB);

      const next = wasmInstance.getMatchup();
      setNextBookA(next.bookA);
      setNextBookB(next.bookB);

      prefetchCover(next.bookA.isbn);
      prefetchCover(next.bookB.isbn);
    } else {
      setBookA(nextBookA);
      setBookB(nextBookB);

      setNextBookA(data.bookA);
      setNextBookB(data.bookB);

      prefetchCover(data.bookA.isbn);
      prefetchCover(data.bookB.isbn);
    }
  };

  const chooseWinnerA = () => {
    // TODO - should just return rating updates for those involved, rather than whole leaderboard
    wasmInstance.storeMatchupResult(bookA.bookId, bookB.bookId, 1);
    updateLeaderboard();
    getMatchup();
  };
  const chooseWinnerB = () => {
    wasmInstance.storeMatchupResult(bookB.bookId, bookA.bookId, 1);
    updateLeaderboard();
    getMatchup();
  };

  const removeBook = (id: string) => {
    wasmInstance.removeBook(id);
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
                book={bookA}
                handleVote={() => chooseWinnerA()}
                onRemoveBook={() => removeBook(bookA.bookId)}
              />
              <BookVoteCard
                book={bookB}
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
