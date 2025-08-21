import { Menu } from "lucide-react";
import MerkleLogo from "../images/MerkleLogo";
import { useGlobalStore } from "@/store";

export default function Header() {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalStore();
  return (
    <div className="px-4 md:px-2 py-3 flex items-center justify-between md:justify-start">
      <div className="flex items-center justify-start">
        <button
          className="md:hidden mr-2 p-2 bg-white rounded-sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-4 w-4 text-gray-600" />
        </button>
        <div className="flex items-center md:w-64">
          <MerkleLogo className="h-4 md:h-6 w-auto" />
        </div>
      </div>
      <div className="font-medium text-[11px] text-white">Tracker Chat</div>
    </div>
  );
}
