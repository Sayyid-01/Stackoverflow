import React, { useState } from "react";
import Link from "next/link";
import { Badge, Bot, Building, FileText, Home, MessageSquare, MessageSquareIcon, Tag, Trophy, Users, Bookmark } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const [isOpen2, setIsOpen2] = useState(false);
  return (
    <>
    <aside
      className={`fixed left-0 top-14 h-[94vh] w-64 bg-white shadow-lg transform 
  ${isOpen ? "translate-x-0" : "-translate-x-full"} 
  transition-transform duration-300 ease-in-out 
  md:translate-x-0 md:sticky z-[60] overflow-auto`}
    >
      <div className="pt-14 p-4">
        <nav>
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Home className="w-4 h-4 mr-2 lg:mr-3"  strokeWidth={3.5}/>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/questions"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <MessageSquareIcon className="w-4 h-4 mr-2 lg:mr-3 font-extrabold" strokeWidth={3.5}/>
                Questions
              </Link>
            </li>
            <li>
              <button
              className="flex w-full items-center text-gray-700 hover:bg-gray-100 rounded text-sm"
                onClick={() => setIsOpen2(!isOpen2)}
              >
                <Link
                  href="#"
                  className="flex w-full items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                >
                  <Bot className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5} />
                  AI Assist
                  <div className="ml-auto text-xs  text-green-800 font-bold px-1 rounded">
                    LAB

                  </div>
                </Link>
              </button>
            </li>
            <li>
              <Link
                href="/tags"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Tag className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5}/>
                Tags
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Users className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5}/>
                Users
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Bookmark className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5}/>
                Saves
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex w-full items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Trophy className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5}/>
                Challenges
                <div className="ml-auto text-xs bg-orange-100 text-orange-800 px-2 rounded">
                  NEW
                </div>
              </Link>

            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <MessageSquare className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5}/>
                Chat
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <FileText className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5}/>
                Articles
              </Link>
            </li>

            <li>
              <Link
                href="#"
                className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                <Building className="w-4 h-4 mr-2 lg:mr-3" strokeWidth={3.5}/>
                Companies
              </Link>
            </li>
          </ul>
        </nav>
        
      </div>
    </aside>
    {isOpen2 && (
        <div className="z-50 fixed bottom-20 right-6 w-96 h-[80vh] bg-white rounded-xl shadow-xl overflow-hidden animate-slideUp">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/-KJj1DXp5McqsKHNkjmCW"
            className="w-full h-full"

          ></iframe>
        </div>
      )}
    </>
  );
};

export default Sidebar;
