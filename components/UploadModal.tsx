import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Loader, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { generateGifMetadata } from '../services/geminiService';
import { GeneratedMetadata } from '../types';
import { CATEGORIES } from '../constants';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (data: GeneratedMetadata & { url: string; category: string }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedMetadata | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  
  // Use a ref to prevent double-firing
  const analysisInProgress = useRef(false);

  // Automatically analyze when file is set
  useEffect(() => {
    if (file && !generatedData && !isAnalyzing && !analysisInProgress.current) {
      handleAnalyze();
    }
  }, [file]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setGeneratedData(null); // Reset previous data to trigger effect
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      analysisInProgress.current = true;
      setIsAnalyzing(true);
      
      const metadata = await generateGifMetadata(file);
      setGeneratedData(metadata);

    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
      analysisInProgress.current = false;
    }
  };

  const handleFinalUpload = () => {
    if (generatedData && preview) {
      // In a real app, we would upload the file to S3/Cloudinary here.
      // We pass the preview URL as the 'url' for this demo.
      onUploadComplete({ 
        ...generatedData, 
        url: preview,
        category: selectedCategory
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setGeneratedData(null);
    setSelectedCategory(CATEGORIES[0].name);
    analysisInProgress.current = false;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-lg max-w-2xl w-full border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525]">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <UploadCloud className="text-brand-purple" /> Upload to GIPHY AI
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!file ? (
             <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:border-brand-purple dark:hover:border-brand-purple transition-colors cursor-pointer group relative bg-gray-50 dark:bg-transparent">
               <input 
                  type="file" 
                  accept="image/*,video/mp4" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
               />
               <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-full mb-4 group-hover:bg-brand-purple transition-colors">
                 <UploadCloud size={32} className="text-gray-600 dark:text-white group-hover:text-white" />
               </div>
               <p className="text-lg font-bold mb-1 text-gray-900 dark:text-white">Drag and drop GIFs, MP4s</p>
               <p className="text-sm text-gray-500">or click to browse files</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Left: Preview */}
               <div>
                 <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Preview</p>
                 {preview && (
                   <div className="relative">
                     <img src={preview} alt="Preview" className="w-full rounded-md object-cover border border-gray-200 dark:border-gray-700 max-h-[300px]" />
                     <button onClick={() => setFile(null)} className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-red-500">
                        <X size={14} />
                     </button>
                   </div>
                 )}
                 <div className="mt-4">
                    <p className="text-xs text-gray-500">Filename: {file.name}</p>
                    <p className="text-xs text-gray-500">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                 </div>
               </div>

               {/* Right: AI Analysis */}
               <div className="flex flex-col h-full">
                 {!generatedData ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-black/20 p-6">
                       <div className="relative">
                         <div className="absolute inset-0 bg-brand-purple blur-xl opacity-20 rounded-full animate-pulse"></div>
                         <Sparkles className="text-brand-purple relative z-10 animate-bounce" size={48} />
                       </div>
                       <p className="text-gray-900 dark:text-white font-bold text-lg">AI Analysis in Progress...</p>
                       <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                         Gemini is analyzing your image to generate the best title, tags, and description.
                       </p>
                       <Loader className="animate-spin text-brand-blue" size={24} />
                    </div>
                 ) : (
                   <div className="space-y-4 animate-fade-in flex-1">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-brand-green uppercase flex items-center gap-1">
                           <Sparkles size={12}/> AI Generated
                         </span>
                         <button onClick={handleAnalyze} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                            <RefreshCw size={12}/> Regenerate
                         </button>
                      </div>
                      
                      {/* Category Selector */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                           <Layers size={10} className="inline mr-1" /> Category
                        </label>
                        <select 
                           value={selectedCategory}
                           onChange={(e) => setSelectedCategory(e.target.value)}
                           className="w-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white focus:border-brand-purple outline-none"
                        >
                           {CATEGORIES.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                           ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Title</label>
                        <input 
                          type="text" 
                          value={generatedData.title} 
                          onChange={(e) => setGeneratedData({...generatedData, title: e.target.value})}
                          className="w-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white focus:border-brand-purple outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {generatedData.tags.map((tag, idx) => (
                            <span key={idx} className="bg-gray-200 dark:bg-brand-gray px-2 py-1 rounded text-xs flex items-center group cursor-pointer text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700">
                              #{tag}
                              <button 
                                onClick={() => {
                                  const newTags = generatedData.tags.filter((_, i) => i !== idx);
                                  setGeneratedData({...generatedData, tags: newTags});
                                }}
                                className="ml-1 text-gray-500 hover:text-red-400 hidden group-hover:inline-block"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <button 
                            className="bg-transparent border border-gray-400 dark:border-gray-700 border-dashed px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-600 dark:hover:border-gray-500"
                            onClick={() => {
                               const tag = prompt("Add a tag:");
                               if (tag) setGeneratedData({...generatedData, tags: [...generatedData.tags, tag]});
                            }}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Description</label>
                         <textarea 
                           value={generatedData.description}
                           onChange={(e) => setGeneratedData({...generatedData, description: e.target.value})}
                           className="w-full bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white text-sm focus:border-brand-purple outline-none h-24 resize-none"
                         />
                      </div>
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {file && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] flex justify-end">
            <button 
              onClick={handleFinalUpload}
              disabled={!generatedData}
              className="bg-brand-purple hover:bg-brand-purple/90 px-8 py-2 rounded-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              Upload to Channel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};