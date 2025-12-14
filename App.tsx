import React, { useState, useEffect, useRef } from 'react';
import { findSymbolsFromImage } from './services/geminiService';
import { SymbolResult, AppSettings, HistoryItem, ThemeColor } from './types';
import UploadZone from './components/UploadZone';
import SymbolCard from './components/SymbolCard';

// --- Icons ---
const Icons = {
    Github: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
    Twitter: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    YouTube: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>,
    Linkedin: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>,
    Pinterest: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
};

// 5. Magnetic Button
const MagneticButton = ({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (window.innerWidth < 768) return; 
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        setPos({ x: x * 0.15, y: y * 0.15 }); 
    };

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setPos({ x: 0, y: 0 })}
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
            className={`transition-transform duration-200 ease-out will-change-transform active:scale-95 ${className}`}
        >
            {children}
        </button>
    );
};

// Custom Cursor
const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
            document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
        };
        const addHover = () => cursorRef.current?.classList.add('hovering');
        const removeHover = () => cursorRef.current?.classList.remove('hovering');
        document.addEventListener('mousemove', moveCursor);
        document.querySelectorAll('a, button, input').forEach(el => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
        });
        return () => document.removeEventListener('mousemove', moveCursor);
    }, []);
    return <div ref={cursorRef} className="custom-cursor hidden md:block"></div>;
};

// --- Footer Component with Cipher Branding ---
const Footer = () => {
    const socialLinks = [
        { name: 'X', url: 'https://x.com/Cipher_attacks', icon: Icons.Twitter },
        { name: 'YouTube', url: 'https://www.youtube.com/@cipher-attack', icon: Icons.YouTube },
        { name: 'Pinterest', url: 'https://pin.it/3R6Nz', icon: Icons.Pinterest },
        { name: 'Github', url: 'https://github.com/cipher-attack', icon: Icons.Github },
        { name: 'Linkedin', url: 'https://et.linkedin.com/in/cipher-attack-93582433b', icon: Icons.Linkedin },
    ];

    return (
        <footer className="relative z-20 mt-20 pb-8 px-6">
            <div className="max-w-7xl mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="text-center md:text-left space-y-2">
                    <h3 className="text-xl font-bold font-grotesk tracking-tight text-white flex items-center gap-2 justify-center md:justify-start">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="glitch" data-text="CIPHER">CIPHER</span>
                    </h3>
                    <p className="text-sm text-slate-500 font-mono">
                        'CIPHER' in the Cyber world
                    </p>
                </div>

                {/* Social Dock */}
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl backdrop-blur-md border border-white/5 shadow-2xl">
                    {socialLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group relative"
                        >
                            <link.icon />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none font-mono">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>

                <div className="text-[10px] font-mono text-slate-600 text-center md:text-right">
                    <p>SYSTEM_VERSION_2.0.4</p>
                    <p>ALL_RIGHTS_RESERVED © {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
};

const SettingsModal = ({ isOpen, onClose, settings, onSave }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-enter">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div className="bg-[#0A0A0A] border-t md:border border-white/10 w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden transform transition-all">
                <div className="md:hidden w-12 h-1 bg-white/10 rounded-full mx-auto mb-6"></div>
                <button onClick={onClose} className="hidden md:block absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
                <h2 className="text-lg font-bold text-white mb-6 font-grotesk tracking-wide border-b border-white/5 pb-4">SYSTEM CONFIG</h2>
                <div className="space-y-6">
                    <div className="group">
                        <label className="block text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-widest">API Key</label>
                        <input 
                            type="password" 
                            placeholder="Optional (Uses Offline Mode)"
                            value={settings.apiKey}
                            onChange={(e) => onSave({ ...settings, apiKey: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-emerald-500/50 outline-none text-xs font-mono transition-colors placeholder:text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-emerald-500 mb-2 uppercase tracking-widest">Theme Accent</label>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {(['emerald', 'blue', 'violet', 'amber', 'rose'] as ThemeColor[]).map(c => (
                                <button 
                                    key={c}
                                    onClick={() => onSave({ ...settings, themeColor: c })}
                                    className={`w-8 h-8 rounded-full border border-white/10 flex-shrink-0 flex items-center justify-center transition-all ${settings.themeColor === c ? 'bg-white/10 ring-2 ring-white/20' : 'opacity-40 hover:opacity-100'}`}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: `var(--color-${c}, ${c === 'emerald' ? '#10b981' : c})` }}></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailModal = ({ isOpen, onClose, symbol, imageUrl }: any) => {
    if (!isOpen || !symbol) return null;
    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 cursor-auto overflow-y-auto" onClick={onClose}>
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center relative my-auto" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col items-center group perspective-1000 order-2 md:order-1">
                    <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 w-full max-w-sm bg-white/5 p-8">
                         <img src={imageUrl || ''} className="w-full object-contain mix-blend-screen" alt="Original" />
                    </div>
                    <span className="mt-4 font-mono text-[10px] text-emerald-500 tracking-[0.3em] opacity-60">SOURCE_MATRIX</span>
                </div>
                <div className="flex flex-col items-center relative order-1 md:order-2">
                    <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                        <span className="text-[180px] md:text-[220px] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] font-grotesk">
                            {symbol.char}
                        </span>
                    </div>
                    <div className="relative z-10 text-center space-y-4">
                         <h2 className="text-3xl md:text-4xl font-bold font-grotesk text-white tracking-tight">{symbol.name}</h2>
                         <div className="flex gap-3 justify-center">
                            <code className="text-xs text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-500/10 font-mono">{symbol.htmlEntity}</code>
                            <code className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded border border-white/5 font-mono">U+{symbol.char.codePointAt(0)?.toString(16).toUpperCase()}</code>
                         </div>
                    </div>
                </div>
                <button onClick={onClose} className="absolute top-0 right-0 p-4 text-slate-600 hover:text-white transition-colors">✕</button>
            </div>
        </div>
    );
};

const AmbientBackground = () => (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="aurora-blob w-[600px] h-[600px] bg-emerald-900/10 top-[-20%] left-[-10%]"></div>
        <div className="aurora-blob w-[500px] h-[500px] bg-blue-900/10 bottom-[-20%] right-[-10%] animation-delay-2000"></div>
        <div className="cyber-grid"></div>
        <div className="vignette"></div>
        <div className="noise-overlay"></div>
    </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SymbolResult[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [inspectSymbol, setInspectSymbol] = useState<SymbolResult | null>(null);
  const [playgroundText, setPlaygroundText] = useState("");
  const [settings, setSettings] = useState<AppSettings>({
      apiKey: '',
      themeColor: 'emerald',
      fontSize: 72,
      viewMode: 'grid',
      fontFamily: 'sans',
      soundEnabled: false
  });

  const handleImageSelected = async (base64: string, mimeType: string, url: string) => {
    setLoading(true);
    setPreviewUrl(url);
    setError(null);
    setResults([]);
    try {
      const response = await findSymbolsFromImage(base64, mimeType, settings.apiKey);
      setResults(response.symbols);
      const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          imageUrl: url,
          results: response.symbols
      };
      setHistory(prev => [newItem, ...prev].slice(0, 20));
    } catch (err: any) {
      console.error(err);
      setError("Analysis Failed. Re-align sensors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen text-slate-300 pb-safe relative">
      <CustomCursor />
      <AmbientBackground />
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onSave={setSettings} />
      <DetailModal isOpen={!!inspectSymbol} onClose={() => setInspectSymbol(null)} symbol={inspectSymbol} imageUrl={previewUrl} />

      {/* Professional Header */}
      <header className="fixed top-0 w-full z-40 border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-lg text-emerald-400 font-bold">⌬</span>
            </div>
            <h1 className="text-sm font-bold tracking-[0.2em] font-grotesk text-white group cursor-default">
                SYM<span className="text-emerald-500 group-hover:animate-pulse">BOL</span>IZE
            </h1>
          </div>
          
          <MagneticButton onClick={() => setSettingsOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
             <div className={`w-1.5 h-1.5 rounded-full ${settings.apiKey ? 'bg-emerald-500' : 'bg-amber-500'} transition-colors`}></div>
             <span className="hidden md:inline text-[10px] font-mono tracking-widest text-slate-400 group-hover:text-white">SYS_CONFIG</span>
          </MagneticButton>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className={`lg:col-span-${results.length > 0 ? '4' : '12'} transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`}>
            {previewUrl ? (
              <div className="sticky top-24 animate-enter">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-6 group">
                  <img src={previewUrl} alt="Analysis Target" className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105 opacity-90" />
                  {loading && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-[5%] w-full animate-[scan_1.5s_ease-in-out_infinite]"></div>}
                </div>
                <MagneticButton onClick={() => { setResults([]); setPreviewUrl(null); }} className="w-full py-3 bg-white/5 hover:bg-emerald-500/10 border border-white/10 text-slate-300 hover:text-white rounded-lg transition-all font-mono text-xs tracking-widest uppercase">
                    RESET_SCAN
                </MagneticButton>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto mt-12 text-center">
                 <div className="mb-12 animate-enter space-y-4">
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter font-grotesk">
                        VISUAL <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">DECODER</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-mono tracking-wide">
                        AI-POWERED PATTERN RECOGNITION SYSTEM
                    </p>
                </div>
                <UploadZone onImageSelected={handleImageSelected} isLoading={loading} />
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="lg:col-span-8 space-y-8 animate-enter" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <span className="text-xs font-mono text-emerald-500">{results.length} MATCHES FOUND</span>
                    <div className="flex gap-2">
                        <button onClick={() => setSettings({...settings, viewMode: 'grid'})} className={`p-2 rounded ${settings.viewMode === 'grid' ? 'text-white bg-white/10' : 'text-slate-600'}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg></button>
                        <button onClick={() => setSettings({...settings, viewMode: 'list'})} className={`p-2 rounded ${settings.viewMode === 'list' ? 'text-white bg-white/10' : 'text-slate-600'}`}><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg></button>
                    </div>
                </div>

              <div className={`grid ${settings.viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
                {loading 
                  ? Array(8).fill(0).map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-40 animate-pulse"></div>)
                  : results.map((symbol, idx) => (
                    <SymbolCard 
                        key={idx} 
                        index={idx}
                        symbol={symbol} 
                        settings={settings}
                        isFavorite={favorites.includes(symbol.char)}
                        onToggleFavorite={() => setFavorites(prev => prev.includes(symbol.char) ? prev.filter(c => c !== symbol.char) : [...prev, symbol.char])}
                        onShowToast={() => {}} 
                        onOpenDetail={() => setInspectSymbol(symbol)}
                    />
                  ))
                }
              </div>

               <div className="bg-[#0A0A0A] rounded-xl p-6 border border-white/5 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-mono text-slate-500 tracking-widest">COMPOSITION_BUFFER</h3>
                        <button className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors" onClick={() => navigator.clipboard.writeText(playgroundText)}>COPY_ALL</button>
                    </div>
                    <textarea 
                        value={playgroundText}
                        onChange={(e) => setPlaygroundText(e.target.value)}
                        placeholder="..."
                        className="w-full h-24 bg-transparent border-none text-white text-xl focus:ring-0 outline-none font-grotesk placeholder-slate-800 resize-none font-light"
                    ></textarea>
               </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
