import React from 'react';

interface ProgressBarProps {
  value: number; // entre 0 et 1
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
    <div
      className="h-full bg-[#F6E7B2] transition-all duration-300"
      style={{ width: `${Math.round(value * 100)}%` }}
    />
  </div>
);

export default ProgressBar; 