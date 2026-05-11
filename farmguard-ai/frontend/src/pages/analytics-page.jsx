import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../components/ui/card";
import { priceData, trendData } from "./data";
import { getAnalytics } from "../lib/api";

export function AnalyticsPage() {
  const [lineData, setLineData] = useState(trendData);
  const [barData, setBarData] = useState(priceData);
  const [sources, setSources] = useState([]);
  const [refreshedAt, setRefreshedAt] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await getAnalytics();
        const disease = response.disease_trends || [];
        const alerts = response.alert_statistics || [];
        setLineData(
          disease.map((item, index) => ({
            name: item.name,
            disease: item.value,
            alerts: alerts[index]?.value || 0,
          }))
        );
        setBarData((response.price_trends || []).map((item) => ({ name: item.name, value: item.value })));
        setSources(response.sources || []);
        setRefreshedAt(response.refreshed_at || "");
      } catch {
        setLineData(trendData);
        setBarData(priceData);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <div className="font-['Fraunces'] text-3xl text-brand-950">Analytics Dashboard</div>
        <p className="mt-2 text-brand-700">
          These charts are built from disease reports, weather responses, mandi prices, farmer activity, and notification events.
        </p>
        {refreshedAt ? <div className="mt-3 text-sm text-brand-700">Last refreshed: {new Date(refreshedAt).toLocaleString()}</div> : null}
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="font-['Fraunces'] text-2xl text-brand-950">Disease & alert trends</div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e7d1" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="disease" stroke="#4d8f3f" strokeWidth={3} />
                <Line type="monotone" dataKey="alerts" stroke="#8c6239" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="font-['Fraunces'] text-2xl text-brand-950">Crop price trends</div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e7d1" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4d8f3f" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {sources.map((source) => (
          <Card key={source.name}>
            <div className="font-semibold text-brand-950">{source.name}</div>
            <p className="mt-2 text-brand-800">{source.description}</p>
            <div className="mt-3 text-sm text-brand-700">Freshness: {source.freshness}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
