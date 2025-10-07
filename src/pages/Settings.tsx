import { Card, CardContent } from "../components/ui/card";

export default function Settings() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      <Card className="bg-[#0f162e] border-[#1e2a4a] mb-4">
        <CardContent className="py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-gray-400">Userid</div>
              <div className="text-xl font-semibold">WNZ323</div>
            </div>
            <div>
              <div className="text-gray-400">Username</div>
              <div className="text-xl font-semibold">ID: +918735019673</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-[#1e2a4a] bg-[#0f162e] divide-y divide-[#1e2a4a]">
        {[
          "Ledger Logs",
          "Margin",
          "Change Password",
          "Scripts Setting",
          "Reports",
          "Logout",
        ].map((label) => (
          <button
            key={label}
            className="w-full text-left px-5 py-5 hover:bg-white/5 transition-colors"
          >
            <span className="text-base">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


