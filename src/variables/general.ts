// src/variables/general.ts
import {
  Bell,
  FileCode,
  ShoppingCart,
  CreditCard,
  File,
  ArrowDown,
  ArrowUp,
  AlertCircle,
} from "lucide-react";

// Assets (replace with your actual image paths)
import avatar1 from "@/assets/img/avatars/avatar1.png";
import avatar2 from "@/assets/img/avatars/avatar2.png";
import avatar3 from "@/assets/img/avatars/avatar3.png";
import avatar4 from "@/assets/img/avatars/avatar4.png";
import avatar5 from "@/assets/img/avatars/avatar5.png";
import avatar7 from "@/assets/img/avatars/avatar7.png";
import avatar8 from "@/assets/img/avatars/avatar8.png";
import avatar9 from "@/assets/img/avatars/avatar9.png";
import avatar10 from "@/assets/img/avatars/avatar10.png";

// Custom icons (replaced with lucide-react icons)
const AdobexdLogo = FileCode; // Placeholder for AdobexdLogo
const AtlassianLogo = FileCode; // Placeholder for AtlassianLogo
const InvisionLogo = FileCode; // Placeholder for InvisionLogo
const JiraLogo = FileCode; // Placeholder for JiraLogo
const SlackLogo = FileCode; // Placeholder for SlackLogo
const SpotifyLogo = FileCode; // Placeholder for SpotifyLogo

export interface DashboardTableRowData {
  logo: typeof FileCode; // Use the icon component type
  name: string;
  members: string[];
  budget: string;
  progression: number;
}

export const dashboardTableData: DashboardTableRowData[] = [
  {
    logo: AdobexdLogo,
    name: "Chakra Soft UI Version",
    members: [avatar1, avatar2, avatar3, avatar4, avatar5],
    budget: "$14,000",
    progression: 60,
  },
  {
    logo: AtlassianLogo,
    name: "Add Progress Track",
    members: [avatar3, avatar2],
    budget: "$3,000",
    progression: 10,
  },
  {
    logo: SlackLogo,
    name: "Fix Platform Errors",
    members: [avatar10, avatar4],
    budget: "Not set",
    progression: 100,
  },
  {
    logo: SpotifyLogo,
    name: "Launch our Mobile App",
    members: [avatar2, avatar3, avatar7, avatar8],
    budget: "$32,000",
    progression: 100,
  },
  {
    logo: JiraLogo,
    name: "Add the New Pricing Page",
    members: [avatar10, avatar3, avatar7, avatar2, avatar8],
    budget: "$400",
    progression: 25,
  },
  {
    logo: InvisionLogo,
    name: "Redesign New Online Shop",
    members: [avatar9, avatar3, avatar2],
    budget: "$7,600",
    progression: 40,
  },
];

export interface TimelineRowData {
  logo: typeof Bell; // Use the icon component type
  title: string;
  date: string;
  color: string;
}

export const timelineData: TimelineRowData[] = [
  {
    logo: Bell,
    title: "$2400, Design changes",
    date: "22 DEC 7:20 PM",
    color: "brand.200",
  },
  {
    logo: FileCode,
    title: "New order #4219423",
    date: "21 DEC 11:21 PM",
    color: "orange",
  },
  {
    logo: ShoppingCart,
    title: "Server Payments for April",
    date: "21 DEC 9:28 PM",
    color: "blue.400",
  },
  {
    logo: CreditCard,
    title: "New card added for order #3210145",
    date: "20 DEC 3:52 PM",
    color: "orange.300",
  },
  {
    logo: File,
    title: "Unlock packages for Development",
    date: "19 DEC 11:35 PM",
    color: "purple",
  },
  {
    logo: AdobexdLogo,
    title: "New order #9851258",
    date: "18 DEC 4:41 PM",
    color: "brand.200",
  },
];

export interface TablesTableData {
  logo: string;
  name: string;
  email: string;
  subdomain: string;
  domain: string;
  status: string;
  date: string;
}

export const tablesTableData: TablesTableData[] = [
  {
    logo: avatar1,
    name: "Esthera Jackson",
    email: "alexa@simmmple.com",
    subdomain: "Manager",
    domain: "Organization",
    status: "Online",
    date: "14/06/21",
  },
  {
    logo: avatar2,
    name: "Alexa Liras",
    email: "laurent@simmmple.com",
    subdomain: "Programmer",
    domain: "Developer",
    status: "Offline",
    date: "12/05/21",
  },
  {
    logo: avatar3,
    name: "Laurent Michael",
    email: "laurent@simmmple.com",
    subdomain: "Executive",
    domain: "Projects",
    status: "Online",
    date: "07/06/21",
  },
  {
    logo: avatar4,
    name: "Freduardo Hill",
    email: "freduardo@simmmple.com",
    subdomain: "Manager",
    domain: "Organization",
    status: "Online",
    date: "14/11/21",
  },
  {
    logo: avatar5,
    name: "Daniel Thomas",
    email: "daniel@simmmple.com",
    subdomain: "Programmer",
    domain: "Developer",
    status: "Offline",
    date: "21/01/21",
  },
  {
    logo: avatar7,
    name: "Mark Wilson",
    email: "mark@simmmple.com",
    subdomain: "Designer",
    domain: "UI/UX Design",
    status: "Offline",
    date: "04/09/20",
  },
];

export interface TablesProjectData {
  logo: typeof FileCode;
  name: string;
  budget: string;
  status: string;
  progression: number;
}

export const tablesProjectData: TablesProjectData[] = [
  {
    logo: AdobexdLogo,
    name: "Vision UI Version",
    budget: "$14,000",
    status: "Working",
    progression: 60,
  },
  {
    logo: AtlassianLogo,
    name: "Add Progress Track",
    budget: "$3,000",
    status: "Canceled",
    progression: 10,
  },
  {
    logo: SlackLogo,
    name: "Fix Platform Errors",
    budget: "Not set",
    status: "Done",
    progression: 100,
  },
  {
    logo: SpotifyLogo,
    name: "Launch our Mobile App",
    budget: "$32,000",
    status: "Done",
    progression: 100,
  },
  {
    logo: JiraLogo,
    name: "Add the New Pricing Page",
    budget: "$400",
    status: "Working",
    progression: 25,
  },
];

export interface InvoiceData {
  date: string;
  code: string;
  price: string;
  logo: typeof File;
  format: string;
}

export const invoicesData: InvoiceData[] = [
  {
    date: "March, 01, 2020",
    code: "#MS-415646",
    price: "$180",
    logo: File,
    format: "PDF",
  },
  {
    date: "February, 10, 2020",
    code: "#RV-126749",
    price: "$250",
    logo: File,
    format: "PDF",
  },
  {
    date: "April, 05, 2020",
    code: "#FB-212562",
    price: "$560",
    logo: File,
    format: "PDF",
  },
  {
    date: "June, 25, 2019",
    code: "#QW-103578",
    price: "$120",
    logo: File,
    format: "PDF",
  },
  {
    date: "March, 01, 2019",
    code: "#AR-803481",
    price: "$300",
    logo: File,
    format: "PDF",
  },
];

export interface BillingData {
  name: string;
  company: string;
  email: string;
  number: string;
}

export const billingData: BillingData[] = [
  {
    name: "Oliver Liam",
    company: "Viking Burrito",
    email: "oliver@burrito.com",
    number: "FRB1235476",
  },
  {
    name: "Lucas Harper",
    company: "Stone Tech Zone",
    email: "lucas@stone-tech.com",
    number: "FRB1235476",
  },
  {
    name: "Ethan James",
    company: "Fiber Notion",
    email: "ethan@fiber.com",
    number: "FRB1235476",
  },
];

export interface TransactionData {
  name: string;
  date: string;
  price: string;
  logo: typeof ArrowDown | typeof ArrowUp | typeof AlertCircle;
}

export const newestTransactions: TransactionData[] = [
  {
    name: "Netflix",
    date: "27 March 2021, at 12:30 PM",
    price: "- $2,500",
    logo: ArrowDown,
  },
  {
    name: "Apple",
    date: "27 March 2021, at 12:30 PM",
    price: "+ $2,500",
    logo: ArrowUp,
  },
];

export const olderTransactions: TransactionData[] = [
  {
    name: "Stripe",
    date: "26 March 2021, at 13:45 PM",
    price: "+ $800",
    logo: ArrowUp,
  },
  {
    name: "HubSpot",
    date: "26 March 2021, at 12:30 PM",
    price: "+ $1,700",
    logo: ArrowUp,
  },
  {
    name: "Webflow",
    date: "26 March 2021, at 05:00 PM",
    price: "Pending",
    logo: AlertCircle,
  },
  {
    name: "Microsoft",
    date: "25 March 2021, at 16:30 PM",
    price: "- $987",
    logo: ArrowDown,
  },
];
