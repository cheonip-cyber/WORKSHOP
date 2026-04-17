import { motion } from "motion/react";
import { ClipboardList } from "lucide-react";

export const Header = () => (
  <header className="py-8 px-4 text-center">
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 glass px-6 py-2 rounded-full mb-4"
    >
      <ClipboardList className="w-5 h-5 text-purple-400" />
      <span className="text-sm font-semibold text-purple-200 tracking-wider uppercase">Workshop AI Analyst</span>
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-glow"
    >
      워크숍 산출물 자동 분석 시스템
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-slate-400 max-w-lg mx-auto"
    >
      수기 데이터를 디지털로 전환하고 구글 스프레드시트에 실시간으로 기록하세요.
    </motion.p>
  </header>
);
