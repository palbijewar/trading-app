import { useMemo, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowDownRight, ArrowUpRight, Plus, Search } from "lucide-react";

type Ticker = {
  symbol: string;
  expiry?: string;
  ltp: number;
  changeAbs: number;
  changePct: number;
};

const DEFAULT_TABS = [
  "NSEFUT",
  "NSEOPT",
  "MCXFUT",
  "MCXOPT",
  "BSE-FUT",
  "BSE-OPT",
  "CRYPTO",
  "FOREX",
  "COMEX",
  "GLOBALINDEX",
] as const;

export default function Market() {
  const [activeTab, setActiveTab] = useState<(typeof DEFAULT_TABS)[number]>(DEFAULT_TABS[0]);
  const [query, setQuery] = useState("");
  const [watchlist, setWatchlist] = useState<Ticker[]>([
    { symbol: "BANKNIFTY", expiry: "28 OCT", ltp: 56472.4, changeAbs: 172.2, changePct: 0.31 },
    { symbol: "NIFTY", expiry: "28 OCT", ltp: 25230.3, changeAbs: 43.6, changePct: 0.17 },
    { symbol: "RVNL", expiry: "28 OCT", ltp: 353.95, changeAbs: 12.5, changePct: 3.66 },
  ]);

  const filtered = useMemo(() => {
    if (!query) return watchlist;
    const q = query.trim().toLowerCase();
    return watchlist.filter((t) => t.symbol.toLowerCase().includes(q));
  }, [query, watchlist]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col gap-4">
      <Card className="bg-[#0f162e] border-[#1e2a4a]">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <nav className="flex gap-4 overflow-x-auto text-sm scrollbar-none">
              {DEFAULT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    "px-2 pb-1 border-b-2 transition-colors whitespace-nowrap " +
                    (activeTab === tab ? "text-sky-400 border-sky-500" : "text-gray-400 border-transparent hover:text-gray-200")
                  }
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="flex-1 min-w-[260px]" />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:min-w-[320px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Symbols"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 bg-[#0b1020] border-[#243050]"
                />
              </div>
              <Button
                className="bg-sky-600 hover:bg-sky-700"
                onClick={() => {
                  if (!query.trim()) return;
                  const sym = query.trim().toUpperCase();
                  setWatchlist((w) => [
                    { symbol: sym, ltp: 100, changeAbs: 0, changePct: 0 },
                    ...w,
                  ]);
                  setQuery("");
                }}
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1">
        <div className="divide-y divide-[#1e2a4a] rounded-xl overflow-hidden border border-[#1e2a4a] bg-[#0f162e]">
          {filtered.map((t) => (
            <TickerRow key={t.symbol} ticker={t} />
          ))}
          {filtered.length === 0 && <div className="p-8 text-center text-gray-400">No symbols found.</div>}
        </div>
      </div>
    </div>
  );
}

function TickerRow({ ticker }: { ticker: Ticker }) {
  const isUp = ticker.changeAbs >= 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 items-center p-4 sm:p-5 hover:bg-white/5">
      <div className="col-span-1">
        <div className="text-sm text-gray-400">Qty: 0</div>
        <div className="text-lg sm:text-xl font-semibold tracking-wide">{ticker.symbol}</div>
        {ticker.expiry && <div className="text-xs text-gray-500">{ticker.expiry}</div>}
      </div>
      <div className="col-span-1 sm:col-span-2 justify-self-end text-right">
        <div className="text-xs text-gray-400">LTP</div>
        <div className="text-xl font-semibold tabular-nums">{ticker.ltp.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
      </div>
      <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-3">
        <span className={(isUp ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300") + " inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"}>
          <Icon className="h-4 w-4" />
          <span className="tabular-nums">{Math.abs(ticker.changeAbs).toFixed(2)} ({Math.abs(ticker.changePct).toFixed(2)}%)</span>
        </span>
      </div>
      <div className="col-span-1 sm:col-span-1 justify-self-end">
        <Button size="sm" className="bg-sky-600 hover:bg-sky-700">Trade</Button>
      </div>
    </div>
  );
}


