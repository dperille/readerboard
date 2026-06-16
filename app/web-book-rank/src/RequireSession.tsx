import { Navigate } from "react-router-dom";

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
    window.jsPutRankingData(sessionStr);
  }

  return children;
}
