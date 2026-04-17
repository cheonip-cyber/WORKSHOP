import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const UploadZone = ({ onFileSelect, selectedFile, onClear }: UploadZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => acceptedFiles[0] && onFileSelect(acceptedFiles[0]),
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps()}
            className={cn(
              "relative group cursor-pointer",
              "glass-dark rounded-3xl p-12 text-center border-2 border-dashed border-white/5 transition-all duration-300",
              isDragActive ? "border-purple-500/50 bg-white/5" : "hover:border-white/20 hover:bg-white/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">이미지 업로드</h3>
            <p className="text-slate-400">
              {isDragActive ? "이미지를 여기에 놓으세요" : "워크숍 산출물 이미지를 드래그하거나 클릭하여 선택하세요"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-dark rounded-3xl p-6 relative"
          >
            <button
              onClick={onClear}
              className="absolute -top-3 -right-3 w-10 h-10 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full flex items-center justify-center backdrop-blur-md border border-red-500/30 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center bg-black/40">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-4 flex items-center gap-3 text-slate-300 px-2">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-slate-500 ml-auto">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
