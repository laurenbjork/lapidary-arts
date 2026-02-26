import React from 'react';

const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg border-b-2 ${
        isActive
          ? 'border-burgundy text-burgundy'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
};

export default TabButton;
