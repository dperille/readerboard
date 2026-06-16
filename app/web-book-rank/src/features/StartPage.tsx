import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  const libraryInputRef = useRef<HTMLInputElement>(null);
  const sessionInputRef = useRef<HTMLInputElement>(null);

  const handleLibraryUpload = async (file: File) => {
    if (!file) return;

    const text = await file.text();
    const result = window.jsAddBooksFromCSV(text);

    // Get the ranking session data, and store in localStorage
    const session = JSON.parse(window.jsGetRankingData());
    localStorage.setItem("session", JSON.stringify(session));

    navigate("/rank");
  };

  const handleIntermediateUpload = async (file: File) => {
    // TODO
    navigate("/rank");
  };

  return (
    <div className="container mx-auto flex min-h-screen max-w-3xl items-center justify-center p-6">
      <Card className="w-full">
        <CardContent className="space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Book Ranker</h1>
            <p className="text-muted-foreground mt-2">
              Rank books head-to-head and build a personalized leaderboard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Button
              size="lg"
              className="h-32"
              onClick={() => libraryInputRef.current?.click()}
              onChange={(e) => handleLibraryUpload(e.target.files?.[0])}
            >
              Upload Library CSV
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="h-32"
              onClick={() => sessionInputRef.current?.click()}
            >
              Resume From Saved Results
            </Button>
          </div>

          <input
            ref={libraryInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              handleLibraryUpload(file);
            }}
          />

          <input
            ref={sessionInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              handleIntermediateUpload(file);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
