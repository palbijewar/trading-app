import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowDownRight, ArrowUpRight, Plus, Search, RefreshCw } from "lucide-react";

type MarketTicker = {
  symbol: string;
  ltp: number;
  changeAbs: number;
  changePct: number;
  prevLtp?: number;
  lastUpdate?: number;
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

const CRYPTO_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "DOTUSDT",
  "MATICUSDT",
  "AVAXUSDT"
];

export default function Market() {
  const [activeTab, setActiveTab] = useState<(typeof DEFAULT_TABS)[number]>(DEFAULT_TABS[0]);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<MarketTicker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Fetch Crypto Data ---
  const fetchCryptoData = useCallback(async () => {
    setIsLoading(true);
    try {
      const promises = CRYPTO_SYMBOLS.map(async (symbol) => {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const data = await response.json();
        return {
          symbol: symbol.replace("USDT", "/USDT"),
          ltp: parseFloat(data.lastPrice),
          changeAbs: parseFloat(data.priceChange),
          changePct: parseFloat(data.priceChangePercent),
          lastUpdate: Date.now(),
        } as MarketTicker;
      });
      const results = await Promise.all(promises);
      setData((prev) =>
        results.map((newData) => {
          const old = prev.find((i) => i.symbol === newData.symbol);
          return { ...newData, prevLtp: old?.ltp ?? newData.ltp };
        })
      );
      setLastRefresh(new Date());
    } catch (e) {
      console.error("Crypto fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Fetch Non-Crypto (Simulated Data) ---
  const fetchMockMarketData = useCallback(() => {
    setIsLoading(true);
    const mock = Array.from({ length: 10 }).map((_, i) => {
      const symbol = `${activeTab}-${i + 1}`;
      const base = Math.random() * 1000;
      const change = (Math.random() - 0.5) * 20;
      return {
        symbol,
        ltp: base + change,
        changeAbs: change,
        changePct: (change / base) * 100,
        lastUpdate: Date.now(),
      };
    });
    setData((prev) =>
      mock.map((newData) => {
        const old = prev.find((i) => i.symbol === newData.symbol);
        return { ...newData, prevLtp: old?.ltp ?? newData.ltp };
      })
    );
    setLastRefresh(new Date());
    setTimeout(() => setIsLoading(false), 400);
  }, [activeTab]);

  // --- Crypto Live WebSocket ---
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onopen = () => console.log("WebSocket connected");

    ws.onmessage = (event) => {
      const all = JSON.parse(event.data);
      setData((prev) =>
        prev.map((c) => {
          const s = c.symbol.replace("/", "");
          const d = all.find((i: any) => i.s === s);
          if (!d) return c;
          const newPrice = parseFloat(d.c);
          return {
            ...c,
            ltp: newPrice,
            changeAbs: parseFloat(d.p),
            changePct: parseFloat(d.P),
            prevLtp: c.ltp,
            lastUpdate: Date.now(),
          };
        })
      );
      setLastRefresh(new Date());
    };

    ws.onclose = () => {
      console.log("WS closed, retrying...");
      wsRef.current = null;
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close();
    };

    wsRef.current = ws;
  }, []);

  // --- Manage Tabs ---
  useEffect(() => {
    if (activeTab === "CRYPTO") {
      connectWebSocket();
      fetchCryptoData();
    } else {
      wsRef.current?.close();
      fetchMockMarketData();
      const intv = setInterval(fetchMockMarketData, 8000);
      intervalRef.current = intv;
    }

    return () => {
      wsRef.current?.close();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTab, connectWebSocket, fetchCryptoData, fetchMockMarketData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? data.filter((t) => t.symbol.toLowerCase().includes(q)) : data;
  }, [query, data]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col gap-4">
      {/* Header Section */}
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
                    (activeTab === tab
                      ? "text-sky-400 border-sky-500"
                      : "text-gray-400 border-transparent hover:text-gray-200")
                  }
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="flex-1 min-w-[260px]" />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (activeTab === "CRYPTO") fetchCryptoData();
                  else fetchMockMarketData();
                }}
                disabled={isLoading}
                className="border-gray-600 text-gray-400 hover:bg-gray-600/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              {lastRefresh && (
                <div className="text-xs text-gray-500 hidden sm:block">
                  Last: {lastRefresh.toLocaleTimeString()}
                </div>
              )}

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
                  setData((d) => [{ symbol: sym, ltp: 100, changeAbs: 0, changePct: 0 }, ...d]);
                  setQuery("");
                }}
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <div className="flex-1">
        <div className="divide-y divide-[#1e2a4a] rounded-xl overflow-hidden border border-[#1e2a4a] bg-[#0f162e]">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading {activeTab} data...</div>
          ) : (
            filtered.map((t) => <TickerRow key={t.symbol} ticker={t} />)
          )}
          {filtered.length === 0 && !isLoading && (
            <div className="p-8 text-center text-gray-400">No symbols found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TickerRow({ ticker }: { ticker: MarketTicker }) {
  const isUp = ticker.changeAbs >= 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (ticker.prevLtp && Math.abs(ticker.ltp - ticker.prevLtp) > 0) {
      setIsUpdating(true);
      const t = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(t);
    }
  }, [ticker.ltp]);

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 items-center p-4 sm:p-5 hover:bg-white/5 transition-all duration-200 ${
        isUpdating ? "bg-green-500/5 border-l-2 border-green-500" : ""
      }`}
    >
      <div>
        <div className="text-lg sm:text-xl font-semibold">{ticker.symbol}</div>
        <div className="text-xs text-gray-500">
          Updated {Math.round((Date.now() - (ticker.lastUpdate || Date.now())) / 1000)}s ago
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs text-gray-400">LTP</div>
        <div className={`text-xl font-semibold ${isUpdating ? "text-green-400" : ""}`}>
          {ticker.ltp.toFixed(2)}
        </div>
      </div>

      <div className="hidden sm:flex justify-end col-span-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isUp ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
          }`}
        >
          <Icon className="h-4 w-4" />
          {ticker.changeAbs.toFixed(2)} ({ticker.changePct.toFixed(2)}%)
        </span>
      </div>

      <div className="justify-self-end">
        <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
          Trade
        </Button>
      </div>
    </div>
  );
}
