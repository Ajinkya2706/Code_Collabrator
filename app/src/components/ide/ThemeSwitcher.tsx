import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSwitcherProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onToggle }) => {
  return (
    <button
      className="relative p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 group"
      onClick={onToggle}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun 
          className={`w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'text-yellow-500 scale-100 opacity-100' 
              : 'text-gray-400 scale-75 opacity-0'
          }`} 
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`w-5 h-5 absolute top-0 left-0 transition-all duration-300 ${
            theme === 'dark' 
              ? 'text-blue-400 scale-100 opacity-100' 
              : 'text-gray-400 scale-75 opacity-0'
          }`} 
        />
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  );
};

export default ThemeSwitcher; 