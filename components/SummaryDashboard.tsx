import React from 'react';

interface SummaryDashboardProps {
  totalCollected: number;
  totalExpected: number;
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ totalCollected, totalExpected }) => {
  const remaining = totalExpected - totalCollected;
  const progressPercentage = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="mb-8 animate-fade-in-down">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Collected */}
        <div className="bg-gradient-to-br from-green-400 to-green-500 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-semibold text-green-100">ยอดรวมที่เก็บได้</h3>
          <p className="text-4xl font-bold mt-2">{formatCurrency(totalCollected)}</p>
        </div>
        
        {/* Total Expected */}
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-semibold text-indigo-100">ยอดรวมที่ต้องเก็บ</h3>
          <p className="text-4xl font-bold mt-2">{formatCurrency(totalExpected)}</p>
        </div>
        
        {/* Remaining */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-semibold text-yellow-100">ยอดคงเหลือ</h3>
          <p className="text-4xl font-bold mt-2">{formatCurrency(remaining > 0 ? remaining : 0)}</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">ภาพรวมการจัดเก็บ</span>
          <span className="text-sm font-bold text-indigo-600">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-blue-400 to-indigo-600 h-4 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
