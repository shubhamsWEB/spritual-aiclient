import React from 'react';
import Modal from '../ui/Modal';
import { FiLock } from 'react-icons/fi';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade to Continue"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FiLock className="w-12 h-12 text-amber-600" />
        </div>
        <p className="text-gray-700 mb-4">
          You've used your 3 free chats. Upgrade to continue your spiritual journey with unlimited access.
        </p>
        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full px-4 py-2 text-base font-medium text-white bg-[#973B00] border border-[#973B00] rounded-md shadow-sm hover:bg-[#BA4D00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#973B00]"
          >
            Upgrade Now
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#973B00]"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
} 