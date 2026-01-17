import React from 'react';

const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizes[size]}`}></div>
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <Loader size="lg" />
    </div>
  );
};

export default Loader;