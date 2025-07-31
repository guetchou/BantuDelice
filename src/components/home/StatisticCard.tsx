
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatisticCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  description?: string;
  iconColor?: string;
  titleColor?: string;
  valueColor?: string;
  descriptionColor?: string;
  index?: number;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  icon: Icon,
  title,
  value,
  description,
  iconColor = 'text-primary',
  titleColor = 'text-gray-600',
  valueColor = 'text-gray-900',
  descriptionColor = 'text-gray-500',
  index = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className={`mb-3 ${iconColor}`}>
              <Icon className="h-8 w-8" />
            </div>
            
            <div className={`text-3xl font-bold mb-2 ${valueColor}`}>
              {value}
            </div>
            
            <div className={`text-sm font-medium mb-1 ${titleColor}`}>
              {title}
            </div>
            
            {description && (
              <div className={`text-xs ${descriptionColor}`}>
                {description}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatisticCard;
