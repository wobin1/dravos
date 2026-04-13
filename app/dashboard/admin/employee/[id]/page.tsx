import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Youtube, 
  DollarSign, 
  Target, 
  Clock, 
  CheckCircle2, 
  Wallet,
  User as UserIcon,
  TrendingUp,
  Award,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { deleteEmployee } from "@/app/actions/users";
import DeleteEmployeeButton from "./DeleteEmployeeButton";

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const employeeId = (await params).id;

  const employee = await prisma.user.findUnique({
    where: { id: employeeId },
    include: {
      submissions: {
        orderBy: { submittedAt: "desc" },
      },
      dailyPerformance: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!employee) notFound();

  const totalEarned = employee.dailyPerformance.reduce((acc: number, curr: any) => acc + curr.amountEarned, 0);
  const totalSubmissions = employee.submissions.length;
  const avgEfficiency = employee.dailyPerformance.length > 0 
    ? (employee.dailyPerformance.reduce((acc: number, curr: any) => acc + (curr.videosUploaded / curr.videosRequired), 0) / employee.dailyPerformance.length) * 100
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col gap-4">
        <Link 
          href="/dashboard/admin" 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-fit group"
        >
          <div className="p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-indigo-600 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-semibold">Back to Directory</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-600/20">
              {employee.name?.[0] || employee.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)] tracking-tight">
                {employee.name || "Unnamed Employee"}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Mail size={14} />
                  {employee.email}
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Calendar size={14} />
                  Joined {new Date(employee.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DeleteEmployeeButton userId={employee.id} />
            <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-sm font-bold">
              Active Employee
            </span>
          </div>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="premium-card p-6 border-t-4 border-t-indigo-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Payouts</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">₦{totalEarned.toLocaleString()}</h3>
        </div>
        <div className="premium-card p-6 border-t-4 border-t-emerald-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
              <Youtube size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Videos</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">{totalSubmissions}</h3>
        </div>
        <div className="premium-card p-6 border-t-4 border-t-orange-600">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600">
              <Award size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">{avgEfficiency.toFixed(1)}%</h3>
        </div>
        <div className="premium-card p-6 border-t-4 border-t-indigo-600">
           <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">{employee.role}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payroll Config */}
        <section className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <DollarSign className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Employment Terms</h2>
          </div>
          <div className="premium-card p-6 space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Monthly Salary</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">₦{employee.monthlySalary.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5"><Target size={14} /> Target</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{employee.dailyVideoTarget} Videos/Day</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm font-medium text-slate-500 flex items-center justify-end gap-1.5"><Calendar size={14} /> Schedule</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{employee.workingDaysPerMonth} Days/Month</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-500 mb-2">YouTube Channel ID</p>
              <code className="block bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-indigo-600 break-all">
                {employee.youtubeChannelId || "Not Configured"}
              </code>
            </div>
          </div>
        </section>

        {/* Performance & Submissions Table */}
        <section className="lg:col-span-2 space-y-8">
          {/* Recent Submissions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Upload History</h2>
              <span className="text-xs font-bold text-slate-400">{employee.submissions.length} Total Videos</span>
            </div>
            <div className="premium-card overflow-hidden">
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Video</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Submitted</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {employee.submissions.slice(0, 10).map((sub: any) => (
                      <tr key={sub.id}>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">ID: {sub.videoId}</p>
                          <a href={sub.youtubeUrl} target="_blank" className="text-xs text-indigo-600 hover:underline">Link</a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-500 uppercase">{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold rounded">APPROVED</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Daily Records */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-[var(--font-outfit)]">Daily Performance Records</h2>
              <span className="text-xs font-bold text-slate-400">{employee.dailyPerformance.length} Days Recorded</span>
            </div>
            <div className="premium-card overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Uploads</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Earned (₦)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {employee.dailyPerformance.slice(0, 10).map((perf: any) => (
                      <tr key={perf.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {new Date(perf.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{perf.videosUploaded}</span>
                            <span className="text-xs text-slate-400">/ {perf.videosRequired}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">
                          ₦{perf.amountEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
