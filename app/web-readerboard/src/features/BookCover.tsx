import type { Book } from "@/types/wasm";

export default function BookCover({ book }: { book: Book }) {
  return (
    <div className="relative w-28 md:w-48 lg:w-78 aspect-2/3 min-h-0">
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
    <div className="h-full w-full relative bg-[#f4ecd8] border border-[#d6c7a6] shadow-lg overflow-hidden font-mono text-[#2b2b2b]">
      {/* Paper texture */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_1px,transparent_1px,transparent_6px)]" />

      <div className="relative h-full p-3 flex flex-col justify-between">
        <div className="hidden md:flex text-[10px] tracking-[0.2em] opacity-70">
          LIBRARY PROPERTY
        </div>

        <div className="text-center text-sm font-bold leading-snug mt-6 line-clamp-2">
          {book.title}
        </div>

        <div className="text-center text-xs opacity-80 space-y-1 line-clamp-2">
          {book.author}
        </div>

        {/* stamp */}
        <div className="hidden md:flex absolute top-3 right-3 -rotate-12 border border-red-700 text-red-700 text-[9px] px-2 py-0.5 opacity-80">
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
        className="
          absolute
          w-full
          h-full
          scale-600
          blur-xl
          opacity-30
        "
        aria-hidden
      />

      <img src={coverUrl} className="absolute w-full h-full object-contain" />
    </>
  );
}
