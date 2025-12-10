import React, { useEffect, useState } from 'react';
import { Mod } from '../types';
import { modService, CompatibilityResult } from '../services/modService';
import { 
  ArrowLeft, ShieldCheck, Download, Activity, 
  FileCode, Layers, Server, AlertTriangle, CheckCircle2 
} from 'lucide-react';

interface ModDetailProps {
  modId: string;
  onBack: () => void;
  userGameVersion: string;
}

type DownloadState = 'IDLE' | 'COMPATIBILITY_CHECK' | 'SCANNING' | 'VERIFYING' | 'DOWNLOADING' | 'DONE' | 'ERROR';

export const ModDetailView: React.FC<ModDetailProps> = ({ modId, onBack, userGameVersion }) => {
  const [mod, setMod] = useState<Mod | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>('IDLE');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);

  useEffect(() => {
    modService.getModById(modId).then(setMod);
  }, [modId]);

  const handleDownload = async () => {
    if (!mod) return;

    setDownloadState('COMPATIBILITY_CHECK');
    setStatusText('Checking Compatibility...');
    
    // Simulate slight delay for check
    setTimeout(async () => {
      const result = modService.checkCompatibility(mod, userGameVersion);
      setCompatibility(result);

      if (result.isCompatible) {
        startSecureDownload();
      } else {
        // Stop here and warn user, but allow override for demo
        setDownloadState('ERROR'); 
      }
    }, 800);
  };

  const startSecureDownload = async () => {
    if (!mod) return;
    setDownloadState('SCANNING');
    
    const success = await modService.downloadSecure(mod.id, (stage, pct) => {
      setStatusText(stage);
      setProgress(pct);
      if (pct < 40) setDownloadState('SCANNING');
      else if (pct < 70) setDownloadState('VERIFYING');
      else setDownloadState('DOWNLOADING');
    });

    if (success) {
      setDownloadState('DONE');
      setStatusText('Installation Ready');
    } else {
      setDownloadState('ERROR');
      setStatusText('Verification Failed');
    }
  };

  if (!mod) return <div className="p-10 text-center animate-pulse">Loading Manifest...</div>;

  return (
    <div className="relative min-h-screen bg-slate-950 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Immersive Header Image */}
      <div className="relative h-72 w-full">
         <img src={mod.imageUrl} className="w-full h-full object-cover" alt="cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
         
         <button 
            onClick={onBack}
            className="absolute top-10 left-6 p-2 bg-slate-900/50 backdrop-blur-md rounded-full border border-white/10 text-white active:scale-95"
         >
           <ArrowLeft className="w-6 h-6" />
         </button>
      </div>

      <div className="px-6 -mt-16 relative">
        {/* Mod Icon/Thumbnail */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-slate-950 shadow-2xl mb-4">
          <img src={mod.imageUrl} className="w-full h-full object-cover" alt="thumb" />
        </div>

        {/* Title & Author */}
        <div className="flex justify-between items-start mb-2">
           <div>
             <h1 className="text-2xl font-bold text-white leading-tight mb-1">{mod.title}</h1>
             <p className="text-purple-400 font-medium text-sm">by {mod.author}</p>
           </div>
           {mod.verified && (
             <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-500/20 flex items-center gap-1">
               <ShieldCheck className="w-3 h-3" /> Verified
             </div>
           )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
             <Activity className="w-4 h-4 text-pink-500 mb-1" />
             <span className="text-sm font-bold text-slate-200">{mod.downloads < 1000000 ? (mod.downloads/1000).toFixed(0) + 'K' : (mod.downloads/1000000).toFixed(1) + 'M'}</span>
             <span className="text-[10px] text-slate-500 uppercase">Downloads</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
             <Layers className="w-4 h-4 text-cyan-500 mb-1" />
             <span className="text-sm font-bold text-slate-200">{mod.size}</span>
             <span className="text-[10px] text-slate-500 uppercase">Size</span>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
             <FileCode className="w-4 h-4 text-purple-500 mb-1" />
             <span className="text-sm font-bold text-slate-200">{mod.version}</span>
             <span className="text-[10px] text-slate-500 uppercase">Version</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-300 uppercase mb-2 tracking-wide">About this mod</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {mod.description}
          </p>
        </div>

        {/* Technical Metadata */}
        <div className="mb-24 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase mb-2 tracking-wide">Technical Integrity</h3>
          
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 space-y-3">
             <div className="flex justify-between items-center text-sm">
               <span className="text-slate-500">Integrity Hash (SHA-256)</span>
               <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-1 rounded truncate w-32">{mod.hash}</span>
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
               </div>
             </div>

             <div className="w-full h-px bg-slate-800" />

             <div className="flex justify-between items-center text-sm">
               <span className="text-slate-500">Target Game Version</span>
               <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded text-xs">{mod.supportedGameVersion}</span>
             </div>

             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Dependencies</span>
                <span className="text-purple-400 font-bold text-xs">{mod.dependencies.length} Required</span>
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 p-4 px-6 pb-8 z-50">
        
        {/* Compatibility Alert Overlay */}
        {downloadState === 'ERROR' && compatibility && !compatibility.isCompatible && (
          <div className="mb-4 bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center gap-3 text-red-200 text-sm">
             <AlertTriangle className="w-5 h-5 shrink-0" />
             <div>
               <p className="font-bold">Compatibility Warning</p>
               <p className="text-xs opacity-80">{compatibility.message}</p>
             </div>
             <button 
               onClick={startSecureDownload}
               className="ml-auto text-xs underline font-bold"
             >
               Force
             </button>
          </div>
        )}

        <button 
          onClick={handleDownload}
          disabled={downloadState !== 'IDLE' && downloadState !== 'DONE' && downloadState !== 'ERROR'}
          className={`w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg overflow-hidden relative
            ${downloadState === 'DONE' ? 'bg-emerald-600 text-white shadow-emerald-900/20' : 
              downloadState === 'ERROR' ? 'bg-red-600 text-white' :
              'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          {downloadState === 'IDLE' && (
             <>
               <Download className="w-5 h-5" />
               Download Securely
             </>
          )}

          {(downloadState === 'SCANNING' || downloadState === 'VERIFYING' || downloadState === 'DOWNLOADING') && (
            <div className="w-full h-full absolute inset-0 bg-slate-800 flex items-center justify-center">
               <div className="absolute left-0 top-0 bottom-0 bg-slate-700 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
               <div className="relative z-10 flex flex-col items-center">
                  <span className="text-sm font-bold uppercase tracking-wider">{statusText}</span>
                  <span className="text-xs text-slate-400 font-mono">{progress}%</span>
               </div>
            </div>
          )}

          {downloadState === 'COMPATIBILITY_CHECK' && (
            <div className="animate-pulse">Checking Compatibility...</div>
          )}

          {downloadState === 'DONE' && (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Installed
            </>
          )}
        </button>
      </div>
    </div>
  );
};