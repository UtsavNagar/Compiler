import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HtmlCompiler from "./components/HtmlCompiler";
import CppCompiler from "./components/CppCompiler";
import HomePage from "./components/HomePage";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/html-compiler" element={<HtmlCompiler />} />
        <Route path="/cpp-compiler" element={<CppCompiler />} />
      </Routes>
    </>
  );
};

export default App;
