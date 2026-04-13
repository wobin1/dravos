"use client";

import { useState } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import PasswordResetModal from "./PasswordResetModal";
import { ThemeToggle } from "@/components/theme-toggle";

export default function UserSidebarActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
        >
          <KeyRound size={16} />
          Change Password
        </button>

        <ThemeToggle />
        
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
            <LogOut size={16} />
            Logout
          </button>
        </form>
      </div>

      <PasswordResetModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
