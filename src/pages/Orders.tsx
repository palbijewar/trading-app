import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";

const TABS = ["Open", "Executed", "Rejected"] as const;

export default function Orders() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Executed");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Orders</h1>
        <div className="mt-6 grid grid-cols-3 text-center text-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={(tab === t ? "text-sky-400" : "text-gray-400 hover:text-gray-200") + " pb-2"}
            >
              {t}
              <div className={(tab === t ? "bg-sky-500" : "bg-transparent") + " h-1 mt-2 rounded"} />
            </button>
          ))}
        </div>
      </div>

      {tab === "Open" && (
        <Card className="bg-[#0f162e] border-[#1e2a4a]">
          <CardContent className="py-16">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-6 size-36 rounded-xl bg-[#0b1020] border border-[#243050]" />
              <h3 className="text-xl font-semibold mb-2">No Pending Orders</h3>
              <p className="text-gray-400">Place an order from watchlist</p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "Executed" && (
        <div className="space-y-6">
          <ExecutedRow side="BUY" qty={100} name="GOLD" expiry="05 DEC" time="5:32:58 PM" price={120708} />
          <ExecutedRow side="BUY" qty={900} name="CRUDEOIL" expiry="20 OCT" time="5:16:36 PM" price={5482} />
          <ExecutedRow side="BUY" qty={100} name="CRUDEOIL" expiry="20 OCT" time="5:16:21 PM" price={5483} />
        </div>
      )}

      {tab === "Rejected" && (
        <div className="space-y-6">
          <RejectedRow side="SELL" qty={35} name="BANKNIFTY" expiry="28 OCT 54000 CE" time="5:38:41 PM" price={2510} reason="NSE Market is Closed" />
          <RejectedRow side="SELL" qty={35} name="BANKNIFTY" expiry="28 OCT" time="5:32:29 PM" price={56460} reason="NSE Market is Closed" />
          <RejectedRow side="SELL" qty={750} name="NIFTY" expiry="07 OCT 25200 PE" time="4:00:37 PM" price={91.5} reason="NSE Market is Closed" />
        </div>
      )}
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={"text-xs rounded-md px-2 py-1 bg-[#0b1020] border border-[#243050] " + className}>{children}</span>
  );
}

function ExecutedRow({ side, qty, name, expiry, time, price }: { side: "BUY" | "SELL"; qty: number; name: string; expiry: string; time: string; price: number }) {
  return (
    <div className="border-b border-[#1e2a4a] pb-5">
      <div className="flex items-center gap-2 mb-2 text-xs">
        <Badge className={side === "BUY" ? "bg-sky-600" : "bg-rose-600"}>{side}</Badge>
        <Badge>Qty : {qty}</Badge>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{expiry}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">{time}</div>
          <div className="mt-1 inline-flex items-center gap-2">
            <Badge className="bg-emerald-700/40 text-emerald-300 border-transparent">EXECUTED</Badge>
          </div>
          <div className="text-lg font-semibold">{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400">NRML</div>
        </div>
      </div>
    </div>
  );
}

function RejectedRow({ side, qty, name, expiry, time, price, reason }: { side: "BUY" | "SELL"; qty: number; name: string; expiry: string; time: string; price: number; reason: string }) {
  return (
    <div className="border-b border-[#1e2a4a] pb-5">
      <div className="flex items-center gap-2 mb-2 text-xs">
        <Badge className={side === "BUY" ? "bg-sky-600" : "bg-rose-600"}>{side}</Badge>
        <Badge>Qty : {qty}</Badge>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{expiry}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">{time}</div>
          <div className="mt-1 inline-flex items-center gap-2">
            <Badge className="bg-rose-800/40 text-rose-300 border-transparent">REJECTED</Badge>
          </div>
          <div className="text-lg font-semibold">{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400">{reason}</div>
        </div>
      </div>
    </div>
  );
}


