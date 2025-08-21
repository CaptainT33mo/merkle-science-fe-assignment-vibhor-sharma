import { useGlobalStore } from "@/store";
import { Home, MessageCircle, PanelLeftClose, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  icon?: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarNavItem = ({
  to,
  icon: Icon,
  label,
  isActive,
  onClick
}: SidebarNavItemProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`sidebar-item w-full text-left flex items-center pr-4 pl-2 py-3 text-gray-700 hover:bg-gray-100 transition-colors rounded-md ${
        isActive ? "bg-blue-50 !text-blue-700" : ""
      }`}
    >
      {Icon && (
        <Icon
          className={`h-5 w-5 mr-3 ${isActive ? "text-blue-700" : "text-gray-500"}`}
        />
      )}
      {label}
    </Link>
  );
};

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalStore();
  const location = useLocation();

  const menuItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" }
  ];

  const sidebarContent = (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col rounded-md">
      <div className="p-4 flex items-center justify-between">
        <div
          className="w-6 h-6 bg-white border rounded flex items-center justify-center"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <PanelLeftClose className="w-4 h-4" />
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            to={item.path}
            isActive={location.pathname === item.path}
            // icon={item.icon}
            label={item.label}
            onClick={() => setIsSidebarOpen(false)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <SidebarNavItem
          to="/settings"
          isActive={location.pathname === "/settings"}
          // icon={Settings}
          label="Settings"
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-72 h-full p-2">{sidebarContent}</div>
    </>
  );
}
