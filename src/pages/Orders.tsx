import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";

const TABS = ["Open", "Executed", "Rejected"] as const;

export default function Orders() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Open");

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

      <Card className="bg-[#0f162e] border-[#1e2a4a]">
        <CardContent className="py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 size-36 rounded-xl bg-[#0b1020] border border-[#243050]" />
            <h3 className="text-xl font-semibold mb-2">No Pending Orders</h3>
            <p className="text-gray-400">Place an order from watchlist</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


