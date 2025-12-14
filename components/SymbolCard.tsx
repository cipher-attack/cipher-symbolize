import React, { useState } from 'react';
import { SymbolResult, AppSettings } from '../types';

interface SymbolCardProps {
  symbol: SymbolResult;
  settings: AppSettings;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShowToast: (msg: string) => void;
  onOpenDetail: () => void;
  index: number;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ 
  symbol, 
  settings, 
  isFavorite, 
  onToggleFavorite, 
  onShowToast, 
  onOpenDetail,
  index
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(symbol.char);
    setCopied(true);
    onShowToast(`Copied ${symbol.char}`);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      onClick={handleCopy}
      style={{ animationDelay: `${index * 50}ms` }}
      className={`
        group relative flex flex-col p-4 
        bg-[#0A0A0A] hover:bg-[#111]
        border border-white/5 hover:border-emerald-500/30
        rounded-xl cursor-pointer
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10
        animate-enter
      `}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors z-20 opacity-0 group-hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "#10b981" : "none"} stroke="currentColor" className={`w-3.5 h-3.5 ${isFavorite ? "text-emerald-500" : "text-slate-500"}`}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>

      <div className="flex-1 flex items-center justify-center min-h-[80px] relative">
        <span 
            className={`font-grotesk text-4xl text-white transition-all duration-300 group-hover:scale-110 ${copied ? 'text-emerald-400 scale-125' : ''}`}
        >
          {symbol.char}
        </span>
        {copied && <span className="absolute text-[10px] font-mono text-emerald-500 -bottom-2">COPIED</span>}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-end opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-mono text-slate-400 truncate uppercase tracking-wider">{symbol.name}</span>
            <span className="text-[9px] text-slate-600 font-mono truncate">U+{symbol.char.codePointAt(0)?.toString(16).toUpperCase()}</span>
        </div>
        <button 
           onClick={(e) => { e.stopPropagation(); onOpenDetail(); }}
           className="text-[10px] hover:text-white text-slate-600 transition-colors"
        >
           ↗
        </button>
      </div>
    </div>
  );
};

export default SymbolCard;
