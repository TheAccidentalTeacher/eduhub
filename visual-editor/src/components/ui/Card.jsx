import React from 'react';

export const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`px-6 pb-6 ${className}`}>
      {children}
    </div>
  );
};

export default { Card, CardHeader, CardTitle, CardContent };
