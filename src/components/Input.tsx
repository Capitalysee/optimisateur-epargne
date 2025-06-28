import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', labelClassName = '', inputClassName = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className={`text-sm font-medium text-[#B7C9A8] font-sans mb-1 ${labelClassName}`}>{label}</label>}
    <input
      className={`rounded-2xl border border-[#23272F] bg-[#18181B] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B7C9A8] focus:border-[#B7C9A8] transition-all font-sans placeholder-[#BFD7ED] w-full ${inputClassName} ${className}`}
      {...props}
    />
  </div>
);

export default Input; 