import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import StudentTable from './components/StudentTable';
import SummaryDashboard from './components/SummaryDashboard';
import { Student, Payments, SharedState, PaymentStatus } from './types';
import { INITIAL_STUDENTS, DEFAULT_WEEK_COUNT, DEFAULT_REQUIRED_AMOUNT } from './constants';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [payments, setPayments] = useState<Payments>({});
  const [weekCount, setWeekCount] = useState<number>(DEFAULT_WEEK_COUNT);
  const [requiredAmount, setRequiredAmount] = useState<number>(DEFAULT_REQUIRED_AMOUNT);
  const [isViewerMode, setIsViewerMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#/view/')) {
        const base64String = hash.substring(7);
        if (base64String) {
          const decodedString = decodeURIComponent(atob(base64String));
          const sharedState: SharedState = JSON.parse(decodedString);
          
          if (sharedState.w && sharedState.p && typeof sharedState.r !== 'undefined' && sharedState.s) {
            setWeekCount(sharedState.w);
            setRequiredAmount(sharedState.r);
            setPayments(sharedState.p);
            setStudents(sharedState.s);
            setIsViewerMode(true);
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse state from URL hash:", error);
      setIsViewerMode(false); // Reset to admin mode on error
      // Reset to defaults
      setStudents(INITIAL_STUDENTS);
      setWeekCount(DEFAULT_WEEK_COUNT);
      setRequiredAmount(DEFAULT_REQUIRED_AMOUNT);
      setPayments({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePaymentUpdate = useCallback((studentId: number, week: number, amount: number) => {
    setPayments(prevPayments => {
      const newPayments = JSON.parse(JSON.stringify(prevPayments));
      if (!newPayments[studentId]) {
        newPayments[studentId] = {};
      }
      newPayments[studentId][week] = Math.max(0, amount);
      return newPayments;
    });
  }, []);
  
  const handleStudentNameChange = useCallback((studentId: number, newName: string) => {
      setStudents(prevStudents => 
          prevStudents.map(student => 
              student.id === studentId ? { ...student, name: newName } : student
          )
      );
  }, []);

  const handlePayAllForStudent = useCallback((studentId: number) => {
      if(requiredAmount <= 0) return;
      setPayments(prevPayments => {
          const newPayments = JSON.parse(JSON.stringify(prevPayments));
          if (!newPayments[studentId]) {
            newPayments[studentId] = {};
          }
          for (let i = 1; i <= weekCount; i++) {
              newPayments[studentId][i] = requiredAmount;
          }
          return newPayments;
      });
  }, [weekCount, requiredAmount]);

  const handlePayAllForWeek = useCallback((week: number) => {
      if(requiredAmount <= 0) return;
      setPayments(prevPayments => {
          const newPayments = JSON.parse(JSON.stringify(prevPayments));
          students.forEach(student => {
              if (!newPayments[student.id]) {
                newPayments[student.id] = {};
              }
              newPayments[student.id][week] = requiredAmount;
          });
          return newPayments;
      });
  }, [students, requiredAmount]);

  const handleWeekCountChange = (count: number) => {
    setWeekCount(count);
  };
  
  const handleRequiredAmountChange = (amount: number) => {
    setRequiredAmount(Math.max(0, amount));
  };

  const summaryData = useMemo(() => {
    const totalExpected = students.length * weekCount * requiredAmount;
    const totalCollected = (Object.values(payments) as PaymentStatus[]).reduce((acc, studentPayments) => {
        return acc + (Object.values(studentPayments) as number[]).reduce((sum, amount) => sum + (amount || 0), 0);
    }, 0);
    return { totalCollected, totalExpected };
  }, [students, payments, weekCount, requiredAmount]);

  if (isLoading) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500 mx-auto mb-4"></div>
                <p className="text-xl text-gray-700 font-semibold">กำลังโหลดข้อมูล...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-gray-800">
      <Header />
      <main className="max-w-screen-xl mx-auto py-6 sm:px-6 lg:px-8">
        
        <SummaryDashboard 
            totalCollected={summaryData.totalCollected}
            totalExpected={summaryData.totalExpected}
        />

        {isViewerMode && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 mb-6 rounded-md shadow-md animate-fade-in" role="alert">
            <p className="font-bold">โหมดสำหรับดูเท่านั้น (Read-Only)</p>
            <p>คุณกำลังดูข้อมูลในโหมดดูอย่างเดียว ไม่สามารถแก้ไขข้อมูลได้</p>
          </div>
        )}

        {!isViewerMode && (
          <AdminPanel
            weekCount={weekCount}
            onWeekCountChange={handleWeekCountChange}
            requiredAmount={requiredAmount}
            onRequiredAmountChange={handleRequiredAmountChange}
            payments={payments}
            students={students}
          />
        )}

        <StudentTable
          students={students}
          payments={payments}
          weekCount={weekCount}
          requiredAmount={requiredAmount}
          isViewerMode={isViewerMode}
          onPaymentUpdate={handlePaymentUpdate}
          onStudentNameChange={handleStudentNameChange}
          onPayAllForStudent={handlePayAllForStudent}
          onPayAllForWeek={handlePayAllForWeek}
        />
      </main>
       <footer className="text-center py-6 text-gray-500 text-sm">
        <p>ระบบติดตามการชำระเงินค่าห้องเรียน</p>
      </footer>
    </div>
  );
};

export default App;
