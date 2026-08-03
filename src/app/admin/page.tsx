import { auth, prisma } from "@/auth";
import { formatDistanceToNow } from "date-fns";
import AdminCharts from "./AdminCharts";

export const metadata = {
  title: "Command Center | OneFrame Studios Admin",
  robots: "noindex, nofollow" // Important to keep admin panel out of search engines
};

export default async function AdminDashboard() {
  const session = await auth();

  // Fetch counts from the database safely
  let totalProjects = 0;
  let unreadInquiries = 0;
  let totalEditors = 0;
  let recentSubmissions: { id: string; name: string; email: string; createdAt: Date; status: string }[] = [];
  let dbError = false;

  try {
    [totalProjects, unreadInquiries, totalEditors, recentSubmissions] = await Promise.all([
      prisma.project.count(),
      prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
      prisma.editor.count(),
      prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    ]);
  } catch (e) {
    dbError = true;
    console.error("Admin dashboard DB error:", e);
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Welcome back, <span className="text-brand-accent">{session?.user?.name || "Admin"}</span></h1>
          <p className="text-zinc-400 font-light">Here is the latest data from the studio servers.</p>
        </div>
        <div className="flex items-center gap-4">
          <img src={session?.user?.image || "https://ui-avatars.com/api/?name=Admin"} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-brand-accent shadow-[0_0_15px_rgba(229,9,20,0.5)]" />
        </div>
      </header>

      {dbError && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-sm font-mono flex items-center gap-3">
          <span className="text-yellow-400">⚠</span>
          Database connection failed. Stats shown are cached zeros. Check your MongoDB connection.
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Total Archives</h3>
          <p className="text-4xl font-black text-white">{totalProjects}</p>
        </div>
        <div className="bg-black/50 border border-brand-accent/30 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-accent/40 transition-colors"></div>
          <h3 className="text-brand-accent text-xs uppercase tracking-widest font-bold mb-2">Unread Transmissions</h3>
          <p className="text-4xl font-black text-white">{unreadInquiries}</p>
        </div>
        <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/30 transition-colors"></div>
          <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">Active Personnel</h3>
          <p className="text-4xl font-black text-white">{totalEditors}</p>
        </div>
      </div>

      {/* Advanced Live Chart */}
      <AdminCharts />

      {/* Recent Contact Submissions */}
      <div className="bg-black/50 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
          <div className="w-3 h-3 bg-brand-accent animate-pulse rounded-full"></div>
          Recent Transmissions
        </h2>
        
        {recentSubmissions.length === 0 ? (
          <p className="text-zinc-500 font-light italic">No incoming transmissions at this time.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 text-xs uppercase tracking-widest font-bold">
                  <th className="pb-4">Client</th>
                  <th className="pb-4">Comms Link</th>
                  <th className="pb-4">Timestamp</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-sm text-white">{sub.name}</td>
                    <td className="py-4 text-zinc-400 text-sm">{sub.email}</td>
                    <td className="py-4 text-zinc-400 text-sm">{formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${sub.status === 'UNREAD' ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
