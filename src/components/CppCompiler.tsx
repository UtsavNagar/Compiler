import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { compileCode } from "../service/compilationService";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const languageExtensions: { [key: string]: any } = {
  cpp: cpp(),
  java: java(),
  javascript: javascript(),
  python: python(),
};

const defaultCodes: { [key: string]: string } = {
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`,
  javascript: `console.log("Hello, JavaScript!");`,
  python: `print("Hello, Python!")`,
};

const STORAGE_KEY = "codeCompilerState";

const CodeCompiler: React.FC = () => {
  const [language, setLanguage] = useState<string>("cpp");
  const [code, setCode] = useState<string>(defaultCodes[language]);
  const [output, setOutput] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  
  // Load saved code from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const { savedLanguage, savedCodes } = JSON.parse(savedState);
        setLanguage(savedLanguage);
        
        // If we have saved code for the current language, use it
        if (savedCodes[savedLanguage]) {
          setCode(savedCodes[savedLanguage]);
        } else {
          setCode(defaultCodes[savedLanguage]);
        }
      } catch (error) {
        console.error("Error loading saved code:", error);
      }
    }
  }, []);

  // Save code to localStorage whenever language or code changes
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    let savedCodes = { ...defaultCodes };
    
    if (savedState) {
      try {
        const { savedCodes: existingSavedCodes } = JSON.parse(savedState);
        savedCodes = { ...savedCodes, ...existingSavedCodes };
      } catch (error) {
        console.error("Error parsing saved code:", error);
      }
    }
    
    // Update the code for the current language
    savedCodes[language] = code;
    
    // Save the updated state
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        savedLanguage: language,
        savedCodes,
      })
    );
  }, [language, code]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    
    // Get saved code for the new language
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const { savedCodes } = JSON.parse(savedState);
        if (savedCodes[newLang]) {
          setCode(savedCodes[newLang]);
          setLanguage(newLang);
          return;
        }
      } catch (error) {
        console.error("Error loading saved code:", error);
      }
    }
    
    // Fall back to default code if no saved code exists
    setLanguage(newLang);
    setCode(defaultCodes[newLang]);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setOutput("Compiling...");
    
    try {
      const requestData = {
        code: code,
        input: "", // Modify if input handling is needed
        language: language,
      };

      const result = await compileCode(requestData);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-800 p-3 mb-2 rounded">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 bg-gray-700 text-white rounded"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <button
          onClick={handleCompile}
          disabled={isCompiling}
          className={`
            bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded
            transition-all duration-300 ease-in-out transform
            ${isCompiling ? 'scale-95 opacity-75 animate-pulse' : 'scale-100 opacity-100'}
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
          `}
        >
          {isCompiling ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>
              Compiling...
            </>
          ) : (
            "Compile & Run"
          )}
        </button>
      </div>

      {/* Code Editor & Output Panel */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Code Editor Panel */}
        <Panel className="overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-800 rounded-t">
            <h2 className="text-lg font-bold">{language.toUpperCase()} Code Editor</h2>
          </div>
          <div className="flex-1 overflow-hidden border border-gray-700 rounded-b relative">
            <div className="absolute inset-0 overflow-auto">
              <CodeMirror
                value={code}
                height="100%"
                extensions={[languageExtensions[language]]}
                onChange={(value) => setCode(value)}
                theme="dark"
                className="h-full"
              />
            </div>
          </div>
        </Panel>

        {/* Resizable Divider */}
        <PanelResizeHandle className="w-2 bg-gray-600 hover:bg-blue-500 cursor-ew-resize transition-colors duration-200" />

        {/* Output Panel */}
        <Panel className="overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-800 rounded-t">
            <h2 className="text-lg font-bold">Output / Errors</h2>
          </div>
          <div className="flex-1 border border-gray-700 bg-black rounded-b relative">
            <div className="absolute inset-0 overflow-auto p-4">
              <pre className="text-green-400 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeCompiler;