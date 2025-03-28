import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { User } from 'firebase/auth';
import { checkUserLogin } from './firebase/firebase';
import HtmlCompiler from "./components/HtmlCompiler";
import CppCompiler from "./components/CppCompiler";
import HomePage from "./components/HomePage";
import ChatWithAI from "./components/ChatWithAI";
import CodeConverter from "./components/CodeConverted";
import Navbar from "./components/NavBar";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = checkUserLogin((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // If no user is logged in, redirect to home page
      if (!currentUser) {
        navigate('/');
      }
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  }, [navigate]);

  // Show loading or protection mechanism
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, return null (will trigger redirect)
  return user ? <>{children}</> : null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = checkUserLogin((currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/html-compiler" 
          element={
            <ProtectedRoute>
              <HtmlCompiler />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/compilers" 
          element={
            <ProtectedRoute>
              <CppCompiler />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat-section" 
          element={
            <ProtectedRoute>
              <ChatWithAI />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/code-converter" 
          element={
            <ProtectedRoute>
              <CodeConverter />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
};

export default App;