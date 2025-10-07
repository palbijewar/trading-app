export type Section = "MarketWatch" | "Orders" | "Position" | "Funds" | "Settings" | "Profile";

export default function DashboardNav({ active }: { active: Section }) {
  const items: { label: string; key: Section; hideOnMobile?: boolean }[] = [
    { label: "Market", key: "MarketWatch" },
    { label: "Orders", key: "Orders" },
    { label: "Position", key: "Position" },
    { label: "Funds", key: "Funds" },
    { label: "Settings", key: "Settings", hideOnMobile: true },
    { label: "Profile", key: "Profile", hideOnMobile: true },
  ];
  return (
    <div className="sticky bottom-0 inset-x-0 bg-[#0f162e]/80 backdrop-blur border-t border-[#1e2a4a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 py-3 text-center text-xs">
          {items.map((i) => (
            <a
              key={i.key}
              href={`#/${i.key}`}
              className={(i.hideOnMobile ? "hidden sm:block " : "") +
                (active === i.key ? "text-sky-400" : "text-gray-300 hover:text-gray-100")}
            >
              {i.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}


