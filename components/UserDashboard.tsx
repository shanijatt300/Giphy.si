import React, { useState } from 'react';
import { User, Gif } from '../types';
import { Settings, Image as ImageIcon, CheckCircle, Clock, Trash2, Shield, LogOut } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  userGifs: Gif[];
  onUpdateProfile: (updatedUser: Partial<User>) => void;
  onDeleteGif: (id: string) => void;
  onGoToAdmin: () => void;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, 
  userGifs, 
  onUpdateProfile, 
  onDeleteGif,
  onGoToAdmin,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'uploads'>('profile');
  
  // Profile Form State
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateProfile({ username, bio, avatarUrl });
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-10 pb-10 border-b border-gray-200 dark:border-gray-800">
         <div className="relative group">
            <img src={user.avatarUrl} alt={user.username} className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover" />
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => setActiveTab('profile')}>
               <Settings className="text-white" />
            </div>
         </div>
         <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{user.username}</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg">{user.bio || 'No bio yet.'}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
               <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-sm text-sm font-bold border border-gray-200 dark:border-gray-700">
                  <span className="text-brand-purple">{userGifs.length}</span> Uploads
               </div>
               {user.isAdmin && (
                 <button onClick={onGoToAdmin} className="bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-sm text-sm font-bold flex items-center space-x-2 hover:bg-brand-blue/20">
                    <Shield size={16} /> <span>Admin Panel</span>
                 </button>
               )}
            </div>
         </div>
         <button onClick={onLogout} className="text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 font-bold text-sm flex items-center space-x-2">
            <LogOut size={16} /> <span>Log Out</span>
         </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-800 mb-8">
         <button 
           onClick={() => setActiveTab('profile')}
           className={`pb-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'profile' ? 'border-brand-purple text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
         >
           Profile Settings
         </button>
         <button 
           onClick={() => setActiveTab('uploads')}
           className={`pb-4 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'uploads' ? 'border-brand-purple text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
         >
           My Uploads
         </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'profile' && (
           <div className="max-w-2xl">
             <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                   <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-2">Display Name</label>
                   <input 
                     type="text" 
                     value={username} 
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-purple outline-none"
                   />
                </div>
                <div>
                   <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-2">Bio</label>
                   <textarea 
                     value={bio} 
                     onChange={(e) => setBio(e.target.value)}
                     rows={3}
                     className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-purple outline-none resize-none"
                     placeholder="Tell us about yourself..."
                   />
                </div>
                <div>
                   <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-2">Avatar URL</label>
                   <input 
                     type="text" 
                     value={avatarUrl} 
                     onChange={(e) => setAvatarUrl(e.target.value)}
                     className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-purple outline-none"
                     placeholder="https://..."
                   />
                   <p className="text-xs text-gray-500 mt-1">Paste a direct image link for your avatar.</p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold px-8 py-3 rounded-sm disabled:opacity-50 transition-colors shadow-lg"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
             </form>
           </div>
        )}

        {activeTab === 'uploads' && (
           <div>
              {userGifs.length === 0 ? (
                 <div className="text-center py-20 bg-gray-100 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                    <ImageIcon className="mx-auto text-gray-500 mb-4" size={48} />
                    <p className="text-gray-500">You haven't uploaded any GIFs yet.</p>
                 </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-gray-50 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                         <th className="p-4">GIF</th>
                         <th className="p-4">Title</th>
                         <th className="p-4">Status</th>
                         <th className="p-4">Date</th>
                         <th className="p-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {userGifs.map(gif => (
                         <tr key={gif.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="p-4">
                               <img src={gif.url} alt="" className="w-20 h-16 object-cover rounded bg-gray-200 dark:bg-gray-800" />
                            </td>
                            <td className="p-4 font-bold text-sm text-gray-900 dark:text-white">{gif.title}</td>
                            <td className="p-4">
                               {gif.status === 'approved' && (
                                 <span className="inline-flex items-center space-x-1 text-green-600 dark:text-green-400 text-xs font-bold uppercase bg-green-100 dark:bg-green-400/10 px-2 py-1 rounded">
                                   <CheckCircle size={12} /> <span>Live</span>
                                 </span>
                               )}
                               {gif.status === 'pending' && (
                                 <span className="inline-flex items-center space-x-1 text-yellow-600 dark:text-yellow-400 text-xs font-bold uppercase bg-yellow-100 dark:bg-yellow-400/10 px-2 py-1 rounded">
                                   <Clock size={12} /> <span>Pending</span>
                                 </span>
                               )}
                               {gif.status === 'rejected' && (
                                 <span className="inline-flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs font-bold uppercase bg-red-100 dark:bg-red-400/10 px-2 py-1 rounded">
                                   <Shield size={12} /> <span>Rejected</span>
                                 </span>
                               )}
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                              {new Date(gif.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                               <button 
                                 onClick={() => onDeleteGif(gif.id)}
                                 className="text-gray-400 hover:text-red-500 transition-colors"
                                 title="Delete"
                               >
                                  <Trash2 size={18} />
                               </button>
                            </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};