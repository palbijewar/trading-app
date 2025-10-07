import { Card, CardContent } from "../components/ui/card";

export default function Position() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1">
      <header className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm mb-8">
        <Metric label="Margin Used" value="₹200320" />
        <Metric label="M2M" value="₹845520081" />
      </header>

      <div className="mb-4 grid grid-cols-3 text-center text-sm">
        {[
          { key: "Closed" },
          { key: "Position", active: true },
          { key: "Active" },
        ].map((t) => (
          <div key={t.key} className={(t.active ? "text-sky-400" : "text-gray-400") + " pb-2"}>
            {t.key}
            <div className={(t.active ? "bg-sky-500" : "bg-transparent") + " h-1 mt-2 rounded"} />
          </div>
        ))}
      </div>

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


