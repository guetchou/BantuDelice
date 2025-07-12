
import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-primary/80">{icon}</div>
        {trend && (
          <div
            className={`text-sm ${
              trend.isPositive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </div>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg font-medium text-muted-foreground">{title}</CardTitle>
        <p className="text-3xl font-bold mt-1 bg-gradient-to-r from-primary/80 to-cyan-400 bg-clip-text text-transparent">{value}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
