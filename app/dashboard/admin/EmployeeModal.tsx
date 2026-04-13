"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Lock, Wallet, Target, Calendar, Youtube, Save, Loader2 } from "lucide-react";
import { upsertEmployee } from "@/app/actions/users";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: any; // If present, we're editing
}

export default function EmployeeModal({ isOpen, onClose, employee }: EmployeeModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    monthlySalary: "0",
    dailyVideoTarget: "3",
    workingDaysPerMonth: "22",
    youtubeChannelId: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id || "",
        name: employee.name || "",
        email: employee.email || "",
        password: "", // Don't show hashed password
        monthlySalary: employee.monthlySalary?.toString() || "0",
        dailyVideoTarget: employee.dailyVideoTarget?.toString() || "3",
        workingDaysPerMonth: employee.workingDaysPerMonth?.toString() || "22",
        youtubeChannelId: employee.youtubeChannelId || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        monthlySalary: "3000",
        dailyVideoTarget: "3",
        workingDaysPerMonth: "22",
        youtubeChannelId: "",
      });
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await upsertEmployee(formData);
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">
              {employee ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {employee ? `Updating details for ${employee.email}` : "Create a new employee profile"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input
                required
                type="email"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lock size={16} /> {employee ? "New Password (optional)" : "Password"}
              </label>
              <input
                required={!employee}
                type="password"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            {/* Youtube Channel ID */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Youtube size={16} /> YouTube Channel ID
              </label>
              <input
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.youtubeChannelId}
                onChange={(e) => setFormData({ ...formData, youtubeChannelId: e.target.value })}
                placeholder="UC..."
              />
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Wallet size={16} /> Monthly Salary (₦)
              </label>
              <input
                required
                type="number"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                placeholder="3000"
              />
            </div>

            {/* Daily Target */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Target size={16} /> Daily Video Target
              </label>
              <input
                required
                type="number"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.dailyVideoTarget}
                onChange={(e) => setFormData({ ...formData, dailyVideoTarget: e.target.value })}
                placeholder="3"
              />
            </div>

            {/* Working Days */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar size={16} /> Working Days / Month
              </label>
              <input
                required
                type="number"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.workingDaysPerMonth}
                onChange={(e) => setFormData({ ...formData, workingDaysPerMonth: e.target.value })}
                placeholder="22"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {employee ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
