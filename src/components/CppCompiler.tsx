import React, { useState } from "react";
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

const CodeCompiler: React.FC = () => {
  const [language, setLanguage] = useState<string>("cpp");
  const [code, setCode] = useState<string>(defaultCodes[language]);
  const [output, setOutput] = useState<string>("");

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    setCode(defaultCodes[newLang]); // Reset to default code for selected language
  };

  const handleCompile = async () => {
    setOutput("Compiling...");
    
    const requestData = {
      code: code,
      input: "", // Modify if input handling is needed
      language: language, // Send language to backend
    };

    const result = await compileCode(requestData);
    setOutput(result);
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Compile & Run
        </button>
      </div>

      {/* Code Editor & Output Panel */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Code Editor Panel */}
        <Panel className="p-4 flex flex-col overflow-auto">
          <h2 className="text-lg font-bold mb-2">{language.toUpperCase()} Code Editor</h2>
          <div className="flex-grow border rounded">
            <CodeMirror
              value={code}
              height="100%"
              extensions={[languageExtensions[language]]}
              onChange={(value) => setCode(value)}
              theme="dark"
            />
          </div>
        </Panel>

        {/* Resizable Divider */}
        <PanelResizeHandle className="w-1 bg-gray-600 hover:bg-gray-400 cursor-ew-resize" />

        {/* Output Panel */}
        <Panel className="p-4 bg-gray-800 overflow-auto">
          <h2 className="text-lg font-bold mb-2">Output / Errors</h2>
          <pre className="border p-4 bg-black text-green-400 rounded h-full overflow-auto">
            {output}
          </pre>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeCompiler;
