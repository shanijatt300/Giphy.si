import React from 'react';
import { ViewState } from '../types';
import { Mail, Shield, FileText, Info } from 'lucide-react';

interface StaticPagesProps {
  type: ViewState;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case 'ABOUT':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Info className="text-brand-purple" size={40} /> About GIPHY AI
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to <strong>GIPHY AI</strong>, the world's newest destination for animated expression. 
              We are building a platform where visual communication transcends language barriers.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To animate the world's conversations. We believe that a GIF is worth a thousand words, 
                  and we provide the tools to search, share, and create the perfect reaction for every moment.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Powered</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Leveraging cutting-edge Gemini AI, we automatically tag and categorize content, 
                  making it easier than ever to find exactly what you're looking for.
                </p>
              </div>
            </div>
          </div>
        );

      case 'CONTACT':
        return (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Mail className="text-brand-blue" size={40} /> Contact Us
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Have a question, a copyright concern, or just want to say hi? We'd love to hear from you.
            </p>
            
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800 max-w-2xl mt-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Get in Touch</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Your Email</label>
                  <input type="email" placeholder="you@example.com" className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-blue outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Subject</label>
                  <select className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-blue outline-none">
                    <option>General Inquiry</option>
                    <option>Report Content</option>
                    <option>Partnership</option>
                    <option>Bug Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Message</label>
                  <textarea rows={5} placeholder="How can we help?" className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white focus:border-brand-blue outline-none resize-none" />
                </div>
                <button className="bg-brand-blue hover:bg-brand-blue/90 text-black font-bold py-3 px-8 rounded-sm shadow-lg transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        );

      case 'PRIVACY':
        return (
          <div className="space-y-6">
             <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Shield className="text-brand-green" size={40} /> Privacy Policy
            </h1>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6 shadow-sm text-gray-700 dark:text-gray-300">
               <p>Last updated: October 26, 2025</p>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h3>
               <p>We collect information you provide directly to us, such as when you create or modify your account, upload content, or communicate with us.</p>
               
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h3>
               <p>We use the information we collect to provide, maintain, and improve our services, including to personalize features and content and make suggestions for you.</p>

               <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. Data Retention</h3>
               <p>We store the information we collect for as long as it is necessary for the purpose(s) for which we originally collected it.</p>
            </div>
          </div>
        );

      case 'TERMS':
        return (
           <div className="space-y-6">
             <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <FileText className="text-brand-pink" size={40} /> Terms of Service
            </h1>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800 space-y-6 shadow-sm text-gray-700 dark:text-gray-300">
               <p>Please read these Terms of Service completely.</p>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h3>
               <p>By accessing and using GIPHY AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
               
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Content Guidelines</h3>
               <p>Users are responsible for the content they upload. Offensive, illegal, or copyrighted material without permission is strictly prohibited and will be removed.</p>

               <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. AI Usage</h3>
               <p>Our platform uses Artificial Intelligence to process and tag images. By using this service, you acknowledge that automated analysis may occur.</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in min-h-[60vh]">
      {renderContent()}
    </div>
  );
};