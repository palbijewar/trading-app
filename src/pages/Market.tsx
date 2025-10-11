import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowDownRight, ArrowUpRight, Plus, Search, RefreshCw } from "lucide-react";

type Ticker = {
  symbol: string;
  expiry?: string;
  ltp: number;
  changeAbs: number;
  changePct: number;
};

type BinanceTicker = {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
};

type CryptoTicker = {
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
  const [watchlist, setWatchlist] = useState<Ticker[]>([
    { symbol: "BANKNIFTY", expiry: "28 OCT", ltp: 56472.4, changeAbs: 172.2, changePct: 0.31 },
    { symbol: "NIFTY", expiry: "28 OCT", ltp: 25230.3, changeAbs: 43.6, changePct: 0.17 },
    { symbol: "RVNL", expiry: "28 OCT", ltp: 353.95, changeAbs: 12.5, changePct: 3.66 },
  ]);
  const [cryptoData, setCryptoData] = useState<CryptoTicker[]>([]);
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCryptoData = useCallback(async () => {
    setIsLoadingCrypto(true);
    try {
      const promises = CRYPTO_SYMBOLS.map(async (symbol) => {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: BinanceTicker = await response.json();
        return {
          symbol: symbol.replace('USDT', '/USDT'),
          ltp: parseFloat(data.lastPrice),
          changeAbs: parseFloat(data.priceChange),
          changePct: parseFloat(data.priceChangePercent),
          lastUpdate: Date.now(),
        } as CryptoTicker;
      });

      const results = await Promise.all(promises);
      setCryptoData(prevData => results.map(newData => {
        const prevDataItem = prevData.find(item => item.symbol === newData.symbol);
        return {
          ...newData,
          prevLtp: prevDataItem?.ltp || newData.ltp,
        };
      }));
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setIsLoadingCrypto(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchCryptoData, 10000);
  }, [fetchCryptoData]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    ws.onopen = () => console.log('WebSocket connected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setCryptoData(prevData => prevData.map(crypto => {
          const symbol = crypto.symbol.replace('/', '');
          const tickerData = data.find((item: { s: string; c: string; P: string }) => item.s === symbol);
          if (tickerData) {
            const newPrice = parseFloat(tickerData.c);
            const priceChange = parseFloat(tickerData.p);
            const priceChangePercent = parseFloat(tickerData.P);
            return {
              ...crypto,
              ltp: newPrice,
              changeAbs: priceChange,
              changePct: priceChangePercent,
              prevLtp: crypto.ltp,
              lastUpdate: Date.now(),
            };
          }
          return crypto;
        }));
        setLastRefresh(new Date());
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, retrying...');
      startPolling();
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      startPolling();
    };

    wsRef.current = ws;
  }, [startPolling]);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'CRYPTO') {
      fetchCryptoData();
      connectWebSocket(); // Always live
    } else {
      disconnectWebSocket();
      stopPolling();
    }

    return () => {
      disconnectWebSocket();
      stopPolling();
    };
  }, [activeTab, fetchCryptoData, connectWebSocket, disconnectWebSocket, stopPolling]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (activeTab === 'CRYPTO') {
      return q ? cryptoData.filter(t => t.symbol.toLowerCase().includes(q)) : cryptoData;
    }
    return q ? watchlist.filter(t => t.symbol.toLowerCase().includes(q)) : watchlist;
  }, [query, watchlist, cryptoData, activeTab]);

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
              {activeTab === 'CRYPTO' && (
                <>
                  {/* 🔴 Always Live Indicator */}
                  <div className="flex items-center gap-2 bg-green-600/10 border border-green-700 text-green-400 px-3 py-1 rounded-md text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>Live</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchCryptoData}
                    disabled={isLoadingCrypto}
                    className="border-gray-600 text-gray-400 hover:bg-gray-600/10"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingCrypto ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>

                  {lastRefresh && (
                    <div className="text-xs text-gray-500 hidden sm:block">
                      Last: {lastRefresh.toLocaleTimeString()}
                    </div>
                  )}
                </>
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
          {isLoadingCrypto && activeTab === 'CRYPTO' ? (
            <div className="p-8 text-center text-gray-400">Loading crypto data...</div>
          ) : (
            filtered.map((t) => <TickerRow key={t.symbol} ticker={t} />)
          )}
          {filtered.length === 0 && !isLoadingCrypto && <div className="p-8 text-center text-gray-400">No symbols found.</div>}
        </div>
      </div>
    </div>
  );
}

function TickerRow({ ticker }: { ticker: Ticker | CryptoTicker }) {
  const isUp = ticker.changeAbs >= 0;
  const Icon = isUp ? ArrowUpRight : ArrowDownRight;
  const isCrypto = !('expiry' in ticker);
  const [isPriceUpdating, setIsPriceUpdating] = useState(false);

  const hasRecentUpdate = isCrypto && 'lastUpdate' in ticker && ticker.lastUpdate && (Date.now() - ticker.lastUpdate) < 3000;
  const hasPriceChanged = isCrypto && 'prevLtp' in ticker && ticker.prevLtp && Math.abs(ticker.ltp - ticker.prevLtp) > 0;

  useEffect(() => {
    if (hasPriceChanged && hasRecentUpdate) {
      setIsPriceUpdating(true);
      const timer = setTimeout(() => setIsPriceUpdating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasPriceChanged, hasRecentUpdate]);

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 items-center p-4 sm:p-5 hover:bg-white/5 transition-all duration-200 ${
      isPriceUpdating ? 'bg-green-500/5 border-l-2 border-green-500' : ''
    }`}>
      <div className="col-span-1">
        <div className="text-sm text-gray-400">Qty: 0</div>
        <div className="text-lg sm:text-xl font-semibold tracking-wide flex items-center gap-2">
          {ticker.symbol}
          {isCrypto && hasRecentUpdate && (
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        {!isCrypto && 'expiry' in ticker && ticker.expiry && <div className="text-xs text-gray-500">{ticker.expiry}</div>}
        {isCrypto && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            Crypto
            {'lastUpdate' in ticker && ticker.lastUpdate && (
              <span className="text-gray-600">
                • {Math.round((Date.now() - ticker.lastUpdate) / 1000)}s ago
              </span>
            )}
          </div>
        )}
      </div>

      <div className="col-span-1 sm:col-span-2 justify-self-end text-right">
        <div className="text-xs text-gray-400">LTP</div>
        <div className={`text-xl font-semibold tabular-nums transition-colors duration-300 ${isPriceUpdating ? 'text-green-400' : ''}`}>
          {isCrypto 
            ? `$${ticker.ltp.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            : ticker.ltp.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          {isPriceUpdating && <span className="ml-1 text-green-400 animate-pulse">●</span>}
        </div>
      </div>

      <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-3">
        <span className={(isUp ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300") + " inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"}>
          <Icon className="h-4 w-4" />
          <span className="tabular-nums">
            {isCrypto 
              ? `$${Math.abs(ticker.changeAbs).toFixed(2)} (${Math.abs(ticker.changePct).toFixed(2)}%)`
              : `${Math.abs(ticker.changeAbs).toFixed(2)} (${Math.abs(ticker.changePct).toFixed(2)}%)`}
          </span>
        </span>
      </div>

      <div className="col-span-1 sm:col-span-1 justify-self-end">
        <Button size="sm" className="bg-sky-600 hover:bg-sky-700">Trade</Button>
      </div>
    </div>
  );
}
