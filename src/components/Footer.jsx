import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-400 text-white text-center p-4 mt-8 border-t-4 border-blue-300">
      <div>
        <p>© {new Date().getFullYear()} Quest Weaver. All rights reserved.</p>
        <p>Adventure awaits. Keep exploring.</p>
      </div>
    </footer>
  );
};

