
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const baseStyles = "px-6 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer";
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
