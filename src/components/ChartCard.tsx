import { ReactNode } from "react"; // Importe ReactNode
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Wallet, Rocket, ShoppingCart, BarChart2 } from "lucide-react";

interface ChartCardProps {
  t: (key: string) => string;
  type: "bar" | "line";
  title: string;
  subtitle: ReactNode;
  data: any[];
}

export const ChartCard: React.FC<ChartCardProps> = ({
  t,
  type,
  title,
  subtitle,
  data,
}) => {
  return (
    <Card className="p-4 bg-[rgb(19,21,54)] border-none flex-1">
      <CardHeader className="mb-4 ps-6">
        <div className="flex flex-col p-6 space-y-2">
          <p className="text-lg text-white font-bold">{title}</p>
          <p className="text-md text-gray-400">{subtitle}</p>
        </div>
      </CardHeader>
      <CardContent>
        {type === "line" ? (
          <div className="w-full min-h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="5 5" stroke="#56577A" />
                <XAxis
                  dataKey="name"
                  stroke="#c8cfca"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#c8cfca" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey={t("user.entries")}
                  stroke="#2CD9FF"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={t("user.expenses")}
                  stroke="#582CFF"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="bg-gradient-to-r from-[#060C29] to-[#0A0E23] rounded-[20px] flex justify-center items-center min-h-[180px] p-6">
              <BarChart
                width={Math.min(window.innerWidth * 0.9, 400)} // Dynamic width
                height={220}
                data={data}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#56577A" />
                <XAxis dataKey="name" stroke="#fff" tick={{ fontSize: 12 }} />
                <YAxis stroke="#fff" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                />
                <Legend />
                <Bar
                  dataKey={t("charts.sales")}
                  fill="#582CFF"
                  radius={[8, 8, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </div>
            {/* Progress bars remain unchanged */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
