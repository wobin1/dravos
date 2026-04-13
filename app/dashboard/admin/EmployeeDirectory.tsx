"use client";

import { useState, useEffect } from "react";
import { Users, Settings, Edit, UserPlus, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import EmployeeModal from "./EmployeeModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteEmployee } from "@/app/actions/users";

interface EmployeeDirectoryProps {
  initialUsers: any[];
}

export default function EmployeeDirectory({ initialUsers }: EmployeeDirectoryProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedEmployee(user);
    setIsModalOpen(true);
  };

  const totalMonthlyPayout = users.reduce((acc: any, user: any) => acc + user.monthlySalary, 0);

  const handleDeleteClick = (user: any) => {
    setEmployeeToDelete(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Admin Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage employees, targets, and payroll settings</p>
        </div>
        <button 
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2 self-start shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
        >
          <UserPlus size={20} />
          Add Employee
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-t-4 border-t-indigo-600">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Employees</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">{users.length}</h3>
        </div>
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-t-4 border-t-emerald-600">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Liability</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">₦{totalMonthlyPayout.toLocaleString()}</h3>
        </div>
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-t-4 border-t-orange-600">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Target</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">3.2 Videos</h3>
        </div>
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-t-4 border-t-rose-600">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Submissions</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">148 Total</h3>
        </div>
      </div>

      {/* Employee Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Employee Directory</h2>
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 gap-2">
             <Settings size={16} className="text-slate-400" />
             <span className="text-xs font-medium text-slate-500">Configure Global Defaults</span>
          </div>
        </div>
        
        <div className="premium-card bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Channel ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Target</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Salary (₦)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cycle</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <Link 
                            href={`/dashboard/admin/employee/${user.id}`}
                            className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                          >
                            {user.name || "Unnamed"}
                          </Link>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[10px] bg-slate-100 dark:bg-slate-800 p-1.5 rounded text-slate-600 dark:text-slate-400">
                        {user.youtubeChannelId || "Not Set"}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-xs font-bold">
                         {user.dailyVideoTarget} Videos
                       </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      ₦{user.monthlySalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.workingDaysPerMonth} Days
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/employee/${user.id}`}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all active:scale-90"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 transition-all active:scale-90"
                          title="Edit Employee"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 rounded-lg transition-all active:scale-90 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                          title="Delete Employee"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 italic">No employees found. Create your first employee to get started.</p>
            </div>
          )}
        </div>
      </section>

      <EmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        employee={selectedEmployee} 
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        employee={employeeToDelete} 
      />
    </div>
  );
}
