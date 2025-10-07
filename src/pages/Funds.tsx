import { Card, CardContent } from "../components/ui/card";

export default function Funds() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1">
      <h1 className="text-3xl font-semibold mb-6">Funds</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat title="Ledger Balance" value="₹845369619" />
        <Stat title="Margin Available" value="₹845560161" />
        <Stat title="Margin Used" value="₹210320" />
        <Stat title="M2M" value="₹845770481" />
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <Card className="bg-[#0b1020] border-[#1e2a4a]">
      <CardContent className="py-5">
        <div className="text-gray-400 text-sm">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}


