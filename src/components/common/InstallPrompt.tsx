'use client'

import React, { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Handler functions
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as any);
      // Show the install button
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      // Hide the prompt when installed
      setShowPrompt(false);
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      // Log the installation to analytics
      console.log('PWA was installed');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    
    // Hide our install UI regardless of outcome
    setShowPrompt(false);
    
    // Log the outcome to analytics
    console.log(`User ${outcome} the installation`);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-11/12 max-w-md bg-white rounded-lg shadow-lg z-50 p-4 border border-amber-200 animate-fadeIn">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-lg font-serif text-[#973B00]">Install Gita Guide</h3>
          <p className="text-sm text-gray-600 mt-1">
            Install this app on your device for quick access to divine wisdom anytime, even offline.
          </p>
        </div>
        <button 
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button 
          onClick={() => setShowPrompt(false)}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
        >
          Not now
        </button>
        <button 
          onClick={handleInstallClick}
          className="px-4 py-1.5 text-sm bg-[#973B00] text-white rounded-md hover:bg-[#BA4D00] transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
} 