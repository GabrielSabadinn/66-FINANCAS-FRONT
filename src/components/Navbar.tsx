import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import { Menu, X } from "lucide-react";
import { Route } from "@/routes";
import { cn } from "@/lib/utils";
import Logo from "../assets/Logo.png";

interface NavbarProps {
  routes: Route[];
  iconColor?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  routes: propRoutes,
  iconColor = "white",
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<Record<string, boolean>>({});

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    i18n.changeLanguage(event.target.value);
  };

  // Array fixo de rotas que você pediu
  const fixedRoutes = ["/dashboard", "/profile", "/tables"];
  const isDashboard = fixedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const activeRoute = (routeName: string) => {
    return location.pathname === routeName ? "active" : "";
  };

  const createLinks = (routes: Route[], isMobile = false) => {
    return routes.map((prop, key) => {
      if (prop.redirect) return null;
      if (prop.category) {
        const st = { ...state, [prop.state!]: !state[prop.state!] };
        return (
          <div key={key}>
            <p
              className={`text-white font-bold mb-1 ps-2 py-1 ${
                isMobile ? "text-xs" : "text-sm"
              }`}
              onClick={() => setState(st)}
            >
              {t(prop.name!)}
            </p>
            {createLinks(prop.views || [], isMobile)}
          </div>
        );
      }
      return (
        <NavLink
          key={key}
          to={(prop.layout || "") + prop.path}
          className={({ isActive }) =>
            cn(
              "flex items-center w-full px-3 py-2 rounded-lg transition-colors",
              isActive
                ? "bg-violet-900 text-white"
                : "bg-transparent text-gray-400 hover:bg-violet-900/50",
              isMobile ? "text-xs" : "text-sm"
            )
          }
        >
          <div className="flex items-center">
            {typeof prop.icon === "string" ? (
              <span className="mr-2">{prop.icon}</span>
            ) : (
              <div
                className={`flex items-center justify-center w-5 h-5 mr-2 rounded-md ${
                  activeRoute((prop.layout || "") + prop.path) === "active"
                    ? "bg-violet-600"
                    : "bg-violet-900"
                }`}
              >
                {prop.icon}
              </div>
            )}
            <span>{t(prop.name!)}</span>
          </div>
        </NavLink>
      );
    });
  };

  const links = createLinks(propRoutes); // Usando propRoutes aqui
  const mobileLinks = createLinks(propRoutes, true);

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 text-white shadow-md h-14 md:h-16"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(71,5,138,1) 0%, rgba(22,10,33,1) 50%, rgba(71,5,138,1) 100%)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-40 h-5 mr-2 md:w-40 md:h-9" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-3">{links}</div>

        {/* Language Select (only on /dashboard, /profile, /tables) */}
        {isDashboard && (
          <div className="flex items-center">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-[rgb(19,21,54)] text-white border-none rounded-md px-2 py-1 text-xs md:text-sm focus:outline-none"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        )}

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="text-white hover:bg-violet-900/50"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="top">
        <DrawerOverlay />
        <DrawerContent
          className="bg-[rgb(19,21,54)] border-none w-full max-h-[70vh] rounded-b-lg"
          style={{
            backdropFilter: "blur(10px)",
            background:
              "linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)",
          }}
        >
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-violet-900/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="px-4 pb-4">
            <div className="mb-6">
              <Link to="/" className="flex items-center justify-center mb-4">
                <img src={Logo} alt="Logo" className="w-10 h-4 mr-2" />
              </Link>
              <div className="h-px bg-violet-900" />
            </div>
            <div className="space-y-1">{mobileLinks}</div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Navbar;
