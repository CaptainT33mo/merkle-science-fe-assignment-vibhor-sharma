import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="h-screen flex flex-col merkle-gradient overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
});
