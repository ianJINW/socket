import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 text-gray-600 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="text-sm">
          School Management System • {year}
        </div>
        <div className="text-sm">Built with React + TypeScript</div>
      </div>
    </footer>
  );
};

export default Footer;
