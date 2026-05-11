import { useState } from "react";
import { Upload } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { detectDisease } from "../lib/api";

export function DiseasePage() {
  const [cropName, setCropName] = useState("Tomato");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState({
    disease_name: "Leaf Blight",
    confidence_score: 0.91,
    treatment_suggestions: ["Apply copper-based fungicide.", "Remove infected leaves immediately."],
    prevention_tips: ["Avoid overhead irrigation.", "Use disease-resistant seed varieties."],
    advisory_summary: "Upload a crop image and a short description to receive a richer disease advisory.",
    provider: "heuristic",
  });
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!file) {
      return;
    }
    setLoading(true);
    try {
      const response = await detectDisease({ cropName, description, file });
      setResult(response);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card className="space-y-4">
        <div className="font-['Fraunces'] text-3xl text-brand-950">Crop Disease Detection</div>
        <p className="text-brand-700">Upload a crop image and farmer notes to identify disease, estimate confidence, and receive treatment suggestions.</p>
        <Input placeholder="Crop name" value={cropName} onChange={(event) => setCropName(event.target.value)} />
        <textarea
          className="min-h-28 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none ring-brand-200 transition focus:ring-2"
          placeholder="Describe what the farmer is seeing: leaf color, spots, powder, curling, stem damage, spread speed..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50 text-center">
          <Upload className="mb-3 h-10 w-10 text-brand-500" />
          <div className="font-medium text-brand-900">Tap to upload crop image</div>
          <div className="text-sm text-brand-700">JPEG, PNG, or mobile camera image</div>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const nextFile = event.target.files?.[0] || null;
              setFile(nextFile);
              setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : "");
            }}
          />
        </label>
        {previewUrl ? <img src={previewUrl} alt="Crop preview" className="max-h-64 w-full rounded-3xl object-cover" /> : null}
        <Button onClick={handleAnalyze} disabled={!file || loading}>{loading ? "Analyzing..." : "Analyze Disease"}</Button>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-brand-950">Latest result</div>
          <Badge>{Math.round((result.confidence_score || 0) * 100)}% confidence</Badge>
        </div>
        <div className="font-['Fraunces'] text-2xl text-brand-900">{result.disease_name}</div>
        <div className="rounded-3xl bg-brand-50 p-4 text-sm text-brand-800">{result.advisory_summary}</div>
        <div className="rounded-3xl bg-brand-50 p-4">
          <div className="font-medium text-brand-900">Treatment</div>
          <ul className="mt-2 space-y-2 text-sm text-brand-800">
            {result.treatment_suggestions?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-brand-50 p-4">
          <div className="font-medium text-brand-900">Prevention</div>
          <ul className="mt-2 space-y-2 text-sm text-brand-800">
            {result.prevention_tips?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-brand-700">Analysis provider: {result.provider}</div>
      </Card>
    </div>
  );
}
