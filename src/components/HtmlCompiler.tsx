import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

interface File {
  id: string;
  name: string;
  content: string;
}

const HtmlCompiler: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState(() => localStorage.getItem("currentHtmlCode") || "<h1>Hello, TypeScript!</h1>");
  const [files, setFiles] = useState<File[]>(() => JSON.parse(localStorage.getItem("htmlFiles") || "[]"));
  const [currentFileName, setCurrentFileName] = useState("Untitled");
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [splitPosition, setSplitPosition] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlOutput, setHtmlOutput] = useState(""); // Add this state

  const sidebarRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const isDraggingSidebar = useRef(false);
  const isDraggingSplit = useRef(false);

  useEffect(() => {
    localStorage.setItem("currentHtmlCode", htmlCode);
    localStorage.setItem("htmlFiles", JSON.stringify(files));
  }, [htmlCode, files]);

  // Fix: Start dragging sidebar immediately
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    isDraggingSidebar.current = true;
    document.addEventListener("mousemove", handleSidebarMouseMove);
    document.addEventListener("mouseup", handleSidebarMouseUp);
  };

  const handleSidebarMouseMove = (e: MouseEvent) => {
    if (isDraggingSidebar.current) {
      setSidebarWidth(Math.min(Math.max(e.clientX, 100), 300));
    }
  };

  const handleSidebarMouseUp = () => {
    isDraggingSidebar.current = false;
    document.removeEventListener("mousemove", handleSidebarMouseMove);
    document.removeEventListener("mouseup", handleSidebarMouseUp);
  };

  // Fix: Start dragging split immediately
  const handleSplitMouseDown = (e: React.MouseEvent) => {
    isDraggingSplit.current = true;
    document.addEventListener("mousemove", handleSplitMouseMove);
    document.addEventListener("mouseup", handleSplitMouseUp);
  };

  const handleSplitMouseMove = (e: MouseEvent) => {
    if (isDraggingSplit.current) {
      const container = splitRef.current?.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        setSplitPosition(Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 20), 80));
      }
    }
  };

  const handleSplitMouseUp = () => {
    isDraggingSplit.current = false;
    document.removeEventListener("mousemove", handleSplitMouseMove);
    document.removeEventListener("mouseup", handleSplitMouseUp);
  };

  const [cssCode, setCssCode] = useState(""); // Store extracted styles
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframeDocument = iframeRef.current.contentDocument;
    if (!iframeDocument) return;

    // Extract styles from <style> tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlCode; // Do not sanitize yet

    const styleTags = tempDiv.querySelectorAll("style");
    let extractedCss = "";

    styleTags.forEach((styleTag) => {
      extractedCss += styleTag.innerHTML; // Extract CSS
      styleTag.remove(); // Remove <style> from HTML
    });

    setCssCode(extractedCss); // Save extracted CSS for later use

    // Sanitize remaining HTML (without styles)
    const sanitizedHtml = DOMPurify.sanitize(tempDiv.innerHTML);

    // Inject styles and content into the iframe
    iframeDocument.open();
    iframeDocument.write(`
    <html>
      <head>
        <style>${extractedCss}</style>
      </head>
      <body>${sanitizedHtml}</body>
    </html>
  `);
    iframeDocument.close();
  }, [htmlCode]);


  return (
    <div className="flex bg-gray-900 text-white"> {/* Added h-screen */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-bold">{currentFileName}</h1>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          </button>
        </div>

        {/* Fullscreen Mode Fix */}
        {isFullscreen ? (
          <div className="flex-1 bg-white text-black p-6 overflow-auto">
            <style>{cssCode}</style> {/* Inject CSS manually */}
            <div className="text-black p-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlCode) }} />
          </div>
        ) : (
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div style={{ width: `${splitPosition}%` }} className="flex flex-col h-1/4">
              <div className="bg-gray-800 p-2 border-b border-gray-700">Code Editor</div>
              <div className="flex-1 overflow-auto h-9/10">
                <CodeMirror value={htmlCode} height="100%" extensions={[html()]} onChange={setHtmlCode} theme="dark" />
              </div>
            </div>

            <div ref={splitRef} className="w-1 bg-gray-600 cursor-col-resize hover:bg-blue-500 shrink-0" onMouseDown={handleSplitMouseDown}></div>

            {/* Output Section */}
            <div style={{ width: `${100 - splitPosition}%` }} className="flex flex-col overflow-auto h-1/4">
              <div className="bg-gray-800 p-2 border-b border-gray-700">Output</div>
              <div className="flex-1 bg-white text-black overflow-auto p-4 h-9/10">
                <iframe ref={iframeRef} className="w-full h-full border-none"></iframe>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HtmlCompiler;
