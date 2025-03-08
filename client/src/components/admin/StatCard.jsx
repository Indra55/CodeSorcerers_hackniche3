import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBg, 
  iconColor, 
  trend, 
  trendDirection,
  animationDelay 
}) {
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trendDirection === "up" ? "text-green-500" : "text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              <div className={`flex items-center mt-2 ${trendColor}`}>
                <TrendIcon size={16} />
                <span className="ml-1 text-sm">{trend}</span>
              </div>
            </div>
            <div className={`p-3 ${iconBg} rounded-lg`}>
              <Icon className={iconColor} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}