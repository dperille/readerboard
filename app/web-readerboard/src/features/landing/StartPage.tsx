import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { wasmInstance } from "@/types/wasm";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const [existingSession, setExistingSession] = useState(false);

  const navigate = useNavigate();

  const libraryInputRef = useRef<HTMLInputElement>(null);
  const sessionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkPrevSession = () => {
      const prevSession = localStorage.getItem("session");
      if (prevSession) {
        setExistingSession(true);
      }
    };

    checkPrevSession();
  }, []);

  const handleLibraryUpload = async (file: File) => {
    if (!file) return;

    const text = await file.text();
    wasmInstance.addBooksFromCSV(text);

    // Get the parsed ranking data, and store in localStorage
    const session = wasmInstance.getRankingData();
    localStorage.setItem("session", JSON.stringify(session));

    navigate("/rank");
  };

  const handleIntermediateUpload = async (file: File) => {
    if (!file) return;

    const text = await file.text();
    wasmInstance.putRankingData(text);

    // Get the ranking data, and store in localStorage
    const session = wasmInstance.getRankingData();
    localStorage.setItem("session", JSON.stringify(session));

    navigate("/rank");
  };

  return (
    <div className="container mx-auto max-w-3xl flex-row justify-center p-6">
      <div className="flex flex-col items-center space-y-4 pt-4 text-center">
        <ThemeToggle />
        <h1 className="text-5xl font-bold tracking-tight">📚 Readerboard</h1>

        <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-lg">
          Compare books head-to-head and automatically build your personalized
          reading leaderboard.
        </p>
      </div>
      <div className="space-y-8 p-10">
        {/* Continue session */}
        {existingSession && (
          <Card>
            <CardContent className="flex flex-col p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">Saved session found</h3>
                <p className="text-muted-foreground text-sm">
                  Continue ranking where you left off.
                </p>
              </div>

              <Button onClick={() => navigate("/rank")} className="shrink-0">
                Continue Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* New session */}
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-semibold">
                Start a New Ranking Session
              </h2>

              <p className="text-muted-foreground">
                Upload your{" "}
                <a
                  href="https://goodreads.com/review/import"
                  rel="noreferrer"
                  target="_blank" // new tab
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 underline underline-offset-4"
                >
                  exported Goodreads library
                  <ExternalLink size={14} />
                </a>{" "}
                and begin ranking books. <br />
                Ranking data is processed in your browser and is not sent to any
                server.
              </p>

              <Button
                size="lg"
                className="h-14 w-full text-base"
                onClick={() => libraryInputRef.current?.click()}
              >
                Upload Library CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Restore */}
        <div className="space-y-3">
          <h3 className="text-muted-foreground text-center text-sm font-medium">
            Or restore previous results
          </h3>

          <Card
            className="hover:border-primary cursor-pointer transition-all hover:shadow-md"
            onClick={() => sessionInputRef.current?.click()}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <div className="font-medium">Import Saved Results</div>

                <div className="text-muted-foreground text-sm">
                  Resume from an exported ranking session.
                </div>
              </div>

              <ArrowRight className="text-muted-foreground h-5 w-5" />
            </CardContent>
          </Card>
        </div>

        {/* Hidden inputs to allow styling */}
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
      </div>
    </div>
  );
}
