import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Student, Payments } from '../types';
import { EditIcon, PayAllIcon, CheckAllIcon } from './icons';

interface StudentTableProps {
  students: Student[];
  payments: Payments;
  weekCount: number;
  requiredAmount: number;
  isViewerMode: boolean;
  onPaymentUpdate: (studentId: number, week: number, amount: number) => void;
  onStudentNameChange: (studentId: number, newName: string) => void;
  onPayAllForStudent: (studentId: number) => void;
  onPayAllForWeek: (week: number) => void;
}

const getPaymentStatusStyle = (paidAmount: number, requiredAmount: number): string => {
  if (requiredAmount <= 0) {
      return paidAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700';
  }
  if (paidAmount >= requiredAmount) {
    return 'bg-green-200/80 text-green-900 font-semibold'; // Paid in full
  }
  if (paidAmount > 0) {
    return 'bg-yellow-200/80 text-yellow-900'; // Partially paid
  }
  return 'bg-red-200/80 text-red-900'; // Unpaid
};

const EditableStudentName: React.FC<{ student: Student; isViewerMode: boolean; onStudentNameChange: (id: number, name: string) => void }> = ({ student, isViewerMode, onStudentNameChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(student.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (name.trim() === '') {
            setName(student.name); // Revert if empty
        } else if (name !== student.name) {
            onStudentNameChange(student.id, name);
        }
    };

    if (isViewerMode) {
        return <span className="font-medium text-gray-800">{student.name}</span>;
    }

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.blur(); }}
                className="w-full bg-indigo-50 border-2 border-indigo-300 rounded-md px-2 py-1 -m-2"
            />
        );
    }

    return (
        <button onClick={() => setIsEditing(true)} className="group flex items-center gap-2 w-full text-left">
            <span className="font-medium text-gray-800 group-hover:text-indigo-600">{student.name}</span>
            <EditIcon />
        </button>
    );
};


const StudentTable: React.FC<StudentTableProps> = ({ students, payments, weekCount, requiredAmount, isViewerMode, onPaymentUpdate, onStudentNameChange, onPayAllForStudent, onPayAllForWeek }) => {
  const weeks = Array.from({ length: weekCount }, (_, i) => i + 1);

  const studentTotals = useMemo(() => {
    return students.map(student => {
      return weeks.reduce((total, week) => {
        return total + (payments[student.id]?.[week] || 0);
      }, 0);
    });
  }, [students, payments, weeks]);
  
  const weekTotals = useMemo(() => {
    return weeks.map(week => {
        return students.reduce((total, student) => {
            return total + (payments[student.id]?.[week] || 0)
        }, 0)
    })
  }, [students, payments, weeks]);

  const grandTotal = useMemo(() => {
      return weekTotals.reduce((sum, total) => sum + total, 0)
  }, [weekTotals]);


  const handleInputChange = (studentId: number, week: number, value: string) => {
      const amount = parseInt(value, 10);
      if (!isNaN(amount) && amount >= 0) {
          onPaymentUpdate(studentId, week, amount);
      } else if (value === '') {
          onPaymentUpdate(studentId, week, 0);
      }
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl shadow-gray-300/30 overflow-hidden border border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100/70">
            <tr>
              <th scope="col" className="sticky left-0 bg-gray-100/70 z-20 px-4 sm:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-56 min-w-56">
                รายชื่อนักเรียน
              </th>
              {weeks.map(week => (
                <th key={week} scope="col" className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-2">
                    สัปดาห์ที่ {week}
                    {!isViewerMode && (
                       <button onClick={() => onPayAllForWeek(week)} title={`บันทึกว่าทุกคนจ่ายครบสำหรับสัปดาห์ที่ ${week}`} className="text-gray-400 hover:text-green-600 transition-colors">
                          <CheckAllIcon className="h-5 w-5"/>
                       </button>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="sticky right-0 bg-gray-200/90 z-20 px-4 sm:px-6 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider w-48 min-w-48">
                ยอดรวม
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, studentIndex) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="sticky left-0 bg-white hover:bg-gray-50 z-10 px-4 sm:px-6 py-3 whitespace-nowrap text-sm">
                   <EditableStudentName student={student} isViewerMode={isViewerMode} onStudentNameChange={onStudentNameChange} />
                </td>
                {weeks.map(week => {
                  const paidAmount = payments[student.id]?.[week] || 0;
                  const statusStyle = getPaymentStatusStyle(paidAmount, requiredAmount);

                  return (
                    <td key={week} className="p-1 sm:p-2 whitespace-nowrap text-sm text-center align-middle">
                      {isViewerMode ? (
                        <div className={`w-full h-full px-2 py-3 rounded-md ${statusStyle}`}>
                            {paidAmount.toLocaleString()} ฿
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={paidAmount === 0 ? '' : paidAmount}
                          onChange={(e) => handleInputChange(student.id, week, e.target.value)}
                          placeholder="0"
                          min="0"
                          className={`w-24 text-center px-2 py-3 border-2 border-transparent rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${statusStyle}`}
                          aria-label={`Payment for ${student.name} week ${week}`}
                        />
                      )}
                    </td>
                  );
                })}
                <td className="sticky right-0 bg-gray-100/80 z-10 px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-center font-bold">
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-indigo-700">{studentTotals[studentIndex].toLocaleString()} ฿</span>
                        {!isViewerMode && (
                           <button onClick={() => onPayAllForStudent(student.id)} title={`จ่ายครบสำหรับ ${student.name}`} className="text-gray-400 hover:text-green-600 transition-colors">
                              <PayAllIcon />
                           </button>
                        )}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-200/90 font-bold">
            <tr>
              <td className="sticky left-0 bg-gray-200/90 z-20 px-4 sm:px-6 py-4 text-left text-sm text-gray-800 uppercase">
                ยอดรวมรายสัปดาห์
              </td>
              {weekTotals.map((total, index) => (
                <td key={`week-total-${index}`} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-800">
                    {total.toLocaleString()} ฿
                </td>
              ))}
              <td className="sticky right-0 bg-indigo-200 z-20 px-4 sm:px-6 py-4 text-center text-sm text-indigo-900 uppercase">
                รวมทั้งหมด: {grandTotal.toLocaleString()} ฿
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;