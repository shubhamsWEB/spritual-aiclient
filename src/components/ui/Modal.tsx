import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay with fade animation */}
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out" 
        onClick={onClose}
      ></div>

      {/* Modal panel with slide-up and fade animation */}
      <div className="relative transform transition-all duration-300 ease-in-out w-full max-w-lg mx-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4">
            <div className="text-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                {children}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#973B00]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 