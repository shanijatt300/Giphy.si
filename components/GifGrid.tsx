import React from 'react';
import { Gif } from '../types';
import { Heart, Eye, Share2 } from 'lucide-react';

interface GifGridProps {
  gifs: Gif[];
  onGifClick: (gif: Gif) => void;
  onLoadMore?: () => void;
}

export const GifGrid: React.FC<GifGridProps> = ({ gifs, onGifClick, onLoadMore }) => {
  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 px-4 pb-12 space-y-4">
        {gifs.map((gif) => (
          <div 
            key={gif.id} 
            className="break-inside-avoid relative group rounded-lg overflow-hidden cursor-pointer bg-gray-200 dark:bg-brand-gray transition-transform hover:scale-[1.02]"
            onClick={() => onGifClick(gif)}
          >
            {/* Main Image */}
            <img 
              src={gif.url} 
              alt={gif.title}
              className="w-full h-auto object-cover block bg-gray-300 dark:bg-gray-800 min-h-[150px]"
              loading="lazy"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              
              <div className="flex justify-between items-end">
                <div className="flex items-center space-x-2 mb-2">
                  <img src={gif.userAvatar} alt={gif.username} className="w-6 h-6 rounded-full border border-white/50" />
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">{gif.username}</span>
                  {gif.isVerified && <span className="text-brand-blue text-[10px]">✔</span>}
                </div>
                
                <div className="flex space-x-2 mb-2">
                   <button className="text-white hover:text-brand-pink transition-colors">
                      <Heart size={18} />
                   </button>
                   <button className="text-white hover:text-brand-green transition-colors">
                      <Share2 size={18} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {onLoadMore && (
        <div className="flex justify-center pb-12">
          <button 
            onClick={onLoadMore}
            className="bg-white dark:bg-[#2e2e2e] hover:bg-gray-100 dark:hover:bg-[#3e3e3e] text-gray-900 dark:text-white font-bold py-3 px-10 rounded-full transition-colors border border-gray-300 dark:border-gray-700 hover:border-brand-purple flex items-center space-x-2 shadow-sm"
          >
            <span>Load More</span>
          </button>
        </div>
      )}
    </>
  );
};