import { Card, CardContent } from "../components/ui/card";

export default function Funds() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1">
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-[#0b1020] border-[#1e2a4a]"><CardContent className="py-5"><div className="text-xs text-gray-400">Available</div><div className="text-2xl font-semibold">₹0.00</div></CardContent></Card>
        <Card className="bg-[#0b1020] border-[#1e2a4a]"><CardContent className="py-5"><div className="text-xs text-gray-400">Used</div><div className="text-2xl font-semibold">₹0.00</div></CardContent></Card>
        <Card className="bg-[#0b1020] border-[#1e2a4a]"><CardContent className="py-5"><div className="text-xs text-gray-400">P&L</div><div className="text-2xl font-semibold">₹0.00</div></CardContent></Card>
      </div>
    </div>
  );
}


