export type BookId = string;

export type Book = {
  bookId: BookId;
  title: string;
  author: string;
  isbn: string;

  rating: number;
  rd: number;
};

export type Matchup = {
  bookA: Book;
  bookB: Book;
};

export type BookData = { [bookId: BookId]: Book };

export const wasmInstance = {
  addBooksFromCSV(csvText: string): void {
    window.addBooksFromCSV(csvText);
  },
  getMatchup(): Matchup {
    return JSON.parse(window.getMatchup());
  },
  getRankingData(): BookData {
    return JSON.parse(window.getRankingData());
  },
  putRankingData(jsonData: string): void {
    window.putRankingData(jsonData);
  },
  storeMatchupResult(bookA: BookId, bookB: BookId, result: number): void {
    window.storeMatchupResult(bookA, bookB, result);
  },
  removeBook(bookId: BookId): void {
    window.removeBook(bookId);
  },
};
