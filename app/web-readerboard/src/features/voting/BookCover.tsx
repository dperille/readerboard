import type { Book } from "@/types/wasm";

export default function BookCover({ book }: { book: Book }) {
  return (
    <div className="relative aspect-2/3 min-h-0 w-28 md:w-48 lg:w-78">
      {book.isbn.length > 0 ? (
        <CoverImage book={book} />
      ) : (
        <DefaultCover book={book} />
      )}
    </div>
  );
}

function DefaultCover({ book }: { book: Book }) {
  return (
    <div className="relative h-full w-full overflow-hidden border border-[#d6c7a6] bg-[#f4ecd8] font-mono text-[#2b2b2b] shadow-lg">
      {/* Paper texture */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_1px,transparent_1px,transparent_6px)]" />

      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="hidden text-[10px] tracking-[0.2em] opacity-70 md:flex">
          LIBRARY PROPERTY
        </div>

        <div className="mt-6 line-clamp-2 text-center text-sm leading-snug font-bold">
          {book.title}
        </div>

        <div className="line-clamp-2 space-y-1 text-center text-xs opacity-80">
          {book.author}
        </div>

        {/* stamp */}
        <div className="absolute top-3 right-3 hidden -rotate-12 border border-red-700 px-2 py-0.5 text-[9px] text-red-700 opacity-80 md:flex">
          ARCHIVE COPY
        </div>
      </div>
    </div>
  );
}

function CoverImage({ book }: { book: Book }) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
  return (
    <>
      {/* Blur background */}
      <img
        src={coverUrl}
        className="absolute h-full w-full scale-600 opacity-30 blur-xl"
        aria-hidden
      />

      <img src={coverUrl} className="absolute h-full w-full object-contain" />
    </>
  );
}
