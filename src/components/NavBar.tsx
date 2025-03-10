import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Title */}
        <h1 className="text-xl font-bold">Code Compilers</h1>

        {/* Right Side: Navigation Links */}
        <div className="space-x-6">
          <Link to="/html-compiler" className="hover:text-gray-400 transition">
            HTML Compiler
          </Link>
          <Link to="/cpp-compiler" className="hover:text-gray-400 transition">
            C++ Compiler
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
