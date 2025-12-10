import React from 'react';
import { Mod, Platform } from '../types';
import { Download, Star, Monitor, Gamepad2, Laptop } from 'lucide-react';

interface ModCardProps {
  mod: Mod;
  onClick: () => void;
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case Platform.PC: return <Monitor className="w-3 h-3" />;
    case Platform.PLAYSTATION: return <Gamepad2 className="w-3 h-3" />;
    case Platform.XBOX: return <div className="font-bold text-[10px]">X</div>;
    case Platform.NINTENDO: return <Laptop className="w-3 h-3" />; // Approximation
    default: return null;
  }
};

export const ModCard: React.FC<ModCardProps> = ({ mod, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 shadow-lg active:scale-95 transition-transform duration-200 cursor-pointer mb-4"
    >
      {/* Cover Image with lazy loading */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={mod.imageUrl} 
          alt={mod.title} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]">
          {mod.category}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-slate-950/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold">{mod.endorsementRate}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative">
        <div className="flex justify-between items-start mb-1">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{mod.gameTitle}</p>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors">
          {mod.title}
        </h3>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
          {mod.description}
        </p>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-800">
          {/* Platform Tags */}
          <div className="flex gap-2">
            {mod.platforms.map(p => (
              <span key={p} className="flex items-center gap-1 bg-slate-800/50 border border-slate-700/50 px-2 py-1 rounded text-[10px] text-slate-300">
                <PlatformIcon platform={p} />
                {p === Platform.PC ? 'PC' : p === Platform.PLAYSTATION ? 'PS' : p === Platform.XBOX ? 'XBOX' : 'NS'}
              </span>
            ))}
          </div>

          {/* Download Count */}
          <div className="flex items-center gap-2">
             <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 font-mono">
                  {(mod.downloads / 1000).toFixed(1)}K
                </span>
                <span className="text-[10px] text-slate-600">DLs</span>
             </div>
             
             {/* Small visual action button imitation */}
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
                <Download className="w-4 h-4 text-white" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};