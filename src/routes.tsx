import { Navigate } from "react-router-dom";
import { Home, LayoutDashboard, User, LogOut, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import TransactionTablePage from "@/pages/TransactionTablePage";
import InvestmentTablePage from "@/pages/InvestmentTablePage";
import FixedCostTablePage from "@/pages/FixedCostTablePage";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export interface Route {
  layout?: string;
  path: string;
  name?: string;
  icon?: React.ReactNode;
  redirect?: boolean;
  category?: boolean;
  state?: string;
  views?: Route[];
  rtlName?: string;
  element?: React.ReactNode;
  children?: Route[];
}

function AppWrapper() {
  const { i18n } = useTranslation();
  const location = useLocation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    i18n.changeLanguage(event.target.value);
  };

  const showSelectInApp =
    location.pathname === "/auth/signin" ||
    location.pathname === "/auth/signup";

  return (
    <div className="relative min-h-screen">
      {showSelectInApp && (
        <div className="absolute top-4 right-4 z-1000">
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="bg-[rgb(19,21,54)] text-white border-none rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
      )}
      <Outlet />
    </div>
  );
}

export const routes: Route[] = [
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      {
        path: "/",
        redirect: true,
        element: <Navigate to="/auth/signin" replace />,
      },
      {
        path: "/auth/signin",
        name: "sign_in",
        element: <SignIn />,
      },
      {
        path: "/auth/signup",
        name: "sign_up",
        element: <SignUp />,
      },
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            name: "dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
            element: <Dashboard />,
          },
          {
            path: "/profile",
            name: "profile",
            icon: <User className="w-4 h-4" />,
            element: <Profile />,
          },
          {
            path: "/transactions",
            name: "transactions",
            icon: <Table2 className="w-4 h-4" />,
            element: <TransactionTablePage />,
          },
          {
            path: "/investments",
            name: "investments",
            icon: <Table2 className="w-4 h-4" />,
            element: <InvestmentTablePage />,
          },
          {
            path: "/fixed-costs",
            name: "fixed_costs",
            element: <FixedCostTablePage />,
            icon: <Table2 className="w-4 h-4" />,
          },
        ],
      },
    ],
  },
];

export const navbarRoutes: Route[] = routes
  .flatMap((route) => (route.children ? route.children : route))
  .flatMap((route) => (route.children ? route.children : route))
  .filter((route): route is Route => !!route.name && !!route.icon)
  .concat({
    layout: "",
    path: "/auth/signin",
    name: "sign_out",
    icon: <LogOut className="w-4 h-4" />,
  });
