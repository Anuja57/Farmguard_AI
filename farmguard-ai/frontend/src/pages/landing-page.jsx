import { CloudRain, Languages, Leaf, LineChart, MessageCircleMore, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const features = [
  { icon: Leaf, title: "Disease detection", text: "Detect crop diseases early with AI-assisted image analysis." },
  { icon: CloudRain, title: "Weather intelligence", text: "Get rainfall, humidity, and temperature-aware farm actions." },
  { icon: LineChart, title: "Market insights", text: "Track mandi pricing and spot better selling windows." },
  { icon: MessageCircleMore, title: "AI advisory", text: "Ask farm questions in a simple chat-first interface." },
  { icon: Languages, title: "Multilingual access", text: "Designed for English, Hindi, Marathi, and more." },
  { icon: ShieldCheck, title: "Automation alerts", text: "Deliver reminders over WhatsApp, SMS, and workflow tools." },
];

export function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="hero-grid overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-[#efe7d8] px-6 py-12 shadow-glow md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Badge>SDG 2 • SDG 8 • SDG 13</Badge>
            <h1 className="max-w-3xl font-['Fraunces'] text-4xl leading-tight text-brand-950 md:text-6xl">
              Agentic AI support for sustainable farming and smarter crop decisions.
            </h1>
            <p className="max-w-2xl text-lg text-brand-800">
              FarmGuard AI helps farmers detect crop disease, anticipate weather shifts, optimize irrigation, understand market prices, and receive automated reminders in one modern platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/dashboard">Explore Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/auth">Login / Register</Link>
              </Button>
            </div>
          </div>
          <Card className="grid gap-4 bg-brand-900 text-white">
            <div className="text-sm uppercase tracking-[0.2em] text-brand-100">System Overview</div>
            <div className="font-['Fraunces'] text-2xl">Farmer → React → FastAPI → LangGraph Agents</div>
            <div className="text-sm leading-7 text-brand-100">
              Supabase stores farmer activity while n8n and Relay power rain alerts, disease reminders, and market notifications.
            </div>
            <div className="rounded-3xl bg-white/10 p-4 text-sm leading-7">
              Disease Agent
              <br />
              Weather Agent
              <br />
              Irrigation Agent
              <br />
              Market Agent
              <br />
              Advisory Agent
              <br />
              Notification Agent
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <feature.icon className="mb-4 h-9 w-9 text-brand-600" />
            <h3 className="mb-2 text-xl font-semibold text-brand-950">{feature.title}</h3>
            <p className="text-brand-800">{feature.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

