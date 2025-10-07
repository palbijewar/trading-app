import { Card, CardContent } from "../components/ui/card";
import { useState } from "react";

export default function Position() {
  const [tab, setTab] = useState<"Closed" | "Position" | "Active">("Position");
  const TABS = ["Closed", "Position", "Active"] as const;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1">
      <header className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm mb-8">
        <Metric label="Margin Used" value="₹200320" />
        <Metric label="M2M" value="₹845520081" />
      </header>

      <div className="mb-4 grid grid-cols-3 text-center text-sm">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={(tab === t ? "text-sky-400" : "text-gray-400") + " pb-2"}
          >
            {t}
            <div className={(tab === t ? "bg-sky-500" : "bg-transparent") + " h-1 mt-2 rounded"} />
          </button>
        ))}
      </div>

      {tab === "Position" && (
        <>
          <Card className="bg-[#0f162e] border-[#1e2a4a] mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">Total P&L</div>
                <div className="font-semibold text-emerald-400 text-xl">150462.50</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <PositionItem name="CRUDEOIL" expiry="20 OCT" qty={1000} side="BUY" pnl={2900} />
            <PositionItem name="SILVER" expiry="05 DEC" qty={-900} side="SELL" pnl={-69300} />
          </div>
        </>
      )}

      {tab === "Active" && (
        <>
          <Card className="bg-[#0f162e] border-[#1e2a4a] mb-4">
            <CardContent className="py-4">
              <div className="text-center">
                <div className="text-gray-300">Total Holding Margin</div>
                <div className="text-2xl font-semibold">1405320</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <ActiveRow
              name="GOLD"
              expiry="05 DEC"
              qty={100}
              side="BUY"
              time="05:32:58 PM"
              price={120708}
              bkg={500}
              marginUsed={10000}
            />
            <ActiveRow
              name="CRUDEOIL"
              expiry="20 OCT"
              qty={900}
              side="BUY"
              time="05:16:36 PM"
              price={5482}
              bkg={493.38}
              marginUsed={9000}
            />
          </div>
        </>
      )}

      {tab === "Closed" && (
        <div className="space-y-6">
          <ClosedRow
            name="NIFTY"
            expiry="07 OCT 25200 PE"
            qty={3750}
            side="BUY"
            priceA={2125}
            priceB={2000}
            priceFrom={64.9}
            priceTo={66}
            timeFrom="02:39:04 PM"
            timeTo="02:40:16 PM"
          />
          <ClosedRow
            name="NIFTY"
            expiry="07 OCT 25200 PE"
            qty={750}
            side="BUY"
            priceA={3350}
            priceB={400}
            priceFrom={40}
            priceTo={45}
            timeFrom="02:29:32 PM"
            timeTo="02:35:00 PM"
          />
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-400">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function PositionItem({ name, expiry, qty, side, pnl }: { name: string; expiry: string; qty: number; side: "BUY" | "SELL"; pnl: number }) {
  const sideColor = side === "BUY" ? "bg-sky-600" : "bg-rose-600";
  const pnlColor = pnl >= 0 ? "text-emerald-400" : "text-rose-400";
  return (
    <Card className="bg-[#0f162e] border-[#1e2a4a]">
      <CardContent className="py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">{name}</div>
            <div className="text-xs text-gray-500">{expiry}</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{qty}</Badge>
            <Badge>OPEN</Badge>
            <Badge className={sideColor}>{side}</Badge>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="text-gray-400">05:16:36 PM</div>
          <div className={"font-semibold " + pnlColor}>{pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={"text-xs rounded-md px-2 py-1 bg-[#0b1020] border border-[#243050] " + className}>{children}</span>
  );
}

function ActiveRow({ name, expiry, qty, side, time, price, bkg, marginUsed }: { name: string; expiry: string; qty: number; side: "BUY" | "SELL"; time: string; price: number; bkg: number; marginUsed: number }) {
  return (
    <div className="border-b border-[#1e2a4a] pb-6">
      <div className="flex items-center gap-2 mb-2">
        <Badge>{qty}</Badge>
        <Badge className={side === "BUY" ? "bg-sky-600" : "bg-rose-600"}>{side}</Badge>
        <Badge>{time}</Badge>
      </div>
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-xs text-gray-500 mb-2">{expiry}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge>OPEN</Badge>
          <Badge>NRML</Badge>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400">BKG : {bkg.toLocaleString()} </div>
          <div className="text-xs text-gray-400">Margin Used : {marginUsed.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function ClosedRow({ name, expiry, qty, side, priceA, priceB, priceFrom, priceTo, timeFrom, timeTo }: { name: string; expiry: string; qty: number; side: "BUY" | "SELL"; priceA: number; priceB: number; priceFrom: number; priceTo: number; timeFrom: string; timeTo: string }) {
  return (
    <div className="border-b border-[#1e2a4a] pb-6">
      <div className="flex items-center gap-2 mb-2">
        <Badge>{qty}</Badge>
        <Badge className={side === "BUY" ? "bg-sky-600" : "bg-rose-600"}>{side}</Badge>
      </div>
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-xs text-gray-500 mb-3">{expiry}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge>CLOSED</Badge>
          <Badge>NRML</Badge>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold">{priceA.toLocaleString(undefined, { maximumFractionDigits: 2 })}/{priceB.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400">{priceFrom.toFixed(2)} → {priceTo.toFixed(2)}</div>
          <div className="text-xs text-gray-400">{timeFrom} → {timeTo}</div>
        </div>
      </div>
    </div>
  );
}


