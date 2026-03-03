import { format } from "date-fns";
import { ShieldAlert, Terminal, Globe, KeyRound, BrainCircuit } from "lucide-react";
import { AttackLog } from "../lib/api";

export default function AttackTable({ data }: { data: AttackLog[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-xl">
        <ShieldAlert className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-400">No threat intel detected.</h3>
        <p className="text-slate-500">The honeypot is waiting for its first victim.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (!score) return "text-slate-500";
    if (score >= 8) return "text-rose-500";
    if (score >= 5) return "text-amber-400";
    return "text-emerald-400";
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-2xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs uppercase text-slate-500 font-semibold border-b border-slate-800">
          <tr>
            <th className="px-6 py-4 flex items-center gap-2"><Globe className="w-4 h-4" /> IP Address</th>
            <th className="px-6 py-4"><Terminal className="w-4 h-4 inline mr-2" /> Payload</th>
            <th className="px-6 py-4"><BrainCircuit className="w-4 h-4 inline mr-2" /> AI Intelligence</th>
            <th className="px-6 py-4">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 border-t border-slate-800">
          {data.map((log) => (
            <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 font-mono text-emerald-400">{log.ip}</td>
              
              <td className="px-6 py-4">
                <div className="flex flex-col space-y-1">
                  <span className="font-mono text-amber-200 text-xs">usr: {log.username}</span>
                  <span className="font-mono text-rose-400 text-xs">pwd: {log.password}</span>
                </div>
              </td>

              <td className="px-6 py-4">
                {log.threat_score ? (
                  <div className="flex flex-col space-y-1">
                    <span className={`font-bold ${getScoreColor(log.threat_score)}`}>
                      Score: {log.threat_score}/10 — {log.attack_type}
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-xs" title={log.ai_analysis}>
                      {log.ai_analysis}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-600 italic text-xs">Pre-AI Legacy Data</span>
                )}
              </td>

              <td className="px-6 py-4 text-slate-400 text-xs">
                {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}