import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function MainPage() {
  const [bookA, setBookA] = useState<any>();
  const [bookB, setBookB] = useState<any>();

  useEffect(() => {
    getMatchup();
  }, []);

  const getMatchup = () => {
    const result = window.jsGetMatchup();
    const data = JSON.parse(result);

    setBookA(data.BookA);
    setBookB(data.BookB);
  };

  const chooseWinnerA = () => {
    jsStoreMatchupResult(bookA.bookId, bookB.bookId, 1);
    getMatchup();
  };
  const chooseWinnerB = () => {
    jsStoreMatchupResult(bookB.bookId, bookA.bookId, 1);
    getMatchup();
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Book Ranker</h1>
          <p className="text-muted-foreground">
            Upload your library and rank books head-to-head.
          </p>
        </div>

        {bookA && bookB && (
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-48 text-lg whitespace-normal"
              onClick={() => chooseWinnerA()}
            >
              {bookA.title}
            </Button>

            <Button
              variant="outline"
              className="h-48 text-lg whitespace-normal"
              onClick={() => chooseWinnerB()}
            >
              {bookB.title}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
