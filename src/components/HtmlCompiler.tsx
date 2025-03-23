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
  const [currentFileName, setCurrentFileName] = useState("HTML");
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [splitPosition, setSplitPosition] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cssCode, setCssCode] = useState("");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isDraggingSidebar = useRef(false);
  const isDraggingSplit = useRef(false);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);

  useEffect(() => {
    localStorage.setItem("currentHtmlCode", htmlCode);
    localStorage.setItem("htmlFiles", JSON.stringify(files));
  }, [htmlCode, files]);

  // Process HTML and update iframe whenever htmlCode changes
  useEffect(() => {
    updateIframeContent();
  }, [htmlCode]);

  const updateIframeContent = () => {
    if (!iframeRef.current) return;

    const iframeDocument = iframeRef.current.contentDocument;
    if (!iframeDocument) return;

    // Extract styles from <style> tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlCode; 

    const styleTags = tempDiv.querySelectorAll("style");
    let extractedCss = "";

    styleTags.forEach((styleTag) => {
      extractedCss += styleTag.innerHTML; 
      styleTag.remove(); 
    });

    setCssCode(extractedCss);

    // Sanitize remaining HTML (without styles)
    const sanitizedHtml = DOMPurify.sanitize(tempDiv.innerHTML);

    // Inject styles and content into the iframe
    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${extractedCss}</style>
        </head>
        <body>${sanitizedHtml}</body>
      </html>
    `);
    iframeDocument.close();
  };

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

  // Fixed split dragging functionality with TypeScript compatibility
  const handleSplitMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection when dragging
    isDraggingSplit.current = true;
    startXRef.current = e.clientX;
    startPositionRef.current = splitPosition;
    
    // Disable text selection during resize (TypeScript compatible)
    document.body.style.userSelect = 'none';
    // For older browsers, use this approach
    const bodyStyle = document.body.style as any;
    if (bodyStyle.webkitUserSelect !== undefined) {
      bodyStyle.webkitUserSelect = 'none';
    }
    
    document.addEventListener("mousemove", handleSplitMouseMove);
    document.addEventListener("mouseup", handleSplitMouseUp);
  };

  const handleSplitMouseMove = (e: MouseEvent) => {
    if (!isDraggingSplit.current) return;
    
    const container = splitRef.current?.parentElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const deltaX = e.clientX - startXRef.current;
    const deltaPercent = (deltaX / rect.width) * 100;
    const newPosition = startPositionRef.current + deltaPercent;
    
    // Constrain the new position between 20% and 80%
    setSplitPosition(Math.min(Math.max(newPosition, 20), 80));
  };

  const handleSplitMouseUp = () => {
    isDraggingSplit.current = false;
    
    // Re-enable text selection (TypeScript compatible)
    document.body.style.userSelect = '';
    // For older browsers, use this approach
    const bodyStyle = document.body.style as any;
    if (bodyStyle.webkitUserSelect !== undefined) {
      bodyStyle.webkitUserSelect = '';
    }
    
    document.removeEventListener("mousemove", handleSplitMouseMove);
    document.removeEventListener("mouseup", handleSplitMouseUp);
  };

  return (
    <div className="flex bg-gray-900 text-white h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-bold">{currentFileName}</h1>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          </button>
        </div>

        {/* Fullscreen Mode */}
        {isFullscreen ? (
          <div className="flex-1 bg-white text-black p-6 overflow-auto">
            <iframe 
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${cssCode}</style>
                  </head>
                  <body>${DOMPurify.sanitize(htmlCode)}</body>
                </html>
              `}
              className="w-full h-full border-none"
              title="HTML Preview"
            ></iframe>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Code Editor */}
            <div 
              style={{ width: `${splitPosition}%` }} 
              className="flex flex-col h-full overflow-hidden"
            >
              <div className="bg-gray-800 p-2 border-b border-gray-700">Code Editor</div>
              <div className="overflow-auto flex-1">
                <CodeMirror 
                  value={htmlCode} 
                  height="100%" 
                  extensions={[html()]} 
                  onChange={setHtmlCode} 
                  theme="dark" 
                />
              </div>
            </div>

            {/* Split handle with improved styling and behavior */}
            <div 
              ref={splitRef} 
              className="w-2 bg-gray-600 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 shrink-0 z-10" 
              onMouseDown={handleSplitMouseDown}
            ></div>

            {/* Output Section */}
            <div 
              style={{ width: `${100 - splitPosition}%` }} 
              className="flex flex-col h-full overflow-hidden"
            >
              <div className="bg-gray-800 p-2 border-b border-gray-700">Output</div>
              <div className="flex-1 bg-white text-black overflow-auto">
                <iframe 
                  ref={iframeRef} 
                  className="w-full h-full border-none"
                  title="HTML Output"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HtmlCompiler;