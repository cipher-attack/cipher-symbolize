import React, { useRef, useState } from 'react';

interface UploadZoneProps {
  onImageSelected: (base64: string, mimeType: string, previewUrl: string) => void;
  isLoading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const match = base64String.match(/^data:(.+);base64,(.+)$/);
      if (match) onImageSelected(match[2], match[1], base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={!isLoading ? () => fileInputRef.current?.click() : undefined}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); }}
      className={`
        relative w-full h-64 border border-dashed border-white/10 rounded-2xl
        flex flex-col items-center justify-center text-center
        transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/30
        cursor-pointer group overflow-hidden
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        ${isDragging ? 'bg-emerald-500/5 border-emerald-500/50' : ''}
      `}
    >
      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} accept="image/*" className="hidden" />
      
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            bg-white/5 border border-white/5 text-slate-400
            group-hover:text-emerald-400 group-hover:border-emerald-500/30
            transition-all duration-300
        `}>
           {isLoading ? (
               <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
           )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-mono text-slate-300 group-hover:text-white tracking-wide">
            {isDragging ? 'RELEASE_TO_UPLOAD' : 'UPLOAD_VISUAL_DATA'}
          </h3>
          <p className="text-[10px] text-slate-600 font-mono">
            SUPPORTS JPG, PNG, WEBP
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
