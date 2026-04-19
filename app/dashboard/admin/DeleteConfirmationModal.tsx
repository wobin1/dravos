"use client";

import { useState } from "react";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteEmployee } from "@/app/actions/users";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onSuccess?: () => void;
}

export default function DeleteConfirmationModal({ isOpen, onClose, employee, onSuccess }: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !employee) return null;
  // this is some comments

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteEmployee(employee.id);
    setLoading(false);
    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      alert(result.error || "Failed to delete employee");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 mb-2">
            <AlertTriangle size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">
              Confirm Deletion
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{employee.name || employee.email}</span>?
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 text-red-600 text-xs font-semibold">
              This action is permanent and will remove all video history and performance records.
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
              Confirm Delete
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
