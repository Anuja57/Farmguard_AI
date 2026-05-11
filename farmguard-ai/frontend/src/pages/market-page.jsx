import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card } from "../components/ui/card";
import { priceData } from "./data";
import { getMarketPrices } from "../lib/api";

export function MarketPage() {
  const [crop, setCrop] = useState("tomato");
  const [items, setItems] = useState(priceData);
  const [summary, setSummary] = useState("Crop-wise mandi insights with trend signals and nearby market comparisons.");

  useEffect(() => {
    async function load() {
      try {
        const response = await getMarketPrices(crop);
        setItems(response.prices.map((item) => ({ name: item.market, value: item.price })));
        setSummary(response.summary);
      } catch {
        setItems(priceData);
      }
    }
    load();
  }, [crop]);

  return (
    <div className="space-y-6">
      <Card>
        <div className="font-['Fraunces'] text-3xl text-brand-950">Market Price Dashboard</div>
        <p className="mt-2 text-brand-700">{summary}</p>
        <div className="mt-4 flex gap-3">
          {["tomato", "wheat", "onion"].map((item) => (
            <button
              key={item}
              className={`rounded-full px-4 py-2 text-sm ${crop === item ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-800"}`}
              onClick={() => setCrop(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.name}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-brand-950">{item.name}</div>
              <ArrowUpRight className="h-5 w-5 text-brand-600" />
            </div>
            <div className="mt-4 text-3xl font-semibold text-brand-900">Rs {item.value}</div>
            <div className="mt-2 text-sm text-brand-700">Best nearby mandi rate</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
