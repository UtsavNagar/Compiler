import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { User } from 'firebase/auth';
import { signInWithGoogle, auth } from '../firebase/firebase';

// icons
import { RiChat3Line } from "react-icons/ri";
import { LuLogIn } from "react-icons/lu";
import { FaRegUserCircle } from 'react-icons/fa';

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavigation = async (path: string) => {
    if (!user) {
      try {
        const loggedInUser = await signInWithGoogle();
        if (loggedInUser) {
          navigate(path);
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-700 bg-gray-900 text-white relative">
      <div className="flex items-center space-x-2">
        <CodeIcon />
        <Link to={"/"}>
          <span className="font-bold text-xl">CodeCompile</span>
        </Link>
      </div>
      <div className="hidden md:flex space-x-6 items-center">
        <span
          onClick={() => handleNavigation("/html-compiler")}
          className="hover:text-blue-400 transition cursor-pointer"
        >
          HTML Compiler
        </span>
        <span
          onClick={() => handleNavigation("/compilers")}
          className="hover:text-blue-400 transition cursor-pointer"
        >
          Compilers
        </span>
        <span
          onClick={() => handleNavigation("/code-converter")}
          className="hover:text-blue-400 transition cursor-pointer"
        >
          AI Converter
        </span>
        <span
          onClick={() => handleNavigation("/chat-section")}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold transition cursor-pointer"
        >
          <RiChat3Line />
        </span>

        {/* User Profile Section */}
        {user ? (
          <div className="relative">
            {user.photoURL ? (
              <img
                src={user.photoURL.toString()}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            ) : (
              <FaRegUserCircle
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full cursor-pointer text-gray-300"
              />
            )}

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                <div className="px-4 py-2 text-sm">
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-gray-400 truncate">{user.email}</p>
                </div>
                <hr className="border-gray-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold transition"
          >
            <LuLogIn />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;