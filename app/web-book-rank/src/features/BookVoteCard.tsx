import { Button } from "@/components/ui/button";

export default function BookVoteCard({
  title,
  author,
  isbn,
  handleVote,
  onRemoveBook,
}: {
  title: string;
  author: string;
  isbn: string;
  handleVote: () => void;
  onRemoveBook: () => void;
}) {
  console.log(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
  return (
    <Button
      variant="outline"
      className="h-48 text-lg whitespace-normal"
      onClick={() => handleVote()}
    >
      <img src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`} />
      <p>{title}</p>
      <p>{author}</p>
      <div className="hover:bg-primary/80" onClick={onRemoveBook}>
        Stop including this book
      </div>
    </Button>
  );
}
