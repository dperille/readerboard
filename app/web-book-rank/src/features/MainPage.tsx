import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function MainPage() {
  const [bookA, setBookA] = useState<any>();
  const [bookB, setBookB] = useState<any>();

  const handleLibraryUpload = async (file: File) => {
    if (!file) return;

    const text = await file.text();
    console.log(text);

    const result = window.jsAddBooksFromCSV(text);
  };

  const getMatchup = () => {
    const result = window.jsGetMatchup();
    const data = JSON.parse(result);

    console.log(data);
    setBookA(data.BookA.Title);
    setBookB(data.BookB.Title);
  };

  const chooseWinner = (book) => {
    getMatchup();
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Book Ranker</h1>
          <p className="text-muted-foreground">
            Upload your library and rank books head-to-head.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h2 className="font-semibold">Library</h2>

              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleLibraryUpload(e.target.files?.[0])}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={getMatchup}>Get Matchup</Button>
        </div>

        {bookA && bookB && (
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-48 text-lg whitespace-normal"
              onClick={() => chooseWinner(bookA)}
            >
              {bookA}
            </Button>

            <Button
              variant="outline"
              className="h-48 text-lg whitespace-normal"
              onClick={() => chooseWinner(bookB)}
            >
              {bookB}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
