import { useEffect, useState } from "react";
import "./App.css";
import MainPage from "@/features/voting/MainPage";
import StartPage from "@/features/landing/StartPage";
import { Route, Routes } from "react-router-dom";
import RequireSession from "@/app/RequireSession";

function App() {
  const [loadedWasm, setLoadedWasm] = useState(false);

  useEffect(() => {
    async function loadWasm(): Promise<void> {
      const goWasm = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        // /public/add.wasm -- copied from "go build" in server
        fetch("main.wasm"),
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
      <Route
        path="/rank"
        element={
          <RequireSession>
            <MainPage />
          </RequireSession>
        }
      />
    </Routes>
  );
}

export default App;
