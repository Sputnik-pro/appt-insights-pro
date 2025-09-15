import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: "primary" | "secondary" | "success" | "warning" | "destructive";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  format?: "number" | "percentage" | "currency";
}

export function MetricCard({ title, value, icon: Icon, color, trend, format = "number" }: MetricCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case "percentage":
        return `${val.toFixed(1)}%`;
      case "currency":
        return `R$ ${val.toLocaleString('pt-BR')}`;
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  const getColorClasses = (colorType: string) => {
    const colorMap = {
      primary: {
        bg: "bg-primary",
        text: "text-primary-foreground",
        accent: "bg-primary/10 text-primary"
      },
      secondary: {
        bg: "bg-secondary",
        text: "text-secondary-foreground", 
        accent: "bg-secondary/10 text-secondary"
      },
      success: {
        bg: "bg-success",
        text: "text-success-foreground",
        accent: "bg-success/10 text-success"
      },
      warning: {
        bg: "bg-warning",
        text: "text-warning-foreground",
        accent: "bg-warning/10 text-warning"
      },
      destructive: {
        bg: "bg-destructive",
        text: "text-destructive-foreground",
        accent: "bg-destructive/10 text-destructive"
      }
    };
    return colorMap[colorType as keyof typeof colorMap];
  };

  const colors = getColorClasses(color);

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-foreground animate-counter">
              {formatValue(value)}
            </h3>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-success' : 'text-destructive'
              }`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        
        <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${colors.accent}`}>
            vs. período anterior
          </div>
        </div>
      )}
    </div>
  );
}