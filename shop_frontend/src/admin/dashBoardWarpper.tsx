import React from "react";
import { useAppSelector } from "../../store/redux";
import Sidebar from "./components/sidebar/sidebar";
import Navbar from "./components/navbar/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const resolvedTheme = useAppSelector(
    (state) => state.global.resolvedTheme
  );

  return (
    <div
      className={`flex min-h-screen w-full ${
        resolvedTheme === "dark"
          ? "bg-black text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar />

      <main
        className={`flex w-full flex-col transition-all ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardWrapper;
