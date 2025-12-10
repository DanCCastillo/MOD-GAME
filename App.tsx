import React, { useState, useEffect } from 'react';
import { Home, Search, Library, User, Menu } from 'lucide-react';
import { ViewState, Mod } from './types';
import { modService } from './services/modService';

// Views
import { HomeView } from './views/Home';
import { ModDetailView } from './views/ModDetail';
import { SearchView } from './views/Search';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedModId, setSelectedModId] = useState<string | null>(null);
  
  // Data State
  const [mods, setMods] = useState<Mod[]>([]);

  useEffect(() => {
    // Initial fetch
    modService.getMods().then(setMods);
  }, []);

  // Scroll Restoration: When view changes, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedModId]);

  const navigateToDetail = (modId: string) => {
    setSelectedModId(modId);
    setCurrentView('DETAIL');
  };

  const navigateBack = () => {
    setCurrentView('HOME'); // Default back to home logic
    setSelectedModId(null);
  };

  const handleNavClick = (view: ViewState) => {
    setSelectedModId(null);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <HomeView mods={mods} onModClick={navigateToDetail} />;
      case 'SEARCH':
        return <SearchView mods={mods} onModClick={navigateToDetail} />;
      case 'DETAIL':
        return selectedModId ? (
          <ModDetailView 
            modId={selectedModId} 
            onBack={navigateBack} 
            userGameVersion="2.1" 
          />
        ) : <HomeView mods={mods} onModClick={navigateToDetail} />;
      case 'LIBRARY':
        return (
          <div className="pt-20 px-6 text-center">
            <Library className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <h2 className="text-xl font-bold mb-2">Mi Biblioteca</h2>
            <p className="text-slate-400">Tus mods descargados aparecerán aquí.</p>
          </div>
        );
      case 'PROFILE': // Mapped directly for User icon for now
        return (
          <div className="pt-20 px-6 text-center">
            <User className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <h2 className="text-xl font-bold mb-2">Perfil de Usuario</h2>
            <p className="text-slate-400">Funcionalidad de inicio de sesión próximamente.</p>
          </div>
        );
      default:
        return <HomeView mods={mods} onModClick={navigateToDetail} />;
    }
  };

  // Mobile Bottom Navigation Bar
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-[80px] shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <button 
        onClick={() => handleNavClick('HOME')}
        className={`flex flex-col items-center gap-1 active:scale-95 transition-transform ${currentView === 'HOME' && !selectedModId ? 'text-purple-400' : 'text-slate-500'}`}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Inicio</span>
      </button>

      <button 
        onClick={() => handleNavClick('SEARCH')}
        className={`flex flex-col items-center gap-1 active:scale-95 transition-transform ${currentView === 'SEARCH' ? 'text-purple-400' : 'text-slate-500'}`}
      >
        <Search className="w-6 h-6" />
        <span className="text-[10px] font-medium">Explorar</span>
      </button>

      {/* Main Action Button */}
      <div 
        className="group relative -mt-8 cursor-pointer active:scale-95 transition-transform"
        onClick={() => handleNavClick('HOME')} 
      >
        <div className="absolute inset-0 bg-purple-600 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
        <div className="w-14 h-14 relative rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center border-4 border-slate-950 z-10">
          <Menu className="w-6 h-6 text-white" />
        </div>
      </div>

      <button 
        onClick={() => handleNavClick('LIBRARY')}
        className={`flex flex-col items-center gap-1 active:scale-95 transition-transform ${currentView === 'LIBRARY' ? 'text-purple-400' : 'text-slate-500'}`}
      >
        <Library className="w-6 h-6" />
        <span className="text-[10px] font-medium">Mis Mods</span>
      </button>

      <button 
        onClick={() => setCurrentView('PROFILE')}
        className={`flex flex-col items-center gap-1 active:scale-95 transition-transform ${currentView === 'PROFILE' ? 'text-purple-400' : 'text-slate-500'}`}
      >
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium">Perfil</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans relative">
      <main className="w-full">
        {renderView()}
      </main>
      
      {/* Conditionally render Navbar so it doesn't obstruct Fullscreen Details */}
      {currentView !== 'DETAIL' && <BottomNav />}
    </div>
  );
};

export default App;