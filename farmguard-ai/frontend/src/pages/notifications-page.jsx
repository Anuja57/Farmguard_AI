import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { notifications } from "./data";
import { getNotifications } from "../lib/api";

export function NotificationsPage() {
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    async function load() {
      try {
        const response = await getNotifications();
        setItems(
          response.map((item) => ({
            title: item.title,
            message: item.message,
            status: item.status,
          }))
        );
      } catch {
        setItems(notifications);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3">
          <BellRing className="h-8 w-8 text-brand-600" />
          <div>
            <div className="font-['Fraunces'] text-3xl text-brand-950">Notifications Center</div>
            <div className="text-brand-700">Rain alerts, treatment reminders, and mandi price updates.</div>
          </div>
        </div>
      </Card>
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.title}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-brand-950">{item.title}</div>
              <Badge>{item.status}</Badge>
            </div>
            <p className="mt-2 text-brand-800">{item.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
