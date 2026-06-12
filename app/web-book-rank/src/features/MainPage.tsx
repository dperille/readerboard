import { useState } from "react";

export default function MainPage() {
  const [bookA, setBookA] = useState<any>();
  const [bookB, setBookB] = useState<any>();

  const handleLibraryUpload = async (file: File) => {
    if (!file) return;

    const text = await file.text();
    console.log(text);

    const result = window.jsAddBooksFromCSV(text);
  };

  const getMatchup = () => {
    const result = window.jsGetMatchup();
    const data = JSON.parse(result);

    console.log(data);
    setBookA(data.BookA.Title);
    setBookB(data.BookB.Title);
  }

  return (
    <div>
      <button onClick={getMatchup}>Get matchup</button>
      <p>{bookA} vs {bookB}</p>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleLibraryUpload(e.target.files?.[0])}
      />
    </div>
  );
}
