"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEmployee } from "@/app/actions/users";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";

export default function DeleteEmployeeButton({ userId }: { userId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 bg-white dark:bg-slate-800 text-red-500 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        <Trash2 size={16} />
        Delete Employee
      </button>

      <DeleteConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={{ id: userId }} // Passed minimal ID
        onSuccess={() => {
          router.push("/dashboard/admin");
          router.refresh();
        }}
      />
    </>
  );
}
