export function Leaderboard({ books }: any) {
  console.log(books);
  const sortedBooks = Object.values(books).sort((a, b) => b.rating - a.rating);

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="font-semibold">Leaderboard</h2>
      </div>

      <div className="h-full overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b text-muted-foreground">
              <th className="px-4 py-2 text-left w-16">#</th>
              <th className="px-4 py-2 text-left">Book</th>
              <th className="px-4 py-2 text-left">Author</th>
              <th className="px-4 py-2 text-right">Rating</th>
            </tr>
          </thead>

          <tbody>
            {sortedBooks.map((book, index) => (
              <tr
                key={book.bookId}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-medium">{index + 1}</td>

                <td className="px-4 py-3">
                  <div className="font-medium">{book.title}</div>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {book.author}
                </td>

                <td className="px-4 py-3 text-right font-mono">
                  {book.rating.toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
