import { useEffect, useState } from "react";
import { CloudRain, Droplets, ThermometerSun, Wind } from "lucide-react";
import { Card } from "../components/ui/card";
import { getWeather } from "../lib/api";
import { useAuth } from "../context/auth-context";

export function WeatherPage() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [region, setRegion] = useState(user?.location || "Pune");

  useEffect(() => {
    async function load() {
      try {
        setWeather(await getWeather(region));
      } catch {
        setWeather(null);
      }
    }
    load();
  }, [region]);

  const items = [
    { icon: ThermometerSun, label: "Temperature", value: `${weather?.temperature ?? 28.5} deg C` },
    { icon: Droplets, label: "Humidity", value: `${weather?.humidity ?? 76}%` },
    { icon: CloudRain, label: "Rainfall", value: `${weather?.rainfall_probability ?? 68}%` },
    { icon: Wind, label: "Condition", value: weather?.condition ?? "Cloudy" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brand-900 to-brand-700 text-white">
        <div className="text-sm uppercase tracking-[0.2em] text-brand-100">Weather Intelligence</div>
        <div className="mt-3 font-['Fraunces'] text-4xl">{weather?.location || region}</div>
        <p className="mt-2 text-brand-100">
          {weather?.recommendations?.[0] || "Rain risk is elevated. Delay irrigation and avoid immediate spray application."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {["Phaltan", "Satara", "Pune"].map((item) => (
            <button
              key={item}
              className={`rounded-full px-4 py-2 text-sm ${region === item ? "bg-white text-brand-900" : "bg-white/15 text-white"}`}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.label}>
            <item.icon className="h-10 w-10 rounded-2xl bg-brand-50 p-2 text-brand-600" />
            <div className="mt-4 text-sm text-brand-700">{item.label}</div>
            <div className="mt-2 text-3xl font-semibold text-brand-950">{item.value}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {(weather?.forecast || []).map((slot) => (
          <Card key={slot.label}>
            <div className="text-sm text-brand-700">{slot.label}</div>
            <div className="mt-2 text-2xl font-semibold text-brand-950">{slot.temperature} deg C</div>
            <div className="mt-2 text-sm text-brand-800">{slot.condition}</div>
            <div className="mt-1 text-sm text-brand-700">Rain probability: {slot.rainfall_probability}%</div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="font-semibold text-brand-950">Advisory basis</div>
        <p className="mt-2 text-brand-800">
          {weather?.advisory_basis || "Live weather source information will appear here when connected."}
        </p>
      </Card>
    </div>
  );
}
