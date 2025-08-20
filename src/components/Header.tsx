import { Menu } from "lucide-react";
import MerkleLogo from "./images/MerkleLogo";
import { useGlobalStore } from "@/store";

export const Header = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalStore();
  return (
    <div className="border-b border-gray-200 px-4 md:px-6 py-4 flex items-center">
      <div className="flex items-center flex-1">
        <button
          className="md:hidden mr-4 p-1"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-3">
          <MerkleLogo />
        </div>
      </div>
      <div className="text-gray-600 font-medium text-sm md:text-base">
        Tracker Chat
      </div>
    </div>
  );
};
