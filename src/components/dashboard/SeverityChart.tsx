import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { SecurityIncident } from '../../types';
import { BarChart3 } from 'lucide-react';

interface SeverityChartProps {
  incidents: SecurityIncident[];
}

export const SeverityChart: React.FC<SeverityChartProps> = ({ incidents }) => {
  const counts = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0
  };

  incidents.forEach((inc) => {
    if (counts[inc.severity] !== undefined) {
      counts[inc.severity]++;
    }
  });

  const data = [
    { name: 'Low', count: counts.Low, color: '#10B981' },
    { name: 'Medium', count: counts.Medium, color: '#F59E0B' },
    { name: 'High', count: counts.High, color: '#F97316' },
    { name: 'Critical', count: counts.Critical, color: '#F43F5E' }
  ];

  const totalIncidents = incidents.length;

  return (
    <div className="p-5 rounded-xl bg-[#111C30] border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Threats by Severity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time severity distribution from Firestore
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded tabular-nums">
          {totalIncidents} Total
        </div>
      </div>

      <div className="h-56 w-full pt-4">
        {totalIncidents === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No incidents recorded yet to display severity trends.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#0F172A] border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                        <div className="font-semibold text-slate-200">{d.name} Severity</div>
                        <div className="text-slate-300 mt-1 flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="font-mono tabular-nums font-bold text-white">{d.count}</span> incident(s)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend summary pills */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center">
        {data.map((item) => (
          <div key={item.name} className="p-1.5 rounded-lg bg-[#0F172A] border border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">{item.name}</div>
            <div className="text-sm font-bold font-mono tabular-nums text-white mt-0.5">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
