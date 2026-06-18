import { Navigate } from "react-router-dom";
import { wasmInstance } from "./types/wasm";

export default function RequireSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionStr = localStorage.getItem("session");

  if (sessionStr == null) {
    return <Navigate to="/" replace />;
  } else {
    // Load state into WASM
    wasmInstance.putRankingData(sessionStr);
  }

  return children;
}
