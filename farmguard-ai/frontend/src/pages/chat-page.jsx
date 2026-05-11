import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { askAI } from "../lib/api";
import { useAuth } from "../context/auth-context";

const starterMessages = [
  { role: "assistant", text: "Ask about crop disease, rainfall, irrigation, or mandi prices." },
  { role: "user", text: "Should I irrigate my tomato crop today in Pune?" },
  { role: "assistant", text: "Rain probability is high today, so postpone irrigation and focus on drainage checks." },
];

export function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(starterMessages);
  const [loading, setLoading] = useState(false);
  const [lastMeta, setLastMeta] = useState(null);
  const { user } = useAuth();

  async function handleSend() {
    if (!message.trim()) {
      return;
    }
    setMessages((current) => [...current, { role: "user", text: message }]);
    setLoading(true);
    try {
      const result = await askAI({
        query: message,
        location: user?.location || "Pune",
        language: user?.language || "English",
      });
      setMessages((current) => [...current, { role: "assistant", text: result.answer }]);
      setLastMeta({ provider: result.provider, actions: result.actions, route: result.route });
      setMessage("");
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", text: `Unable to reach AI service: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-4">
        <div className="font-['Fraunces'] text-3xl text-brand-950">AI Farming Assistant</div>
        <div className="space-y-3">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${item.role === "assistant" ? "bg-brand-50 text-brand-900" : "ml-auto bg-brand-500 text-white"}`}
            >
              {item.text}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Type your farming question..."
          />
          <Button onClick={handleSend} disabled={loading}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card>
        <div className="font-semibold text-brand-950">Suggested prompts</div>
        <div className="mt-4 grid gap-3 text-sm text-brand-800">
          <div className="rounded-2xl bg-brand-50 p-4">How to prevent leaf blight in tomato?</div>
          <div className="rounded-2xl bg-brand-50 p-4">Will it rain tomorrow in Nashik?</div>
          <div className="rounded-2xl bg-brand-50 p-4">What is the best time to sell onions this week?</div>
        </div>
        {lastMeta ? (
          <div className="mt-6 space-y-3 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">
            <div><span className="font-semibold text-brand-950">AI provider:</span> {lastMeta.provider}</div>
            <div><span className="font-semibold text-brand-950">Detected route:</span> {lastMeta.route}</div>
            <div><span className="font-semibold text-brand-950">Suggested next steps:</span> {lastMeta.actions.join(", ")}</div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
