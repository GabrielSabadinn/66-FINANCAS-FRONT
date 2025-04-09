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
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Wallet, Rocket, ShoppingCart, BarChart2 } from "lucide-react";

interface ChartCardProps {
  t: (key: string) => string;
  type: "bar" | "line";
  title: string;
  subtitle: ReactNode; // Alterado de string para ReactNode
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
            <LineChart width={550} height={300} data={data}>
              <CartesianGrid strokeDasharray="5 5" stroke="#56577A" />
              <XAxis dataKey="name" stroke="#c8cfca" tick={{ fontSize: 12 }} />
              <YAxis stroke="#c8cfca" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey={t("charts.mobile_apps")}
                stroke="#2CD9FF"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={t("charts.websites")}
                stroke="#582CFF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="bg-gradient-to-r from-[#060C29] to-[#0A0E23] rounded-[20px] flex justify-center items-center min-h-[180px] p-6">
              <BarChart width={400} height={220} data={data}>
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
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-violet-600 rounded-lg mb-2">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-400">{t("charts.market")}</p>
                <p className="text-md text-white font-bold my-2">R$ 1,200</p>
                <Progress
                  value={20}
                  className="h-1 rounded-full bg-violet-900 [&>div]:bg-violet-400 w-full"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-violet-600 rounded-lg mb-2">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-400">{t("charts.leisure")}</p>
                <p className="text-md text-white font-bold my-2">R$ 800</p>
                <Progress
                  value={50}
                  className="h-1 rounded-full bg-violet-900 [&>div]:bg-violet-400 w-full"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-violet-600 rounded-lg mb-2">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-400">
                  {t("charts.fixed_costs")}
                </p>
                <p className="text-md text-white font-bold my-2">R$ 2,400</p>
                <Progress
                  value={70}
                  className="h-1 rounded-full bg-violet-900 [&>div]:bg-violet-400 w-full"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-violet-600 rounded-lg mb-2">
                  <BarChart2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-400">
                  {t("charts.investments")}
                </p>
                <p className="text-md text-white font-bold my-2">R$ 1,500</p>
                <Progress
                  value={40}
                  className="h-1 rounded-full bg-violet-900 [&>div]:bg-violet-400 w-full"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
