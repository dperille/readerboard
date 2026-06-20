import type { Book } from "@/types/wasm";

export default function BookCover({ book }: { book: Book }) {
  // Default cover
  if (book.isbn.length == 0) {
    return (
      <div className="min-h-0 relative bg-[#f4ecd8] border border-[#d6c7a6] shadow-lg overflow-hidden font-mono text-[#2b2b2b]">
        {/* Paper texture */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_1px,transparent_1px,transparent_6px)]" />

        <div className="relative p-3 flex flex-col justify-between">
          <div className="text-[10px] tracking-[0.2em] opacity-70">
            LIBRARY PROPERTY
          </div>

          <div className="text-center text-sm font-bold leading-snug mt-6">
            {book.title}
          </div>

          <div className="text-center text-xs opacity-80 space-y-1">
            {book.author}
          </div>

          {/* stamp */}
          <div className="absolute top-3 right-3 -rotate-12 border border-red-700 text-red-700 text-[9px] px-2 py-0.5 opacity-80">
            ARCHIVE COPY
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;

  return (
    <>
      {/* Blur background */}
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={coverUrl}
          className="
          w-[150%]
          h-[150%]
          blur-xl
          opacity-30
        "
          aria-hidden
        />
      </div>

      <div className="relative w-28 md:w-full md:flex-1 min-h-24 shrink-0">
        <img src={coverUrl} className="absolute w-full h-full object-contain" />
      </div>
    </>
  );
}
