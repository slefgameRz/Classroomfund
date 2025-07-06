import React, { useState, useCallback } from 'react';
import { Payments, Student } from '../types';
import { MAX_WEEKS } from '../constants';
import { LinkIcon, CopyIcon, CheckIcon, SettingsIcon } from './icons';

interface AdminPanelProps {
  weekCount: number;
  onWeekCountChange: (count: number) => void;
  requiredAmount: number;
  onRequiredAmountChange: (amount: number) => void;
  payments: Payments;
  students: Student[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ weekCount, onWeekCountChange, requiredAmount, onRequiredAmountChange, payments, students }) => {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleGenerateLink = useCallback(() => {
    const stateToShare = {
      w: weekCount,
      r: requiredAmount,
      p: payments,
      s: students, // Include student names in the link
    };
    const jsonString = JSON.stringify(stateToShare);
    const base64String = btoa(encodeURIComponent(jsonString));
    const newShareLink = `${window.location.origin}${window.location.pathname}#/view/${base64String}`;
    setShareLink(newShareLink);
    setCopied(false);
  }, [weekCount, requiredAmount, payments, students]);

  const handleCopyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWeekInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    if (value > MAX_WEEKS) value = MAX_WEEKS;
    onWeekCountChange(value);
  };
  
  const handleRequiredAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    onRequiredAmountChange(value);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3"><SettingsIcon /> แผงควบคุม</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-6 space-y-6 animate-fade-in-down">
          {/* Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="week-count" className="font-medium text-gray-700">
                จำนวนสัปดาห์:
              </label>
              <input
                type="number"
                id="week-count"
                value={weekCount}
                onChange={handleWeekInputChange}
                min="1"
                max={MAX_WEEKS}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="required-amount" className="font-medium text-gray-700">
                ยอดที่ต้องชำระ (บาท/สัปดาห์):
              </label>
              <input
                type="number"
                id="required-amount"
                value={requiredAmount}
                onChange={handleRequiredAmountInputChange}
                min="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>
          
          {/* Share Row */}
          <div>
            <button
              onClick={handleGenerateLink}
              className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              <LinkIcon />
              สร้างลิงก์สำหรับแชร์
            </button>
          </div>

          {shareLink && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg animate-fade-in">
              <p className="text-sm font-medium text-gray-800 mb-2">ลิงก์สำหรับดูอย่างเดียว (Read-Only):</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyToClipboard}
                  className={`flex items-center justify-center px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out whitespace-nowrap ${
                    copied
                      ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                      : 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500'
                  }`}
                >
                  {copied ? <CheckIcon/> : <CopyIcon/>}
                  {copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;