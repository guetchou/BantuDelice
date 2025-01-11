import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard = ({ title, value, icon, trend }: DashboardCardProps) => {
  return (
    <Card className="p-6 glass-effect hover-scale animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="text-primary/80">{icon}</div>
        {trend && (
          <div
            className={`text-sm ${
              trend.isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-300">{title}</h3>
        <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-primary/80 to-cyan-400 bg-clip-text text-transparent">{value}</p>
      </div>
    </Card>
  );
};

export default DashboardCard;