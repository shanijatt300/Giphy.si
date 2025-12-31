import React, { useState } from 'react';
import { Gif, User, IntegrationConfig } from '../types';
import { Trash2, CheckCircle, BarChart2, Clock, Users, Plus, Shield, Sparkles, User as UserIcon, Palette, Sticker, Save, Loader, Settings, Code, Globe, Activity, Layers, Download } from 'lucide-react';
import { generateImageFromPrompt } from '../services/geminiService';
import { CATEGORIES } from '../constants';

interface AdminPanelProps {
  gifs: Gif[];
  user: User;
  allUsers: User[];
  onDeleteGif: (id: string) => void;
  onApproveGif: (id: string) => void;
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onAddGif: (gif: Gif) => void;
  initialIntegrations: IntegrationConfig;
  onSaveIntegrations: (config: IntegrationConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  gifs, 
  user, 
  allUsers,
  onDeleteGif, 
  onApproveGif,
  onAddUser,
  onDeleteUser,
  onAddGif,
  initialIntegrations,
  onSaveIntegrations
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'ai-studio' | 'integrations'>('content');
  const [showAddUser, setShowAddUser] = useState(false);
  
  // Add User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  // AI Studio State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<'sticker' | 'general'>('sticker');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);

  // Integration State
  const [integrations, setIntegrations] = useState<IntegrationConfig>(initialIntegrations);

  if (!user.isAdmin) return <div className="p-10 text-center text-red-500">Access Denied</div>;

  const pendingCount = gifs.filter(g => g.status === 'pending').length;
  const approvedCount = gifs.filter(g => g.status === 'approved').length;

  // Sort GIFs: Pending first, then by date
  const sortedGifs = [...gifs].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: newUsername,
      avatarUrl: `https://ui-avatars.com/api/?name=${newUsername}&background=random`,
      isAdmin: newIsAdmin,
      bio: 'New user added by admin.'
    };

    onAddUser(newUser);
    setNewUsername('');
    setNewIsAdmin(false);
    setShowAddUser(false);
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    
    const result = await generateImageFromPrompt(aiPrompt, generationType);
    
    if (result) {
      setGeneratedImage(result);
    } else {
      alert("Failed to generate image. Please check API key configuration.");
    }
    setIsGenerating(false);
  };

  const handleSaveGenerated = () => {
    if (!generatedImage) return;
    
    const newGif: Gif = {
      id: `gen-${Date.now()}`,
      title: aiPrompt,
      url: generatedImage,
      fullUrl: generatedImage,
      width: 512,
      height: 512,
      username: 'Giphy AI Bot',
      userAvatar: 'https://ui-avatars.com/api/?name=AI&background=6157ff&color=fff',
      tags: ['ai-generated', generationType],
      views: 0,
      likes: 0,
      isVerified: true,
      uploadedAt: new Date().toISOString(),
      status: 'approved',
      category: selectedCategory
    };

    onAddGif(newGif);
    alert('Saved to Gallery successfully!');
    setGeneratedImage(null);
    setAiPrompt('');
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `giphy-ai-${generationType}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center space-x-3 text-gray-900 dark:text-white">
          <BarChart2 className="text-brand-green" /> <span>Admin Dashboard</span>
        </h1>
        
        {/* Tab Switcher */}
        <div className="flex space-x-2 bg-gray-200 dark:bg-gray-900 p-1 rounded-lg overflow-x-auto border border-gray-300 dark:border-gray-700">
           <button 
             onClick={() => setActiveTab('content')}
             className={`px-4 py-2 rounded-md font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'content' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
           >
             GIF Content
           </button>
           <button 
             onClick={() => setActiveTab('users')}
             className={`px-4 py-2 rounded-md font-bold text-sm transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
           >
             Manage Users
           </button>
           <button 
             onClick={() => setActiveTab('ai-studio')}
             className={`px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'ai-studio' ? 'bg-brand-purple text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-brand-purple'}`}
           >
             <Sparkles size={16}/> AI Studio
           </button>
           <button 
             onClick={() => setActiveTab('integrations')}
             className={`px-4 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'integrations' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'}`}
           >
             <Settings size={16}/> Integrations
           </button>
        </div>
      </div>

      {activeTab === 'content' && (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
               <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase text-sm mb-2">Total GIFs</h3>
               <p className="text-4xl font-black text-gray-900 dark:text-white">{gifs.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
               <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase text-sm mb-2">Live (Approved)</h3>
               <p className="text-4xl font-black text-brand-blue">{approvedCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
               <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase text-sm mb-2">Pending Review</h3>
               <p className="text-4xl font-black text-brand-pink">{pendingCount}</p>
            </div>
          </div>

          {/* Content Management */}
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
             <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Manage GIF Content</h2>
                <div className="flex items-center space-x-2">
                   <span className="text-xs text-gray-500 dark:text-gray-400">Pending items are shown first</span>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-black/20">
                     <th className="p-4">Status</th>
                     <th className="p-4">Preview</th>
                     <th className="p-4">Title</th>
                     <th className="p-4">Category</th>
                     <th className="p-4">User</th>
                     <th className="p-4">Stats</th>
                     <th className="p-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {sortedGifs.map(gif => (
                     <tr key={gif.id} className={`border-b border-gray-200 dark:border-gray-800 transition-colors ${gif.status === 'pending' ? 'bg-brand-purple/5 dark:bg-brand-purple/10 hover:bg-brand-purple/10 dark:hover:bg-brand-purple/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                       <td className="p-4">
                         {gif.status === 'pending' ? (
                           <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase">
                             <Clock size={12} /> <span>Pending</span>
                           </span>
                         ) : (
                           <span className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase">
                             <CheckCircle size={12} /> <span>Live</span>
                           </span>
                         )}
                       </td>
                       <td className="p-4">
                         <img src={gif.url} className="w-16 h-12 object-cover rounded bg-gray-200 dark:bg-gray-700" alt="" />
                       </td>
                       <td className="p-4 font-medium text-gray-900 dark:text-white">{gif.title}</td>
                       <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                          {gif.category && (
                             <span className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">{gif.category}</span>
                          )}
                       </td>
                       <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{gif.username}</td>
                       <td className="p-4 text-xs text-gray-500">
                          {gif.views} views<br/>{gif.likes} likes
                       </td>
                       <td className="p-4 text-right">
                         <div className="flex justify-end space-x-2">
                           {gif.status === 'pending' && (
                             <button 
                                onClick={() => onApproveGif(gif.id)} 
                                className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold text-xs transition-colors"
                                title="Approve and Make Live"
                             >
                                <CheckCircle size={14} /> <span>Approve</span>
                             </button>
                           )}
                           <button onClick={() => onDeleteGif(gif.id)} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50" title="Delete">
                              <Trash2 size={16} />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white"><Users size={20}/> Manage Users</h2>
              <button 
                onClick={() => setShowAddUser(!showAddUser)}
                className="bg-brand-blue hover:bg-brand-blue/90 text-black px-4 py-2 rounded-sm font-bold text-sm flex items-center space-x-2 transition-colors"
              >
                {showAddUser ? <span className="flex items-center gap-1"><Trash2 size={16}/> Cancel</span> : <span className="flex items-center gap-1"><Plus size={16}/> Add User</span>}
              </button>
           </div>

           {/* Add User Form */}
           {showAddUser && (
             <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 animate-fade-in">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Add New User</h3>
                <form onSubmit={handleCreateUser} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                     <input 
                       type="text" 
                       value={newUsername}
                       onChange={(e) => setNewUsername(e.target.value)}
                       className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white focus:border-brand-blue outline-none"
                       placeholder="Enter username"
                       required
                     />
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                     <input 
                       type="checkbox" 
                       id="isAdmin" 
                       checked={newIsAdmin} 
                       onChange={(e) => setNewIsAdmin(e.target.checked)} 
                       className="w-5 h-5 rounded accent-brand-blue" 
                     />
                     <label htmlFor="isAdmin" className="text-sm font-bold text-gray-700 dark:text-gray-300 select-none">Grant Admin Access</label>
                  </div>
                  <button type="submit" className="bg-brand-green hover:bg-brand-green/90 text-black font-bold px-6 py-2 rounded-sm w-full md:w-auto">
                    Create User
                  </button>
                </form>
             </div>
           )}

           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-black/20">
                   <th className="p-4">User</th>
                   <th className="p-4">Role</th>
                   <th className="p-4">Bio</th>
                   <th className="p-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {allUsers.map(u => (
                   <tr key={u.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                         <img src={u.avatarUrl} alt={u.username} className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                         <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{u.username}</p>
                            <p className="text-xs text-gray-500">ID: {u.id}</p>
                         </div>
                      </td>
                      <td className="p-4">
                         {u.isAdmin ? (
                            <span className="inline-flex items-center space-x-1 text-brand-purple bg-brand-purple/10 px-2 py-1 rounded text-xs font-bold uppercase">
                               <Shield size={12}/> <span>Admin</span>
                            </span>
                         ) : (
                            <span className="inline-flex items-center space-x-1 text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs font-bold uppercase">
                               <UserIcon size={12}/> <span>User</span>
                            </span>
                         )}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs">{u.bio || '-'}</td>
                      <td className="p-4 text-right">
                         <button 
                           onClick={() => onDeleteUser(u.id)} 
                           disabled={u.id === user.id} // Prevent deleting self
                           className={`p-2 rounded transition-colors ${u.id === user.id ? 'opacity-30 cursor-not-allowed text-gray-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'}`} 
                           title="Delete User"
                         >
                            <Trash2 size={16} />
                         </button>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'ai-studio' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 min-h-[500px] flex flex-col shadow-sm">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
               <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white"><Sparkles size={20} className="text-brand-purple"/> AI Generation Studio</h2>
               <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create stickers or custom images using advanced Gemini AI.</p>
            </div>
            
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
               {/* Controls */}
               <div className="md:col-span-5 space-y-8">
                  {/* Tool Selection */}
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => { setGenerationType('sticker'); setGeneratedImage(null); }}
                       className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 transition-all ${generationType === 'sticker' ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}`}
                     >
                       <Sticker size={32} />
                       <span className="font-bold text-sm">Sticker Maker</span>
                     </button>
                     <button 
                       onClick={() => { setGenerationType('general'); setGeneratedImage(null); }}
                       className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 transition-all ${generationType === 'general' ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}`}
                     >
                       <Palette size={32} />
                       <span className="font-bold text-sm">Universal Creator</span>
                     </button>
                  </div>

                  {/* Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                       {generationType === 'sticker' ? 'What sticker do you want?' : 'Describe what to create'}
                    </label>
                    <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={generationType === 'sticker' ? "e.g., A cool cat wearing sunglasses, skateboarding" : "e.g., A futuristic cyberpunk city at night with neon lights"}
                      className="w-full h-32 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-gray-900 dark:text-white focus:border-brand-purple dark:focus:border-white outline-none resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all text-white ${isGenerating ? 'opacity-50 cursor-not-allowed bg-gray-700' : 'bg-gradient-to-r from-brand-purple to-brand-blue hover:brightness-110'}`}
                  >
                     {isGenerating ? <><Loader className="animate-spin" /> <span>Generating...</span></> : <><Sparkles /> <span>Generate {generationType === 'sticker' ? 'Sticker' : 'Image'}</span></>}
                  </button>
               </div>

               {/* Output */}
               <div className="md:col-span-7 bg-gray-100 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-4 relative min-h-[400px]">
                  {generatedImage ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                       <img src={generatedImage} alt="Generated" className="max-h-[400px] w-auto object-contain rounded-lg shadow-2xl mb-4" />
                       
                       <div className="w-full max-w-sm mb-4">
                           <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              <Layers size={10} className="inline mr-1" /> Save to Category
                           </label>
                           <select 
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white focus:border-brand-purple outline-none"
                           >
                              {CATEGORIES.map(cat => (
                                 <option key={cat.id} value={cat.name}>{cat.name}</option>
                              ))}
                           </select>
                       </div>

                       <div className="flex gap-4">
                         <button 
                            onClick={handleSaveGenerated}
                            className="bg-brand-green hover:bg-brand-green/90 text-black px-4 py-2 rounded-full font-bold flex items-center space-x-2 text-sm"
                         >
                            <Save size={16} /> <span>Save to App</span>
                         </button>
                         <button 
                            onClick={handleDownloadImage}
                            className="bg-brand-blue hover:bg-brand-blue/90 text-black px-4 py-2 rounded-full font-bold flex items-center space-x-2 text-sm"
                         >
                            <Download size={16} /> <span>Download</span>
                         </button>
                         <button 
                            onClick={() => setGeneratedImage(null)}
                            className="bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-full font-bold text-sm"
                         >
                            Discard
                         </button>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-600">
                       <div className="w-20 h-20 bg-gray-200 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                         {generationType === 'sticker' ? <Sticker size={40} /> : <Palette size={40} />}
                       </div>
                       <p>Your creation will appear here.</p>
                    </div>
                  )}
               </div>
            </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white"><Settings size={20} className="text-blue-500"/> Site Integrations</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage external scripts for Analytics, Ads, and Search Console.</p>
           </div>
           
           <div className="p-6 space-y-6">
              {/* Google AdSense */}
              <div className="bg-gray-50 dark:bg-black/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded text-yellow-600 dark:text-yellow-500">
                      <Code size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Google AdSense</h3>
                 </div>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Paste your AdSense verification code snippet here. It will be injected into the site header.</p>
                 <textarea 
                    value={integrations.googleAdsense}
                    onChange={(e) => setIntegrations({...integrations, googleAdsense: e.target.value})}
                    placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-..." crossorigin="anonymous"></script>'
                    className="w-full h-24 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm focus:border-yellow-500 outline-none resize-none"
                 />
              </div>

              {/* Google Search Console */}
              <div className="bg-gray-50 dark:bg-black/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded text-blue-600 dark:text-blue-500">
                      <Globe size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Google Search Console</h3>
                 </div>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Paste your meta verification tag here.</p>
                 <textarea 
                    value={integrations.googleSearchConsole}
                    onChange={(e) => setIntegrations({...integrations, googleSearchConsole: e.target.value})}
                    placeholder='<meta name="google-site-verification" content="..." />'
                    className="w-full h-24 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm focus:border-blue-500 outline-none resize-none"
                 />
              </div>

              {/* Google Analytics */}
              <div className="bg-gray-50 dark:bg-black/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                 <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded text-orange-600 dark:text-orange-500">
                      <Activity size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Google Analytics (G4)</h3>
                 </div>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Paste your Global Site Tag (gtag.js) here.</p>
                 <textarea 
                    value={integrations.googleAnalytics}
                    onChange={(e) => setIntegrations({...integrations, googleAnalytics: e.target.value})}
                    placeholder={`<!-- Google tag (gtag.js) -->\n<script async src="..."></script>\n<script>...</script>`}
                    className="w-full h-32 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm focus:border-orange-500 outline-none resize-none"
                 />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                 <button 
                   onClick={() => onSaveIntegrations(integrations)}
                   className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3 px-8 rounded flex items-center gap-2 shadow-lg"
                 >
                   <Save size={18} /> Save Integration Settings
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};