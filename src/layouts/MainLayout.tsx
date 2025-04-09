import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { navbarRoutes } from "../routes";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar logoText="SIMMMPLE" routes={navbarRoutes} />
      <div className="pt-16">
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
