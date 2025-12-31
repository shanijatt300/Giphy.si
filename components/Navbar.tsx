import React, { useState } from 'react';
import { Search, User as UserIcon, Upload, Menu, X, MoreVertical } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onSearch: (query: string) => void;
  onNavigate: (view: any) => void;
  onUploadClick: () => void;
  onLoginClick: () => void;
  onCategoryClick: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSearch, onNavigate, onUploadClick, onLoginClick, onCategoryClick }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  const handleCategorySelect = (category: string) => {
    onCategoryClick(category);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer pt-2" onClick={() => onNavigate('HOME')}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/Giphy-logo.svg" 
              alt="GIPHY" 
              className="h-10 w-auto dark:invert" 
            />
          </div>

          {/* Desktop Navigation Links (Left of Search) */}
          <div className="hidden md:flex items-center space-x-6 ml-6">
             <button onClick={() => onCategoryClick('Reactions')} className="text-sm font-semibold text-gray-700 dark:text-white hover:text-brand-purple transition-colors">Reactions</button>
             <button onClick={() => onCategoryClick('Entertainment')} className="text-sm font-semibold text-gray-700 dark:text-white hover:text-brand-blue transition-colors">Entertainment</button>
             <button onClick={() => onCategoryClick('Sports')} className="text-sm font-semibold text-gray-700 dark:text-white hover:text-brand-green transition-colors">Sports</button>
             <button onClick={() => onCategoryClick('Stickers')} className="text-sm font-semibold text-gray-700 dark:text-white hover:text-brand-pink transition-colors">Stickers</button>
             <button className="text-gray-500 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">
               <MoreVertical size={20} />
             </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Search all the GIFs and Stickers"
                className="w-full bg-gray-100 dark:bg-white text-black pl-4 pr-12 py-2.5 rounded-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple border border-gray-200 dark:border-transparent"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full w-12 bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center rounded-r-sm hover:brightness-110 transition-all"
              >
                <Search className="text-white" size={20} />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={onUploadClick}
              className="flex items-center space-x-1 bg-brand-purple hover:bg-brand-purple/90 px-4 py-2 rounded-sm font-bold text-sm transition-colors text-white"
            >
              <Upload size={16} />
              <span>Upload</span>
            </button>
            
            {user ? (
               <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('DASHBOARD')}>
                  <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600" />
                  <span className="text-sm font-medium hidden lg:block text-gray-700 dark:text-white">{user.username}</span>
               </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center space-x-1 text-gray-700 dark:text-white hover:text-brand-blue font-bold text-sm"
              >
                <UserIcon size={18} />
                <span>Log In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 p-4 space-y-4 shadow-lg">
          <button onClick={() => handleCategorySelect('Reactions')} className="block w-full text-left font-bold text-lg py-2 text-gray-800 dark:text-white hover:text-brand-purple">Reactions</button>
          <button onClick={() => handleCategorySelect('Entertainment')} className="block w-full text-left font-bold text-lg py-2 text-gray-800 dark:text-white hover:text-brand-blue">Entertainment</button>
          <button onClick={() => handleCategorySelect('Sports')} className="block w-full text-left font-bold text-lg py-2 text-gray-800 dark:text-white hover:text-brand-green">Sports</button>
          <button onClick={() => handleCategorySelect('Stickers')} className="block w-full text-left font-bold text-lg py-2 text-gray-800 dark:text-white hover:text-brand-pink">Stickers</button>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button 
                onClick={() => {onUploadClick(); setIsMobileMenuOpen(false)}}
                className="w-full bg-brand-purple py-3 rounded-sm font-bold mb-3 flex items-center justify-center space-x-2 text-white"
              >
              <Upload size={18} /> <span>Upload GIF</span>
            </button>
            {!user && (
              <button 
                onClick={() => {onLoginClick(); setIsMobileMenuOpen(false)}}
                className="w-full bg-gray-200 dark:bg-gray-800 py-3 rounded-sm font-bold flex items-center justify-center space-x-2 text-gray-900 dark:text-white"
              >
                <UserIcon size={18} /> <span>Log In</span>
              </button>
            )}
            {user && (
               <button 
                 onClick={() => {onNavigate('DASHBOARD'); setIsMobileMenuOpen(false)}}
                 className="w-full bg-gray-200 dark:bg-gray-800 py-3 rounded-sm font-bold flex items-center justify-center space-x-2 text-gray-900 dark:text-white"
               >
                 <UserIcon size={18} /> <span>My Dashboard</span>
               </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};