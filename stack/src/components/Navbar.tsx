import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useSearch } from "@/context/SearchContext";

interface NavbarProps {
  handleSlideIn: () => void;
}

const Navbar = ({ handleSlideIn }: NavbarProps) => {
  const { user, Logout } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogout = () => {
    console.log("Logout");
    Logout?.();
  };

  if (!hasMounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-[70] flex items-center justify-evenly px-2 h-14 border-b">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded"
          onClick={handleSlideIn}
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Nav Links Desktop only */}
        <div className="hidden md:flex items-center gap-6 ml-4">
          {["About", "Products", "public-space"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Center Section - Search Bar */}
      <form
        action=""
        className="hidden sm:flex flex-1 justify-center px-4 w-full max-w-xl"
      >
        <div className="flex items-center w-full max-w-md border border-gray-300 rounded-md bg-gray-50 focus-within:ring-2 focus-within:ring-orange-400">
          <Search className="ml-2 h-4 w-4 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search Questions..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none"
          />
        </div>
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href={`/users/${user._id}`}
              className="text-sm font-medium hover:bg-orange-800 hover:text-white transition-colors w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center"
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
            <Button
              onClick={handleLogout}
              className="border border-blue-300 text-blue-300 hover:bg-orange-200 hover:text-blue-500 cursor-pointer text-sm px-3 py-1 rounded-md"
            >
              Logout
            </Button>
          </>
        ) : (
          <> 
          <Link href="/auth">
            <Button className="border border-blue-500 hover:bg-blue-200 text-blue-500 text-sm px-2  rounded-md">
              Login
            </Button>
          </Link>
            <Link href="/signup">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2  rounded-md">
                Sign up
              </Button>
            </Link>
          </>

        )}
      </div>


      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="fixed bottom-6 right-6 p-1 rounded-full shadow-xl bg-blue-500 hover:bg-blue-800 transition"
      >
        <img
          src="/images.jpeg"
          alt="chatbot"
          className={`w-12 h-12 rounded-full ${!isOpen && !isHover ? "animate-softPulse" : ""
            }`}
        />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden animate-slideUp">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/-KJj1DXp5McqsKHNkjmCW"
            className="w-full h-full"

          ></iframe>
        </div>
      )}

    </nav>
  );
};

export default Navbar;

