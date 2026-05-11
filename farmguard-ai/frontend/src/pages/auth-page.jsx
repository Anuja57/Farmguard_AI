import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { login, register } from "../lib/api";
import { useAuth } from "../context/auth-context";

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "anuja@example.com",
    password: "farmguard123",
    phone: "",
    location: "Pune",
    language: "English",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await register(form);
      }
      const result = await login({ email: form.email, password: form.password });
      auth.login(result);
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card className="space-y-6">
        <div>
          <div className="font-['Fraunces'] text-3xl text-brand-950">{mode === "login" ? "Welcome back" : "Create farmer account"}</div>
          <p className="mt-2 text-brand-700">Simple access designed for fast onboarding in the field.</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {mode === "register" && <Input placeholder="Full Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />}
          <Input placeholder="Email address" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
          <Input placeholder="Password" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
          {mode === "register" && (
            <>
              <Input placeholder="Phone number" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
              <Input placeholder="Location" value={form.location} onChange={(event) => updateField("location", event.target.value)} />
              <Input placeholder="Language" value={form.language} onChange={(event) => updateField("language", event.target.value)} />
            </>
          )}
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          <Button type="submit">{loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}</Button>
          <button type="button" className="rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm font-medium text-brand-900">
            Continue with Google
          </button>
          <div className="text-xs text-brand-700">
            Production setup: enable Google Auth and email confirmation in Supabase Auth, then replace this button with the live OAuth redirect.
          </div>
        </form>
        <button className="text-sm text-brand-700" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </Card>
    </div>
  );
}
