import { Youtube, LayoutDashboard, Settings, LogOut, User as UserIcon, FileText } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import UserSidebarActions from "./UserSidebarActions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen z-[100]">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
            <Youtube size={32} />
            <span className="text-xl font-bold font-[var(--font-outfit)] tracking-tight">Dravos</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
          >
            <LayoutDashboard size={20} />
            Overview
          </Link>
          {session.role === "ADMIN" && (
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
            >
              <Settings size={20} />
              Admin Management
            </Link>
          )}
          {session.role === "EMPLOYEE" && (
            <Link
              href="/dashboard/employee/submissions"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
            >
              <FileText size={20} />
              My Submissions
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <UserIcon size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{session.email}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{session.role.toLowerCase()}</p>
            </div>
          </div>
          <UserSidebarActions />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 glass sticky top-0 z-50">
          <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600">
            <Youtube size={28} />
            <span className="font-bold font-[var(--font-outfit)] text-lg">Dravos</span>
          </Link>
          <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
             <UserIcon size={20} />
          </button>
        </header>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
