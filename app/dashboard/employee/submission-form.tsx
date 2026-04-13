"use client";

import { useState } from "react";
import { submitVideo } from "@/app/actions/youtube";
import { Youtube, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SubmissionForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await submitVideo(url);

    if (result.success) {
      const successData = result as { earnedToday: number };
      setMessage({ type: "success", text: `Video approved! You've earned ₦${successData.earnedToday.toFixed(2)} today.` });
      setUrl("");
    } else {
      const errorData = result as { error?: string };
      setMessage({ type: "error", text: errorData.error || "Submission failed" });
    }
    setLoading(false);
  };

  return (
    <div className="premium-card p-6 bg-white dark:bg-slate-900 shadow-xl border-t-4 border-t-indigo-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">YouTube Video URL</label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Youtube size={20} />
            </span>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>
        
        {message && (
          <div className={`p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 border ${
            message.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400" 
            : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
            <p className="text-sm font-semibold">{message.text}</p>
          </div>
        )}

        <button
          disabled={loading || !url}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Verify & Submit <ArrowRight size={24} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
