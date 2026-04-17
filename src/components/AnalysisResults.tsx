import { AnalysisResult } from "../types";
import { motion } from "motion/react";
import { CheckCircle2, TrendingUp, Layout, FileText } from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

export const AnalysisResults = ({ result, onSave, isSaving, isSaved }: AnalysisResultsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">분석 요약</h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-lg">
          {result.summary}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-dark rounded-2xl p-6 border-l-4 border-purple-500/50"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-slate-400">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-mono">{(item.confidence * 100).toFixed(0)}% 신뢰도</span>
              </div>
            </div>
            <p className="text-white text-lg font-medium leading-snug">
              {item.content}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center pt-8"
      >
        <button
          onClick={onSave}
          disabled={isSaving || isSaved}
          className={`
            relative px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all
            ${isSaved 
              ? "bg-emerald-500/20 text-emerald-400 cursor-default border border-emerald-500/30" 
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"}
          `}
        >
          {isSaving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isSaved ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Layout className="w-6 h-6" />
          )}
          {isSaving ? "저장 중..." : isSaved ? "구글 시트에 저장 완료" : "구글 시트에 전송하기"}
        </button>
      </motion.div>
    </div>
  );
};
