import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { navbarRoutes } from "../routes";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar routes={navbarRoutes} />
      <div>
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
