import React from 'react';
import { FiInfo } from 'react-icons/fi';
import Button from './Button';

interface OverlayInfoProps {
  message: string;
  onContinue: () => void;
}

const OverlayInfo: React.FC<OverlayInfoProps> = ({ message, onContinue }) => (
  <div className="fixed inset-0 bg-[#BFD7ED]/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center text-center">
      <FiInfo className="text-[#B7C9A8] text-4xl mb-4" />
      <p className="text-gray-700 font-sans mb-6">{message}</p>
      <Button onClick={onContinue}>Continuer</Button>
    </div>
  </div>
);

export default OverlayInfo;
