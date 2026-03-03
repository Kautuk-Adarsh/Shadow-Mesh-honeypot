import { fetchAttacks } from "../lib/api";
import AttackTable from "../components/attackTable";
import AutoRefresh from "../components/autoRefresh";
import StatCard from "../components/statCard";
import { Activity, Shield, Users, Target } from "lucide-react";

export default async function Dashboard() {
  const { data, count, success } = await fetchAttacks();
  const uniqueIPs = new Set(data?.map((log) => log.ip)).size;
  const userCounts = data?.reduce((acc: Record<string, number>, log) => {
    acc[log.username] = (acc[log.username] || 0) + 1;
    return acc;
  }, {});
  
  const topUser = userCounts && Object.keys(userCounts).length > 0
    ? Object.keys(userCounts).sort((a, b) => userCounts[b] - userCounts[a])[0]
    : "N/A";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
              <Activity className="text-emerald-400 w-8 h-8" />
              Shadow Mesh Command Center
            </h1>
            <p className="text-slate-500 mt-2">Real-time SSH honeypot threat intelligence.</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase font-semibold">API Status</span>
            <span className="text-sm font-mono text-emerald-400 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {success ? "System Connected" : "Connection Failed"}
            </span>
          </div>
        </header>

        <AutoRefresh interval={15000} />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Intrusions" 
            value={count || 0} 
            icon={<Shield className="w-6 h-6" />} 
            description="Captured in the database vault"
          />
          <StatCard 
            title="Unique Threat Actors" 
            value={uniqueIPs || 0} 
            icon={<Users className="w-6 h-6" />} 
            description="Distinct attacker IP addresses"
          />
          <StatCard 
            title="Top Targeted Account" 
            value={topUser} 
            icon={<Target className="w-6 h-6" />} 
            description="Most brute-forced username"
          />
        </section>
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-300">Recent Intrusions</h2>
            <span className="text-sm text-slate-500 font-mono">Showing last {count || 0} attempts</span>
          </div>
          
          <AttackTable data={data} />
        </section>

      </div>
    </main>
  );
}