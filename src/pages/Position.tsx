import { Card, CardContent } from "../components/ui/card";

export default function Position() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1">
      <Card className="bg-[#0f162e] border-[#1e2a4a]">
        <CardContent className="py-6">
          <h2 className="text-lg font-semibold mb-2">Open Positions</h2>
          <div className="text-sm text-gray-400">No open positions.</div>
        </CardContent>
      </Card>
    </div>
  );
}


