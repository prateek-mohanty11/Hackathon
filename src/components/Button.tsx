import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
}

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  className = ''
}: ButtonProps) => {
  const baseStyles = "text-xl py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
};

export default Button;