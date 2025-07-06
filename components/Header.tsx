import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-gray-200/80">
      <div className="max-w-screen-xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
          ระบบติดตามเงินค่าห้อง
        </h1>
      </div>
    </header>
  );
};

export default Header;