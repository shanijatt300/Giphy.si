import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { MOCK_USER } from '../constants';

interface LoginViewProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form State
  const [identifier, setIdentifier] = useState(''); // Handles Username or Email
  const [password, setPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      // Simulate Sign Up - Create a new regular user
      const newUser: User = {
        id: `u-${Date.now()}`,
        username: signupUsername || 'New User',
        avatarUrl: `https://ui-avatars.com/api/?name=${signupUsername || 'User'}&background=random`,
        isAdmin: false
      };
      onLogin(newUser);
    } else {
      // Login Logic
      if (identifier === 'admin' && password === '12345678') {
        // Admin Login Success - Use the mock admin user or create one
        const adminUser: User = {
          ...MOCK_USER,
          username: 'Admin',
          isAdmin: true
        };
        onLogin(adminUser);
      } else {
        // Regular User Login (Demo Mode: Allow any other credentials as a standard user)
        const regularUser: User = {
          id: 'u-guest',
          username: identifier || 'User',
          avatarUrl: `https://ui-avatars.com/api/?name=${identifier || 'User'}&background=random`,
          isAdmin: false
        };
        onLogin(regularUser);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-brand-blue to-brand-purple rounded-xl mx-auto flex items-center justify-center mb-4">
             <UserIcon size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isSignUp ? 'Join GIPHYCLONE' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isSignUp ? 'Create an account to upload and share GIFs.' : 'Log in to manage your account.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp ? (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-purple outline-none" 
                placeholder="CreativeUser" 
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required 
              />
            </div>
          ) : (
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username or Email</label>
               <input 
                 type="text" 
                 className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-purple outline-none" 
                 placeholder="admin" 
                 value={identifier}
                 onChange={(e) => setIdentifier(e.target.value)}
                 required 
               />
             </div>
          )}
          
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <input type="email" className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-purple outline-none" placeholder="you@example.com" required />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-purple outline-none" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-3 rounded-sm transition-colors mt-4 shadow-lg">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-brand-blue hover:underline font-bold">
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
          <button onClick={onCancel} className="mt-4 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};