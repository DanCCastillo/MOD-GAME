import React, { useState } from 'react';
import { Mod } from '../types';
import { ModCard } from '../components/ModCard';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchViewProps {
  mods: Mod[];
  onModClick: (id: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ mods, onModClick }) => {
  const [query, setQuery] = useState('');

  const filtered = mods.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.gameTitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pt-10 px-4 min-h-screen w-full pb-32">
       <h1 className="text-2xl font-bold mb-6 px-2 sticky top-0 bg-slate-950 z-20 py-4">Explorar Catálogo</h1>
       
       <div className="relative mb-6 sticky top-16 z-20">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar mods, juegos..."
            className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-10 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-lg"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 p-2 active:bg-slate-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
       </div>

       <div className="flex flex-col gap-4">
         {filtered.length > 0 ? (
           filtered.map(mod => (
             <ModCard key={mod.id} mod={mod} onClick={() => onModClick(mod.id)} />
           ))
         ) : (
           <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
             <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
             <p>No se encontraron resultados para "{query}"</p>
           </div>
         )}
       </div>
    </div>
  );
};