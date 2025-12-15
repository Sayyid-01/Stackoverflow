import React, { ReactNode, useState, useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import RightSideBar from "../RightSideBar";
import { useRouter } from "next/router";

interface MainLayoutProps {
  children: ReactNode;
  dim?: boolean; // NEW PROP
}

const MainLayout = ({ children, dim = false }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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

  // Hide RightSideBar only on /tag routes
  const hideRightSidebar = router.pathname.startsWith("/tag") || router.pathname.startsWith("/users");;
  
  return (
    <div className="relative">

      {/* 🌙 Overlay for dim + blur background */}
      {dim && (
        <div className="
          fixed inset-0 
          bg-black/40 
          backdrop-blur-sm 
          z-40 
          pointer-events-auto
          transition-all duration-300
        "></div>
      )}

      {/* Main layout content */}
      <div
        className={`
          relative z-30 
          flex flex-col 
          h-screen 
          overflow-auto 
          w-[85vw] 
          m-auto 
          transition-all duration-300 
          ${dim ? "pointer-events-none" : ""}
        `}
      >
        <Navbar handleSlideIn={handleSlideIn} />

        <div className="flex flex-1 pt-14">
          <Sidebar isOpen={sidebarOpen} closeSidebar={handleLinkClick} />

          <main className="flex-1 min-h-screen overflow-auto p-4 bg-gray-50">
            {children}
          </main>

          {!hideRightSidebar && (
            <div className="hidden md:block border-l border-gray-200">
              <RightSideBar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
