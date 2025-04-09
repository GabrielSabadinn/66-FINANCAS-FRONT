import { TableRow } from "./ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { LucideIcon } from "lucide-react";

interface DashboardTableRowProps {
  name: string;
  logo: LucideIcon;
  members: string[];
  budget: string;
  progression: number;
  lastItem?: boolean;
}

export const DashboardTableRow: React.FC<DashboardTableRowProps> = ({
  name,
  logo: Logo,
  members,
  budget,
  progression,
  lastItem,
}) => {
  return (
    <TableRow className={`${lastItem ? "" : "border-b border-violet-900"}`}>
      <td className="py-4 px-4">
        <div className="flex items-center">
          <Logo className="w-6 h-6 mr-2 text-violet-400 shrink-0" />
          <span className="text-sm text-white truncate">{name}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex -space-x-2">
          {members.map((member, index) => (
            <Avatar key={index} className="w-6 h-6 border-2 border-black">
              <AvatarImage src={member} alt="member" />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-white">{budget}</td>
      <td className="py-4 px-4 text-sm text-white">{progression}%</td>
    </TableRow>
  );
};
