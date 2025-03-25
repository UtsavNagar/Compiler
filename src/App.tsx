import { Routes, Route } from "react-router-dom";
import HtmlCompiler from "./components/HtmlCompiler";
import CppCompiler from "./components/CppCompiler";
import HomePage from "./components/HomePage";
import ChatWithAI from "./components/ChatWithAI";
import CodeConverter from "./components/CodeConverted";
import Navbar from "./components/NavBar";
import AuthForm from "./components/AuthForm";

const App: React.FC = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/auth" element={<AuthForm/>} />
        <Route path="/html-compiler" element={<HtmlCompiler />} />
        <Route path="/compilers" element={<CppCompiler />} />
        <Route path="/chat-section" element={<ChatWithAI />} />
        <Route path="/code-converter" element={<CodeConverter />} />
      </Routes>
    </>
  );
};

export default App;
