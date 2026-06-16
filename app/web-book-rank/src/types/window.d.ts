import type { Book, Matchup } from "./wasm";

export { };

declare global {
  interface Window {
    Go: new () => {
      importObject: WebAssembly.Imports;
      run: (instance: WebAssembly.Instance) => void;
    };
    addBooksFromCSV(csvText: string): void;
    getMatchup: () => string;
    getRankingData(): string;
    putRankingData(jsonData: string): void;
    storeMatchupResult(bookA: BookId, bookB: BookId, result: number): void;
    removeBook(bookId: BookId): void;
  }
}
