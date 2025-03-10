import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { compileCppCode } from "../service/compilationService";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const CppCompiler: React.FC = () => {
  const [code, setCode] = useState<string>(
    `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`
  );
  const [output, setOutput] = useState<string>("");

  const handleCompile = async () => {
    setOutput("Compiling...");
    
    const requestData = {
      code: code, 
      input: "hello", // Provide sample input
    };
  
    const result = await compileCppCode(requestData);
    setOutput(result);
  };
  

  return (
    <div className="h-screen bg-gray-900 text-white p-4">
      <PanelGroup direction="horizontal">
        {/* Left Section: Code Editor */}
        <Panel className="p-4 flex flex-col overflow-auto">
          <h2 className="text-lg font-bold mb-2">C++ Code Editor</h2>
          <div className="flex-grow border rounded">
            <CodeMirror
              value={code}
              height="100%"
              extensions={[cpp()]}
              onChange={(value) => setCode(value)}
              theme="dark"
            />
          </div>
          <button
            onClick={handleCompile}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Compile & Run
          </button>
        </Panel>

        {/* Resizable Middle Line */}
        <PanelResizeHandle className="w-1 bg-gray-600 hover:bg-gray-400 cursor-ew-resize" />

        {/* Right Section: Output */}
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

export default CppCompiler;
