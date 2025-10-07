import Market from "./pages/Market";
import Orders from "./pages/Orders";
import Position from "./pages/Position";
import Settings from "./pages/Settings";
import DashboardNav, { type Section } from "./components/DashboardNav";
import { useEffect, useMemo, useState } from "react";
import BearBullsLanding from "./pages/BearBullsLanding";

function App() {
  const [hash, setHash] = useState<string>(() => window.location.hash || "#/");

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const route = useMemo<Section | "landing">(() => {
    const raw = hash.replace(/^#\//, "");
    if (raw === "" || raw === "/") return "landing";
    const allowed: Section[] = ["MarketWatch", "Orders", "Position", "Settings"];
    return (allowed.includes(raw as Section) ? (raw as Section) : "MarketWatch");
  }, [hash]);

  return (
    <div className="min-h-screen bg-[#0b1020] text-white flex flex-col">
      {route === "landing" ? (
        <BearBullsLanding />
      ) : (
        <>
          <Header />
          {route === "MarketWatch" && <Market />}
          {route === "Orders" && <Orders />}
          {route === "Position" && <Position />}
          {route === "Settings" && <Settings />}
          <DashboardNav active={route as Section} />
        </>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#0f162e]/70 backdrop-blur border-b border-[#1e2a4a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">MarketWatch</h1>
          <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Trade smart, stay happy. May your trades be profitable.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
