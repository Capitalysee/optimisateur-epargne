import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`font-semibold rounded-xl px-6 py-3 shadow-md transition-all duration-200 font-sans ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 