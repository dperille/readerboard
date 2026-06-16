import { Button } from "@/components/ui/button";

export default function BookVoteCard({
  title,
  author,
  handleVote,
  onRemoveBook,
}: {
  title: string;
  author: string;
  handleVote: () => void;
  onRemoveBook: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="h-48 text-lg whitespace-normal"
      onClick={() => handleVote()}
    >
      <p>{title}</p>
      <p>{author}</p>
      <div className="hover:bg-primary/80" onClick={onRemoveBook}>
        Stop including this book
      </div>
    </Button>
  );
}
