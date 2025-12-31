import React, { useState } from 'react';
import { Gif } from '../types';
import { Link as LinkIcon, Download, Flag, Loader } from 'lucide-react';

interface GifDetailProps {
  gif: Gif;
  onBack: () => void;
}

export const GifDetail: React.FC<GifDetailProps> = ({ gif, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(gif.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Fetch the image as a blob to force download
      const response = await fetch(gif.fullUrl);
      const blob = await response.blob();
      
      // Create a temporary link element
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Determine file extension
      const extension = gif.fullUrl.split('.').pop()?.split('?')[0] || 'gif'; // Default to gif or extract from URL
      const filename = `${gif.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_giphyai.${extension}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: Open in new tab if CORS prevents blob download
      window.open(gif.fullUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2 text-sm font-bold transition-colors"
      >
        ← Back to Browse
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: User & Source */}
        <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
          <div className="flex items-center space-x-3">
             <img src={gif.userAvatar} alt={gif.username} className="w-12 h-12 rounded-full border-2 border-brand-purple" />
             <div>
               <h3 className="font-bold text-gray-900 dark:text-white">{gif.username}</h3>
               {gif.isVerified && <p className="text-xs text-brand-blue uppercase font-bold tracking-wider">Verified Source</p>}
             </div>
          </div>
          
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            <p className="mb-2">Uploaded on {new Date(gif.uploadedAt).toLocaleDateString()}</p>
            <p>{gif.views.toLocaleString()} Views</p>
          </div>
        </div>

        {/* Center Column: The GIF */}
        <div className="lg:col-span-6 order-1 lg:order-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">{gif.title}</h1>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-sm overflow-hidden relative group border border-gray-200 dark:border-gray-800">
               <img src={gif.fullUrl} alt={gif.title} className="w-full h-auto object-contain max-h-[600px] mx-auto" />
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-bold mr-2">Tags:</span>
              {gif.tags.map(tag => (
                <span key={tag} className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-3 order-3 space-y-4">
           <div className="space-y-2">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Actions</h3>
             
             <button 
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between px-4 py-3 bg-brand-purple hover:bg-brand-purple/90 rounded-sm font-bold text-white transition-colors"
             >
                <div className="flex items-center space-x-2">
                  <LinkIcon size={18} /> <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </div>
             </button>

             <button 
               onClick={handleDownload}
               disabled={isDownloading}
               className="w-full flex items-center justify-between px-4 py-3 bg-brand-green hover:bg-brand-green/90 text-black rounded-sm font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
             >
                <div className="flex items-center space-x-2">
                  {isDownloading ? <Loader size={18} className="animate-spin" /> : <Download size={18} />}
                  <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                </div>
             </button>
           </div>
           
           <div className="pt-8">
             <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 text-sm font-semibold">
               <Flag size={14} /> <span>Report this GIF</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};