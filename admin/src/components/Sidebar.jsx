import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiMessage3Line,
  RiAddCircleLine,
  RiListSettingsLine,
  RiShoppingBag3Line,
  RiMapPinLine,
  RiHistoryLine,
  RiFileList2Line,
  RiUser3Line,
  RiShieldUserLine,
  RiBookOpenLine,
  RiFlagLine
} from "react-icons/ri";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const { role } = useContext(AppContext);

  let menuItems = [];

  if (role === 'admin') {
    // Child Admin: Limited Access
    menuItems = [
      { path: "/add", label: "Add Items", Icon: RiAddCircleLine },
      { path: "/list", label: "List Items", Icon: RiListSettingsLine },
      { path: "/list-tours", label: "List Tours", Icon: RiFlagLine },
      { path: "/orders", label: "Orders", Icon: RiShoppingBag3Line },
    ];
  } else {
    // Master Admin (or default full access if role not set yet to avoid empty sidebar)
    menuItems = [
      { path: "/dashboard", label: "Dashboard", Icon: RiDashboardLine },
      { path: "/messages", label: "Messages", Icon: RiMessage3Line },
      { path: "/add", label: "Add Items", Icon: RiAddCircleLine },
      { path: "/list", label: "List Items", Icon: RiListSettingsLine },
      { path: "/orders", label: "Orders", Icon: RiShoppingBag3Line },
      { path: "/bookings", label: "Bookings", Icon: RiMapPinLine },
      { path: "/add-story", label: "Add Story", Icon: RiFileList2Line },
      { path: "/list-stories", label: "List Stories", Icon: RiHistoryLine },
      { path: "/users", label: "Users", Icon: RiUser3Line },
      { path: "/add-publication", label: "Add Publication", Icon: RiBookOpenLine },
      { path: "/list-publications", label: "List Publications", Icon: RiHistoryLine },
      { path: "/list-tours", label: "List Tours", Icon: RiFlagLine },
    ];
    // if (role === 'master_admin') {
    //   menuItems.push({ path: "/manage-admins", label: "Manage Admins", Icon: RiShieldUserLine });
    // }
  }

  return (
    <>
      {/* Premium Desktop Sidebar */}
      <div className="hidden md:flex w-[20%] fixed left-0 top-0 h-screen bg-gray-900 flex-col py-8 px-6 shadow-2xl z-40 transition-all duration-500 ease-in-out">
        {/* Brand/Logo Section */}
        <div className="flex items-center gap-3 px-4 mb-12">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
            <img className="w-7 h-auto" src={assets.logo} alt="Logo" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-black text-sm uppercase tracking-tighter">Kharnak</h1>
            <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest">Admin Nexus</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Core Management</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.Icon className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`} />
                  <p className="text-[13px] font-bold  tracking-tight whitespace-nowrap">{item.label}</p>
                </>
              )}
            </NavLink>
          ))}
        </div>

      </div>

      {/* Spacer for Fixed Sidebar on Large Screens */}
      <div className="hidden md:block w-[20%]"></div>

      {/* Premium Mobile Bottom Navigation - X-Axis Scrollable */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 rounded-[2rem] overflow-hidden">
        <div className="flex items-center gap-8 py-5 px-8 overflow-x-auto no-scrollbar whitespace-nowrap snap-x">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 transition-all duration-300 snap-center
                ${isActive ? 'text-blue-400 scale-110' : 'text-gray-500'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.Icon className="text-2xl" />
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    {item.label.split(' ')[0]}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
