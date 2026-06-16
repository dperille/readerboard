import { useState } from "react";
import { Leaderboard } from "./Leaderboard";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function LeaderboardView({ books }: any) {
  const [expanded, setExpanded] = useState(false);

  if (expanded) {
    return (
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[90vh] flex flex-col min-w-full"
        >
          <Leaderboard books={books} handleExpand={() => setExpanded(false)} />
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <div className="h-screen overflow-hidden flex flex-col">
        <Leaderboard books={books} handleExpand={() => setExpanded(true)} />
      </div>
    );
  }
}
