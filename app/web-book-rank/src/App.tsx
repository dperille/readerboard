import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("");

  useEffect(() => {
    async function loadWasm(): Promise<void> {
      const goWasm = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        // /public/add.wasm -- copied from "go build" in server
        fetch('add.wasm'),
        goWasm.importObject
      );

      goWasm.run(result.instance);
    }

    loadWasm();
  }, []);

  const handleAdd = () => {
    const value = window.jsAdd(10, 20);
    console.log(value);
    setResult(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={handleAdd}>Add 10 + 20</button>

      <p>Result: {result}</p>
    </div>
  );
}

export default App;
