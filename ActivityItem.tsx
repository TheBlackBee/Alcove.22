import { useTranslation } from "react-i18next";
import { format, isToday, isYesterday } from "date-fns";
import { Activity } from "@/types";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const { t } = useTranslation();
  
  // Determine icon and color based on activity type
  let iconColor = "text-primary";
  let bgColor = "bg-primary bg-opacity-10";
  let icon = "reply";
  
  if (activity.type === "create") {
    iconColor = "text-success";
    bgColor = "bg-success bg-opacity-10";
    icon = "plus";
  } else if (activity.type === "edit") {
    iconColor = "text-warning";
    bgColor = "bg-warning bg-opacity-10";
    icon = "edit";
  }
  
  // Format the date
  const activityDate = new Date(activity.timestamp);
  let dateLabel = format(activityDate, "MMM d, h:mm a");
  
  if (isToday(activityDate)) {
    dateLabel = `${t("today")}, ${format(activityDate, "h:mm a")}`;
  } else if (isYesterday(activityDate)) {
    dateLabel = `${t("yesterday")}, ${format(activityDate, "h:mm a")}`;
  }
  
  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${bgColor} flex items-center justify-center`}>
        <i className={`fas fa-${icon} ${iconColor} text-xs`}></i>
      </div>
      <div className="ml-3">
        <p className="text-sm">
          <span className="font-medium text-neutral-400">
            {activity.templateTitle}
          </span>
          {" "}
          {activity.type === "send" && (
            <>
              {t("responseSent")}{" "}
              <span className="font-medium text-neutral-400">
                {activity.recipient}
              </span>
            </>
          )}
          {activity.type === "create" && t("templateCreated")}
          {activity.type === "edit" && t("templateEdited")}
        </p>
        <p className="text-xs text-neutral-300 mt-1">
          {dateLabel} · {activity.language === "multiple" 
            ? t("multipleLanguages") 
            : `${t("inLanguage")} ${activity.language}`}
        </p>
      </div>
    </div>
  );
}
