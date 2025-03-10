import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

const HtmlCompiler: React.FC = () => {
  // Load stored HTML code from localStorage or set default
  const [htmlCode, setHtmlCode] = useState<string>(() => {
    return localStorage.getItem("htmlCode") || "<h2>Hello, TypeScript!</h2>";
  });

  // Save HTML code to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("htmlCode", htmlCode);
  }, [htmlCode]);

  return (
    <div className="flex h-screen">
      {/* Left Side: Code Editor */}
      <div className="w-2/5 h-full border-r p-4 bg-gray-900 text-white">
        <h2 className="text-xl font-bold mb-2">Code Editor</h2>
        <CodeMirror
          value={htmlCode}
          height="100%"
          extensions={[html()]}
          className="border rounded"
          onChange={(value) => setHtmlCode(value)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
          }}
          theme="dark"
        />
      </div>

      {/* Right Side: Output */}
      <div className="w-2/5 h-full p-4 overflow-auto bg-gray-100">
        <h2 className="text-xl font-bold mb-2">Output</h2>
        <div
          className="border p-4 bg-white rounded shadow-md"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlCode) }}
        />
      </div>
    </div>
  );
};

export default HtmlCompiler;

