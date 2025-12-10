import React, { useState } from 'react';
import { Mod, Category, Platform } from '../types';
import { ModCard } from '../components/ModCard';
import { Filter, Bell, ChevronDown } from 'lucide-react';

interface HomeViewProps {
  mods: Mod[];
  onModClick: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ mods, onModClick }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter Logic
  const filteredMods = mods.filter(mod => {
    const matchPlatform = selectedPlatform === 'All' || mod.platforms.includes(selectedPlatform as Platform);
    const matchCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    return matchPlatform && matchCategory;
  });

  return (
    <div className="flex flex-col min-h-screen w-full relative pb-32">
      {/* Header - Sticky with high Z-index */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur-md z-30 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            ModGame
          </h1>
          <p className="text-slate-400 text-xs">Welcome back, Nomad</p>
        </div>
        <div className="p-2 bg-slate-800 rounded-full relative cursor-pointer active:scale-95 transition-transform">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border border-slate-800"></span>
        </div>
      </header>

      {/* Discovery Hero Section Text */}
      <div className="px-6 my-6">
        <h2 className="text-3xl font-light text-white leading-tight">
          Discover <span className="font-bold">Next-Gen</span> <br /> 
          Experiences
        </h2>
      </div>

      {/* Search Placeholder */}
      <div className="px-6 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3 text-slate-400 shadow-inner">
          <Filter className="w-5 h-5" />
          <span className="text-sm">Search games, mods, authors...</span>
        </div>
      </div>

      {/* Filters Scroll */}
      <div className="pl-6 mb-6 overflow-x-auto no-scrollbar flex gap-3 pb-2 w-full pr-6">
        <button 
          onClick={() => setSelectedPlatform('All')}
          className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${selectedPlatform === 'All' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/40' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
        >
          All
        </button>
        {Object.values(Platform).map(p => (
          <button 
            key={p}
            onClick={() => setSelectedPlatform(p)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${selectedPlatform === p ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
          >
            {p === Platform.PC ? 'PC' : p === Platform.PLAYSTATION ? 'PS' : p === Platform.XBOX ? 'Xbox' : 'Switch'}
          </button>
        ))}
      </div>

      {/* Category Dropdown imitation */}
      <div className="px-6 mb-4 flex justify-between items-center">
        <button className="flex items-center gap-2 text-slate-300 text-sm font-medium active:text-white">
          {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="text-pink-500 text-xs font-bold uppercase tracking-wide">
          Popular
        </button>
      </div>

      {/* Mod List (RecyclerView) */}
      <div className="px-4 flex flex-col gap-4">
        {filteredMods.map(mod => (
          <ModCard key={mod.id} mod={mod} onClick={() => onModClick(mod.id)} />
        ))}
        {filteredMods.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No mods found for this filter.
          </div>
        )}
      </div>
    </div>
  );
};