import { Link } from "react-router-dom";

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

// Navbar Component
const Navbar = () => {
  return (
    <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-700 bg-gray-900 text-white">
      <div className="flex items-center space-x-2">
        <CodeIcon />
        <Link to={"/"}> <span className="font-bold text-xl">CodeCompile</span> </Link>
      </div>
      <div className="hidden md:flex space-x-6">
        <Link to="/html-compiler" className="hover:text-blue-400 transition">HTML Compiler</Link>
        <Link to="/compilers" className="hover:text-blue-400 transition">Compilers</Link>
        <Link to="/code-converter" className="hover:text-blue-400 transition">AI Converter</Link>
      </div>
      <Link to={"/chat-section"}> <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold transition">
        Start Chat
      </button>
      </Link>
    </nav>
  );
};

export default Navbar;
