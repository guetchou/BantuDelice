
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Q1", deals: 42, revenue: 145 },
  { name: "Q2", deals: 38, revenue: 132 },
  { name: "Q3", deals: 55, revenue: 187 },
  { name: "Q4", deals: 47, revenue: 166 },
];

const DashboardBarChart = () => {
  return (
    <Card className="p-6 glass-effect hover-scale animate-fade-in">
      <h3 className="text-lg font-medium text-muted-foreground mb-4">Performance trimestrielle</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="dealsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.4}/>
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              vertical={false} 
            />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dx={-10}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Bar 
              dataKey="deals" 
              fill="url(#dealsGradient)"
              radius={[4, 4, 0, 0]}
              barSize={24}
              name="Commandes"
            />
            <Bar 
              dataKey="revenue" 
              fill="url(#revenueGradient)"
              radius={[4, 4, 0, 0]}
              barSize={24}
              name="Revenus"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-400 opacity-80" />
          <span>Commandes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-400 opacity-80" />
          <span>Revenus</span>
        </div>
      </div>
    </Card>
  );
};

export default DashboardBarChart;
