/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { UploadZone } from "./components/UploadZone";
import { AnalysisResults } from "./components/AnalysisResults";
import { analyzeWorkshopOutput } from "./services/geminiService";
import { saveToGoogleSheets } from "./services/sheetService";
import { AnalysisResult } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Settings, Sparkles, AlertCircle } from "lucide-react";

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setIsSaved(false);
    setError(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setIsSaved(false);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    if (!projectName || !groupNumber) {
      setError("프로젝트명과 조 번호를 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(selectedFile);
      const base64 = await base64Promise;

      const analysisResult = await analyzeWorkshopOutput(base64, projectName, groupNumber);
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const success = await saveToGoogleSheets(result);
      if (success) setIsSaved(true);
      else setError("구글 시트 저장에 실패했습니다. 설정을 확인해주세요.");
    } catch (err) {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <Header />

      <main className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Step 1: Context Metadata */}
        <section className="glass-dark rounded-3xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-200">기본 정보 입력</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">프로젝트명</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="예: 2024 상반기 워크숍"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold ml-1">조 번호</label>
              <input
                type="text"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder="예: 1조"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Step 2: Upload */}
        <UploadZone 
          onFileSelect={handleFileSelect} 
          selectedFile={selectedFile} 
          onClear={handleClear} 
        />

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedFile}
            className={`
              px-10 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all
              ${isAnalyzing || !selectedFile 
                ? "bg-white/5 text-slate-500 cursor-not-allowed" 
                : "bg-white text-black hover:bg-purple-50 hover:scale-105 active:scale-95 shadow-xl shadow-white/10"}
            `}
          >
            {isAnalyzing ? (
              <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            {isAnalyzing ? "AI 분석 중..." : "산출물 분석 시작"}
          </button>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 max-w-md mx-auto"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {result && (
          <AnalysisResults 
            result={result} 
            onSave={handleSave} 
            isSaving={isSaving} 
            isSaved={isSaved} 
          />
        )}
      </main>
    </div>
  );
}
