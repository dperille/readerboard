import { useEffect, useState } from "react";
import "./App.css";
import MainPage from "./features/MainPage";

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

  return <MainPage />;
}

export default App;
