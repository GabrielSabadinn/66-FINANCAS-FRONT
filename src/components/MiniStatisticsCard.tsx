import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MiniStatisticsCardProps {
  title: string;
  value: number | string;
  percentage?: string;
  percentageColor?: string;
  icon: LucideIcon;
}

export const MiniStatisticsCard: React.FC<MiniStatisticsCardProps> = ({
  title,
  value,
  percentage = "",
  percentageColor = "text-gray-400",
  icon: Icon,
}) => {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString("en-US") : value;

  return (
    <Card className="bg-[rgb(19,21,54)] border-none">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-1">{title}</p>
            <div className="flex items-center gap-1">
              <p className="text-lg text-white md:text-xl">${formattedValue}</p>
              {percentage && (
                <p className={`${percentageColor} font-bold text-xs`}>
                  {percentage}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center w-9 h-9 bg-violet-600 rounded-lg md:w-10 md:h-10">
            <Icon className="w-4 h-4 text-white md:w-5 md:h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
