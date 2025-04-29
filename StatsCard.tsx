import { useTranslation } from "react-i18next";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatsCardProps {
  icon: string;
  iconColor: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  title: string;
  value: string;
  trend?: number;
  trendText: string;
  hideTrendIcon?: boolean;
}

export default function StatsCard({
  icon,
  iconColor,
  title,
  value,
  trend = 0,
  trendText,
  hideTrendIcon = false
}: StatsCardProps) {
  const { t } = useTranslation();
  
  const getIconColorClass = () => {
    switch (iconColor) {
      case "primary": return "text-primary";
      case "secondary": return "text-secondary";
      case "accent": return "text-accent";
      case "success": return "text-success";
      case "warning": return "text-warning";
      case "error": return "text-error";
      default: return "text-primary";
    }
  };
  
  const getBgColorClass = () => {
    switch (iconColor) {
      case "primary": return "bg-primary bg-opacity-10";
      case "secondary": return "bg-secondary bg-opacity-10";
      case "accent": return "bg-accent bg-opacity-10";
      case "success": return "bg-success bg-opacity-10";
      case "warning": return "bg-warning bg-opacity-10";
      case "error": return "bg-error bg-opacity-10";
      default: return "bg-primary bg-opacity-10";
    }
  };
  
  const getTrendColorClass = () => {
    if (trend > 0) return "text-success";
    if (trend < 0) return "text-error";
    return "text-neutral-300";
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${getBgColorClass()} p-3 rounded-md`}>
          <i className={`fas fa-${icon} ${getIconColorClass()}`}></i>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-neutral-300">{title}</p>
          <p className="text-2xl font-semibold text-neutral-400">{value}</p>
        </div>
      </div>
      <div className={`mt-3 text-sm ${getTrendColorClass()} flex items-center`}>
        {!hideTrendIcon && (
          <>
            {trend > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4" />
            ) : trend < 0 ? (
              <ArrowDownIcon className="mr-1 h-4 w-4" />
            ) : null}
          </>
        )}
        <span>{trendText}</span>
      </div>
    </div>
  );
}
