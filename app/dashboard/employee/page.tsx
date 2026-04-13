import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Youtube, TrendingUp, Wallet, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import SubmissionForm from "./submission-form";

export default async function EmployeeDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const performance = await prisma.dailyPerformance.findUnique({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  const submissions = await prisma.videoSubmission.findMany({
    where: {
      userId: session.userId,
      submittedAt: {
        gte: today,
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  const uploadsToday = performance?.videosUploaded || 0;
  const target = user?.dailyVideoTarget || 3;
  const progressPercent = Math.min((uploadsToday / target) * 100, 100);
  const earningsToday = performance?.amountEarned || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Welcome back, {user?.name || "Employee"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here is your performance for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-l-4 border-l-indigo-600">
           <div className="flex items-center justify-between mb-4">
             <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                <TrendingUp size={24} />
             </div>
             <span className="text-sm font-medium text-slate-500">Target: {target} Videos</span>
           </div>
           <p className="text-sm text-slate-500 mb-1 font-medium">Uploads Today</p>
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">{uploadsToday} / {target}</h3>
           <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
             <div 
               className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
               style={{ width: `${progressPercent}%` }}
             />
           </div>
        </div>

        <div className="premium-card p-6 bg-white dark:bg-slate-900 border-l-4 border-l-emerald-600">
           <div className="flex items-center justify-between mb-4">
             <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600">
                <Wallet size={24} />
             </div>
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               Live Earnings
             </div>
           </div>
           <p className="text-sm text-slate-500 mb-1 font-medium">Earned Today</p>
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">
            ₦{earningsToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
           </h3>
           <p className="text-xs text-slate-400 mt-2">Calculated pro-rata against your target</p>
        </div>

        <div className="premium-card p-6 bg-white dark:bg-slate-900">
           <div className="flex items-center justify-between mb-4">
             <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400">
                <Calendar size={24} />
             </div>
           </div>
           <p className="text-sm text-slate-500 mb-1 font-medium">Monthly Salary</p>
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">₦{user?.monthlySalary.toLocaleString()}</h3>
           <p className="text-xs text-slate-400 mt-2">Cycle: {user?.workingDaysPerMonth} working days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submission Form Component */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Youtube className="text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Submit Daily Upload</h2>
          </div>
          <SubmissionForm />
        </section>

        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Recent Submissions</h2>
          <div className="premium-card bg-white dark:bg-slate-900 overflow-hidden min-h-[300px]">
            {submissions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-50">
                <Youtube size={48} className="mb-4 text-slate-300 dark:text-slate-700" />
                <p className="text-slate-500">No videos submitted yet today.</p>
                <p className="text-sm text-slate-400 mt-1">Submit your first video using the form.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissions.map((sub: any) => (
                  <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 bg-indigo-50 dark:bg-indigo-900/20 rounded flex items-center justify-center">
                         <Youtube size={20} className="text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">Video ID: {sub.videoId}</p>
                        <p className="text-xs text-slate-500">{new Date(sub.submittedAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="shrink-0 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
