import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GifGrid } from './components/GifGrid';
import { GifDetail } from './components/GifDetail';
import { UploadModal } from './components/UploadModal';
import { AdminPanel } from './components/AdminPanel';
import { LoginView } from './components/LoginView';
import { UserDashboard } from './components/UserDashboard';
import { StaticPages } from './components/StaticPages';
import { TRENDING_GIFS, CATEGORIES, MOCK_USERS_LIST, generateMockGifs } from './constants';
import { Gif, User, ViewState, GeneratedMetadata, IntegrationConfig } from './types';
import { Zap, TrendingUp, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [gifs, setGifs] = useState<Gif[]>(TRENDING_GIFS);
  const [selectedGif, setSelectedGif] = useState<Gif | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null); // Start logged out
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS_LIST); // State for all users in Admin Panel
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('Reactions');
  
  // SEO & Integrations State
  const [integrations, setIntegrations] = useState<IntegrationConfig>({
    googleAdsense: '',
    googleSearchConsole: '',
    googleAnalytics: ''
  });

  // Enforce Dark Mode on Mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Load Integrations from LocalStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('giphyai_integrations');
    if (savedConfig) {
      setIntegrations(JSON.parse(savedConfig));
    }
  }, []);

  // Filter helper to show only approved GIFs in public views
  const getApprovedGifs = () => gifs.filter(g => g.status === 'approved');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setView('SEARCH');
    // Simulate Search Filtering on approved GIFs only
    const allApproved = getApprovedGifs();
    const filtered = allApproved.filter(g => 
       g.title.toLowerCase().includes(query.toLowerCase()) || 
       g.tags.some(t => t.includes(query.toLowerCase()))
    );
    setGifs(filtered.length > 0 ? filtered : allApproved); // Fallback to all for demo if empty
  };

  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);
    setView('CATEGORY');
    window.scrollTo(0, 0);
  };

  const handleLoadMore = () => {
    // Generate next batch using current length as offset to ensure unique IDs
    const nextBatch = generateMockGifs(20, gifs.length);
    setGifs(prev => [...prev, ...nextBatch]);
  };

  const handleGifClick = (gif: Gif) => {
    setSelectedGif(gif);
    setView('DETAIL');
    window.scrollTo(0,0);
  };

  const handleUploadClick = () => {
    if (user) {
      setIsUploadOpen(true);
    } else {
      setPendingUpload(true);
      setView('LOGIN');
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (pendingUpload) {
      setIsUploadOpen(true);
      setPendingUpload(false);
      setView('HOME');
    } else {
      // Direct new users to dashboard or home? Let's go Home but they can click profile
      setView('HOME');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('HOME');
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const oldUsername = user.username;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);

    // If username changed, update all GIFs belonging to this user
    if (updatedData.username && updatedData.username !== oldUsername) {
      setGifs(prev => prev.map(g => 
        g.username === oldUsername 
          ? { ...g, username: updatedData.username!, userAvatar: updatedData.avatarUrl || g.userAvatar } 
          : g
      ));
    }
    // If avatar changed but username didn't, still update avatars
    if (updatedData.avatarUrl && updatedData.avatarUrl !== user.avatarUrl) {
      setGifs(prev => prev.map(g => 
        g.username === user.username 
          ? { ...g, userAvatar: updatedData.avatarUrl! } 
          : g
      ));
    }
  };

  const handleUploadComplete = (data: GeneratedMetadata & { url: string; category: string }) => {
    const newGif: Gif = {
      id: `new-${Date.now()}`,
      title: data.title,
      url: data.url,
      fullUrl: data.url,
      width: 400,
      height: 400,
      username: user?.username || 'Guest',
      userAvatar: user?.avatarUrl || MOCK_USERS_LIST[0].avatarUrl,
      tags: data.tags,
      views: 0,
      likes: 0,
      isVerified: false,
      uploadedAt: new Date().toISOString(),
      status: 'pending', // New uploads are pending by default
      category: data.category
    };
    
    // Add to local state
    setGifs([newGif, ...gifs]);
    setIsUploadOpen(false);
    
    // Show an alert or notification (simulated)
    alert('Upload successful! Your GIF is pending approval by an admin.');
    // Redirect to Dashboard so they can see their pending upload
    setView('DASHBOARD');
  };

  const handleDeleteGif = (id: string) => {
    setGifs(gifs.filter(g => g.id !== id));
  };

  const handleApproveGif = (id: string) => {
    setGifs(gifs.map(g => g.id === id ? { ...g, status: 'approved' } : g));
  };

  const handleAddUser = (newUser: User) => {
    setAllUsers(prev => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAddGif = (newGif: Gif) => {
    setGifs(prev => [newGif, ...prev]);
  };

  const handleSaveIntegrations = (config: IntegrationConfig) => {
    setIntegrations(config);
    localStorage.setItem('giphyai_integrations', JSON.stringify(config));
    console.log("Injecting scripts into head:", config);
    alert("Integrations saved! Scripts will be active on the site.");
  };

  const renderContent = () => {
    switch (view) {
      case 'LOGIN':
        return (
          <LoginView 
            onLogin={handleLoginSuccess} 
            onCancel={() => {
              setPendingUpload(false);
              setView('HOME');
            }} 
          />
        );

      case 'DETAIL':
        return selectedGif ? <GifDetail gif={selectedGif} onBack={() => setView('HOME')} /> : null;
      
      case 'SEARCH':
        return (
          <div className="max-w-7xl mx-auto py-8">
            <h2 className="text-2xl font-bold px-4 mb-6 flex items-center gap-2">
              <SearchHeader query={searchQuery} />
            </h2>
            {/* Note: In Search we only show Approved GIFs */}
            <GifGrid gifs={gifs.filter(g => g.status === 'approved')} onGifClick={handleGifClick} />
            {gifs.filter(g => g.status === 'approved').length === 0 && <p className="text-center text-gray-500 mt-10">No GIFs found.</p>}
          </div>
        );

      case 'CATEGORY':
        // Filter by category
        const categoryGifs = getApprovedGifs().filter(g => 
          g.category === currentCategory || 
          // Fallback to tags for old data compatibility
          g.tags.some(tag => tag.toLowerCase() === currentCategory.toLowerCase())
        );
        
        return (
           <div className="max-w-7xl mx-auto py-8 animate-fade-in">
             <div className="px-4 mb-8">
               <h2 className="text-3xl font-black italic mb-2 uppercase text-gray-900 dark:text-white">{currentCategory}</h2>
               <p className="text-gray-600 dark:text-gray-400">The best {currentCategory.toLowerCase()} GIFs for every moment.</p>
             </div>
             {categoryGifs.length > 0 ? (
               <GifGrid gifs={categoryGifs} onGifClick={handleGifClick} onLoadMore={handleLoadMore} />
             ) : (
               <div className="text-center py-20 text-gray-500">
                 No GIFs found in this category yet. Be the first to upload!
               </div>
             )}
           </div>
        );

      case 'DASHBOARD':
        return user ? (
          <UserDashboard 
            user={user}
            userGifs={gifs.filter(g => g.username === user.username)}
            onUpdateProfile={handleUpdateProfile}
            onDeleteGif={handleDeleteGif}
            onGoToAdmin={() => setView('ADMIN')}
            onLogout={handleLogout}
          />
        ) : (
           // Redirect if not logged in
           <div className="flex flex-col items-center justify-center min-h-[50vh]">
             <p className="text-xl mb-4 text-gray-900 dark:text-white">Please log in to access Dashboard.</p>
             <button onClick={() => setView('LOGIN')} className="bg-brand-purple px-6 py-2 rounded-sm font-bold text-white">Log In</button>
           </div>
        );

      case 'ADMIN':
        return user ? (
          <AdminPanel 
            gifs={gifs} 
            user={user}
            allUsers={allUsers}
            onDeleteGif={handleDeleteGif}
            onApproveGif={handleApproveGif}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onAddGif={handleAddGif}
            initialIntegrations={integrations}
            onSaveIntegrations={handleSaveIntegrations}
          />
        ) : (
           <div className="flex flex-col items-center justify-center min-h-[50vh]">
             <p className="text-xl mb-4 text-gray-900 dark:text-white">Please log in to access Admin Panel.</p>
             <button onClick={() => setView('LOGIN')} className="bg-brand-purple px-6 py-2 rounded-sm font-bold text-white">Log In</button>
           </div>
        );
      
      // Static Pages
      case 'ABOUT':
      case 'CONTACT':
      case 'PRIVACY':
      case 'TERMS':
        return <StaticPages type={view} />;

      case 'HOME':
      default:
        return (
          <div className="max-w-[1400px] mx-auto py-6">
            
            {/* Featured Carousel Mockup */}
            <div className="px-4 mb-8 hidden md:block">
              <div className="bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 rounded-lg h-64 relative overflow-hidden flex items-center border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
                <div className="p-8 relative z-10 max-w-lg">
                   <span className="text-brand-purple dark:text-brand-green font-bold text-xs tracking-widest uppercase mb-2 block">Featured</span>
                   <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">Create & Share Your Own GIFs</h2>
                   <button 
                    onClick={handleUploadClick}
                    className="bg-brand-blue hover:bg-brand-blue/90 text-black font-bold py-3 px-6 rounded-sm transition-transform hover:scale-105"
                   >
                     Get Started
                   </button>
                </div>
                <div className="absolute right-0 top-0 h-full w-2/3 opacity-10 dark:opacity-30">
                   <img src="https://picsum.photos/seed/featured/800/400" className="w-full h-full object-cover" alt="Featured" />
                </div>
              </div>
            </div>

            {/* Trending Header */}
            <div className="flex items-center justify-between px-4 mb-6">
               <h2 className="text-xl font-bold flex items-center text-brand-blue">
                 <TrendingUp className="mr-2" size={24} /> Trending Now
               </h2>
            </div>
            
            {/* Only pass approved GIFs to Grid */}
            <GifGrid gifs={getApprovedGifs()} onGifClick={handleGifClick} onLoadMore={handleLoadMore} />

            {/* Categories Strip */}
            <div className="px-4 py-8">
               <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white mb-6">
                  <Layers className="mr-2 text-brand-purple" size={24} /> Popular Categories
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {CATEGORIES.map(cat => (
                    <div 
                      key={cat.id} 
                      className="relative h-24 rounded-md overflow-hidden cursor-pointer group"
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                       <img src={cat.coverUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="font-bold text-white text-lg drop-shadow-md">{cat.name}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white font-sans selection:bg-brand-purple selection:text-white flex flex-col transition-colors duration-300">
      <Navbar 
        user={user} 
        onSearch={handleSearch} 
        onNavigate={setView}
        onUploadClick={handleUploadClick}
        onLoginClick={() => setView('LOGIN')}
        onCategoryClick={handleCategoryClick}
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-black py-12 border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
           <div>
             <div className="mb-4">
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Giphy-logo.svg" alt="GIPHY" className="h-8 dark:invert" />
             </div>
             <p className="text-gray-600 dark:text-gray-500 text-sm">
               GIPHY AI is your top source for the best & newest GIFs & Animated Stickers online. Find everything from funny GIFs, reaction GIFs, unique GIFs and more.
             </p>
           </div>
           
           <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">GIPHY AI</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-500 text-sm">
                <li><button onClick={() => { setView('ABOUT'); window.scrollTo(0,0); }} className="hover:text-brand-purple text-left">About Us</button></li>
                <li><button onClick={() => { setView('CONTACT'); window.scrollTo(0,0); }} className="hover:text-brand-purple text-left">Contact Us</button></li>
              </ul>
           </div>
           
           <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-500 text-sm">
                <li><button onClick={() => { setView('PRIVACY'); window.scrollTo(0,0); }} className="hover:text-brand-blue text-left">Privacy Policy</button></li>
                <li><button onClick={() => { setView('TERMS'); window.scrollTo(0,0); }} className="hover:text-brand-blue text-left">Terms & Conditions</button></li>
              </ul>
           </div>
           
           <div className="flex items-end">
              <p className="text-xs text-gray-500 dark:text-gray-600">© 2025 GIPHY AI, Inc.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

const SearchHeader = ({ query }: { query: string }) => (
  <>
    <span className="text-gray-500 dark:text-gray-400 font-normal">Results for</span>
    <span className="text-gray-900 dark:text-white">"{query}"</span>
  </>
);

export default App;