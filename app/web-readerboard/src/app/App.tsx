import { useEffect, useState } from "react";
import "./App.css";
import MainPage from "@/features/voting/MainPage";
import StartPage from "@/features/landing/StartPage";
import { Route, Routes } from "react-router-dom";
import RequireSession from "@/app/RequireSession";
import { LoaderCircle, Radius } from "lucide-react";

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
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="bg-card rounded-2xl border p-4 shadow-sm">
          <Radius className="text-primary h-16 w-16 animate-spin" />
        </div>

        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold">Getting things ready</h2>
        </div>
      </div>
    );
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
