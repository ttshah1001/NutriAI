"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Upload,
} from "lucide-react";
import type { AIAnalysisResult } from "@/lib/types";

interface CameraScannerProps {
  onAddFoods: (
    foods: Array<{
      name: string;
      grams?: number;
      calories: number;
      protein: number;
      fiber: number;
      fat: number;
      carbs: number;
    }>
  ) => void;
}

export function CameraScanner({ onAddFoods }: CameraScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState("image/jpeg");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [added, setAdded] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setPreview(null);
      setResult(null);
    } catch {
      setError("Camera access denied. Please upload a photo instead.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPreview(dataUrl);
    setMediaType("image/jpeg");
    stopCamera();
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    setResult(null);
    setAdded(false);
    setMediaType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!preview) return;

    setAnalyzing(true);
    setError(null);
    setResult(null);
    setAdded(false);

    try {
      const base64 = preview.split(",")[1];

      const res = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddAll = () => {
    if (!result) return;
    onAddFoods(
      result.foods.map((f) => ({
        name: f.name,
        grams: f.estimatedGrams,
        calories: f.calories,
        protein: f.protein,
        fiber: f.fiber,
        fat: f.fat,
        carbs: f.carbs,
      }))
    );
    setAdded(true);
    setPreview(null);
    setResult(null);
  };

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setAdded(false);
    stopCamera();
  };

  return (
    <div className="space-y-4">
      {added && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700 ring-1 ring-brand-200">
          <Check className="h-4 w-4" />
          Food items added to your log!
        </div>
      )}

      {!preview && !cameraActive && (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={startCamera}
            className="card flex flex-col items-center gap-3 border-2 border-dashed border-brand-200/60 bg-brand-50/30 p-8 transition-all hover:border-brand-400 hover:bg-brand-50 hover:shadow-card"
          >
            <div className="rounded-2xl bg-brand-100 p-4">
              <Camera className="h-8 w-8 text-brand-600" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800">Take Photo</p>
              <p className="mt-1 text-sm text-slate-500">
                Use your camera to scan food
              </p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="card flex flex-col items-center gap-3 border-2 border-dashed border-accent-200/60 bg-accent-50/30 p-8 transition-all hover:border-accent-400 hover:bg-accent-50 hover:shadow-card"
          >
            <div className="rounded-2xl bg-accent-100 p-4">
              <Upload className="h-8 w-8 text-accent-600" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800">Upload Photo</p>
              <p className="mt-1 text-sm text-slate-500">
                Choose from your gallery
              </p>
            </div>
          </button>
        </div>
      )}

      {cameraActive && (
        <div className="overflow-hidden rounded-2xl bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="flex gap-2 bg-gray-900 p-3">
            <button
              onClick={capturePhoto}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white"
            >
              <Camera className="h-4 w-4" />
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="rounded-xl bg-gray-700 px-4 py-3 text-sm text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <canvas ref={canvasRef} className="hidden" />

      {preview && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Food preview"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={analyzeImage}
              disabled={analyzing}
              className="btn-primary flex-1 disabled:opacity-60"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4" />
                  Analyze Food
                </>
              )}
            </button>
            <button onClick={reset} className="btn-secondary">
              Retake
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p>{error}</p>
            {error.includes("API key") && (
              <p className="mt-1 text-xs">
                Add <code className="rounded bg-red-100 px-1">ANTHROPIC_API_KEY</code> or{" "}
                <code className="rounded bg-red-100 px-1">GEMINI_API_KEY</code> to{" "}
                <code className="rounded bg-red-100 px-1">.env.local</code>. See
                .env.local.example.
              </p>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-slate-800">AI Analysis Results</h3>
              {result.provider && (
                <span className="rounded-lg bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                  via {result.provider}
                </span>
              )}
            </div>
            {result.notes && (
              <p className="mt-1 text-sm text-slate-500">{result.notes}</p>
            )}
          </div>

          <ul className="divide-y divide-gray-50">
            {result.foods.map((food, i) => (
              <li key={i} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{food.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      food.confidence === "high"
                        ? "bg-green-100 text-green-700"
                        : food.confidence === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {food.confidence}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  ~{food.estimatedGrams}g · {food.calories} kcal · P{" "}
                  {food.protein}g · C {food.carbs}g · F {food.fat}g
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-100 px-5 py-4">
            <div className="mb-3 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>
                {result.total.calories} kcal · P {result.total.protein}g · C{" "}
                {result.total.carbs}g · F {result.total.fat}g
              </span>
            </div>
            <button onClick={handleAddAll} className="btn-primary w-full">
              <Plus className="h-4 w-4" />
              Add All to Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
