import { useEffect, useState } from "react";
import { CloudRain, Droplets, Leaf, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { notifications } from "./data";
import { getAnalytics, getNotifications, getWeather } from "../lib/api";
import { useAuth } from "../context/auth-context";

const iconMap = [Leaf, CloudRain, Droplets, TrendingUp];
const quickActions = [
  { label: "Scan crop image", to: "/disease" },
  { label: "Ask AI assistant", to: "/chat" },
  { label: "View mandi prices", to: "/market" },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [items, setItems] = useState(notifications);
  const [metrics, setMetrics] = useState([
    { label: "Disease Reports", value: "0", delta: "Awaiting live data" },
    { label: "Weather Alerts", value: "0", delta: "Awaiting live data" },
    { label: "Farmer Activity", value: "0", delta: "Awaiting live data" },
    { label: "Best Mandi Rate", value: "Live", delta: "Connect live market feed" },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [weatherData, notificationData, analyticsData] = await Promise.all([
          getWeather(user?.location || "Pune"),
          getNotifications(),
          getAnalytics(),
        ]);
        setWeather(weatherData);
        setItems(
          notificationData.map((item) => ({
            title: item.title,
            message: item.message,
            status: item.status,
          }))
        );
        setMetrics([
          { label: "Disease Reports", value: `${analyticsData.disease_trends.reduce((sum, item) => sum + item.value, 0)}`, delta: "Total scan trend points" },
          { label: "Weather Alerts", value: `${analyticsData.alert_statistics.find((item) => item.name === "Weather")?.value ?? 0}`, delta: "Active alert count" },
          { label: "Farmer Activity", value: `${analyticsData.farmer_activity.reduce((sum, item) => sum + item.value, 0)}`, delta: "Tracked platform actions" },
          { label: "Best Mandi Rate", value: "Live", delta: "Market feed connected" },
        ]);
      } catch {
        setWeather(null);
      }
    }
    load();
  }, [user?.location]);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
          <Badge className="bg-white/20 text-white">Farmer Dashboard</Badge>
          <h2 className="mt-4 font-['Fraunces'] text-4xl">Hello, {user?.name?.split(" ")[0] || "Farmer"}</h2>
          <p className="mt-3 max-w-2xl text-brand-100">
            {weather
              ? `Today's advisory: ${weather.condition.toLowerCase()} conditions in ${weather.location}, rainfall probability at ${weather.rainfall_probability}%, and irrigation should stay adaptive.`
              : "Today's advisory will appear here after weather, market, and disease services respond."}
          </p>
        </Card>
        <Card>
          <div className="text-sm font-medium text-brand-700">Quick actions</div>
          <div className="mt-4 grid gap-3">
            {quickActions.map((action) => (
              <Button key={action.to} variant="outline" className="justify-start rounded-2xl" asChild>
                <Link to={action.to}>{action.label}</Link>
              </Button>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = iconMap[index];
          return (
            <Card key={metric.label}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-brand-700">{metric.label}</div>
                  <div className="mt-2 text-3xl font-semibold text-brand-950">{metric.value}</div>
                </div>
                <Icon className="h-10 w-10 rounded-2xl bg-brand-50 p-2 text-brand-600" />
              </div>
              <div className="mt-4 text-sm text-brand-700">{metric.delta}</div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-brand-950">{item.title}</div>
              <Badge>{item.status}</Badge>
            </div>
            <p className="mt-3 text-brand-800">{item.message}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
