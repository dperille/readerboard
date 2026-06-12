import { useState } from "react";

export default function MainPage() {
  const [status, setStatus] = useState("");

  const handleLibraryUpload = async (file: File) => {
    if (!file) return;

    const text = await file.text();
    console.log(text);

    const result = window.jsParseCSV(text);
    setStatus(`Read: ${result}`);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleLibraryUpload(e.target.files?.[0])}
      />
      <p>{status}</p>
    </div>
  );
}
