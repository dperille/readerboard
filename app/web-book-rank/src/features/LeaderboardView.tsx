import { useState } from "react";
import { Leaderboard } from "./Leaderboard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { BookData } from "@/types/wasm";

export default function LeaderboardView({ books }: { books: BookData }) {
  const [expanded, setExpanded] = useState(false);

  if (expanded) {
    return (
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          showCloseButton={false}
          className="h-[95vh] min-w-[95vw] flex flex-col"
        >
          <Leaderboard
            books={books}
            expanded={expanded}
            handleExpand={() => setExpanded(false)}
          />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <div className="h-full">
        <Leaderboard
          books={books}
          expanded={expanded}
          handleExpand={() => setExpanded(true)}
        />
      </div>
    );
  }
}
