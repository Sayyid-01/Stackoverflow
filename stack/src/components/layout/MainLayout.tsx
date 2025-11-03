import React, { ReactNode, useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import RightSideBar from "../RightSideBar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSlideIn = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-col h-screen overflow-auto">
      <Navbar handleSlideIn={handleSlideIn} />

      <div className="flex flex-1 pt-14">
        <Sidebar isOpen={sidebarOpen} closeSidebar={handleLinkClick} />
        <main className="flex-1 min-h-screen overflow-auto p-4 bg-gray-50">{children}</main>
        <div className="hidden md:block border-l border-gray-200">
          <RightSideBar />
        </div>
    </div>
    </div>
  );
};

export default MainLayout;
