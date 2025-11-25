import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PiggyBank,
  Wallet,
  LineChart,
  User,
  LogOut,
  ArrowLeftRight,
  Bell,
} from "lucide-react";
import { useAuthstore } from "../../store/useAuthStore";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Savings Plans", icon: PiggyBank, path: "/savings-plan" },
  { name: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
  { name: "Notifications", icon: Bell, path: "/balance" },
  { name: "Analytics", icon: LineChart, path: "/analytics" },
  { name: "Profile", icon: User, path: "/profile" },
];

const SideNav = () => {
  const location = useLocation();
  const { logOut } = useAuthstore()

  return (
    <div className="md:w-72 min-h-screen bg-main">
      <div className="p-5 text-alte flex flex-col justify-between">
        <h1 className="text-3xl flex items-center gap-2 font-bold"> <span><Wallet className="w-8 h-8 bg-text text-alte" /></span>SaveSmart</h1>

        <nav className="mt-8 flex gap-5 flex-col text-text">
          {navItems.map(({ name, icon: Icon, path }, index) => (
            <Link className={`flex w-full items-center p-4 gap-2 rounded ${location.pathname === path ? "bg-white text-gray-500" : "text-white"}`} key={index} to={path}>
              <span>
                <Icon className="w-4 h-4" />
              </span>
              <p>{name}</p>
            </Link>
          ))}
        </nav>

        <div className="mt-14 mx-2">
          <button onClick={logOut} className="flex items-center gap-2 text-white" to="/logout">
            <LogOut  className="w-4 h-4" />
            <p>LogOut</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
