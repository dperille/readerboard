import { useEffect, useState } from "react";
import "./App.css";
import MainPage from "./features/MainPage";
import StartPage from "./features/StartPage";
import { Route, Routes } from "react-router-dom";

function App() {
  const [loadedWasm, setLoadedWasm] = useState(false);

  useEffect(() => {
    async function loadWasm(): Promise<void> {
      const goWasm = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        // /public/add.wasm -- copied from "go build" in server
        fetch("add.wasm"),
        goWasm.importObject,
      );

      goWasm.run(result.instance);
      setLoadedWasm(true);
    }

    loadWasm();
  }, []);

  if (!loadedWasm) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/rank" element={<MainPage />} />
    </Routes>
  );
  return <StartPage />;
}

export default App;
