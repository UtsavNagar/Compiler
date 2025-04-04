import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import {
  compileCode,
  createFile,
  getVisibleFiles,
  getFileById,
  updateFile,
  deleteFile,
  addUserAccess,
  removeUserAccess
} from "../service/compilationService";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// icons
import { VscDebugStart, VscNewFile } from "react-icons/vsc";
import { IoIosSave, IoMdAddCircleOutline } from "react-icons/io";
import { FcCollaboration } from "react-icons/fc";
import { MdDelete, MdOutlineClose } from "react-icons/md";
import { FaHourglassStart } from "react-icons/fa6";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { SiCplusplus, SiJavascript, SiPython } from "react-icons/si";
import { VscFile } from "react-icons/vsc"; // fallback/default icon
import { FaJava } from "react-icons/fa";

// Type definitions
interface CodeFile {
  id: string;
  fileName: string;
  extension: string;
  code: string;
  ownerEmail: string;
  visibleToUsers: string[];
}

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

const extensionMap: { [key: string]: string } = {
  cpp: "cpp",
  java: "java",
  javascript: "js",
  python: "py",
};

const STORAGE_KEY = "codeCompilerState";

const CodeCompiler: React.FC = () => {
  const [language, setLanguage] = useState<string>("cpp");
  const [code, setCode] = useState<string>(defaultCodes[language]);
  const [output, setOutput] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [currentFile, setCurrentFile] = useState<CodeFile | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [originalCode, setOriginalCode] = useState<string>("");

  // For new file dialog
  const [showNewFileDialog, setShowNewFileDialog] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");

  // For access control dialog
  const [showAccessDialog, setShowAccessDialog] = useState<boolean>(false);
  const [newUserEmail, setNewUserEmail] = useState<string>("");

  // Load all files when component mounts
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      try {
        const userFiles = await getVisibleFiles();
        setFiles(userFiles);

        // If we have files, load the first one
        if (userFiles.length > 0) {
          await loadFileContent(userFiles[0].id);
        }
      } catch (error) {
        console.error("Error loading files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, []);

  // Load saved code from localStorage on component mount
  useEffect(() => {
    if (!currentFile) {
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
    }
  }, [currentFile]);

  // Save code to localStorage whenever language or code changes
  useEffect(() => {
    if (!currentFile) {
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
    } else {
      // Check for unsaved changes
      setHasUnsavedChanges(code !== originalCode);
    }
  }, [language, code, currentFile, originalCode]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;

    if (currentFile) {
      // Don't change the language of a saved file
      return;
    }

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

  const loadFileContent = async (fileId: string) => {
    setIsLoading(true);
    try {
      const file = await getFileById(fileId);
      setCurrentFile(file);
      setCode(file.code);
      setOriginalCode(file.code);
      setHasUnsavedChanges(false);

      // Set language based on file extension
      for (const [lang, ext] of Object.entries(extensionMap)) {
        if (ext === file.extension) {
          setLanguage(lang);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading file:", error);
      setOutput(`Error loading file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFile = async () => {
    setIsSaving(true);
    try {
      if (currentFile) {
        // Update existing file
        const updatedFile = await updateFile(currentFile.id, {
          code: code
        });

        // Update the files list
        setFiles(files.map(f => f.id === updatedFile.id ? updatedFile : f));
        setCurrentFile(updatedFile);
        setOriginalCode(code);
        setHasUnsavedChanges(false);
        setOutput("File saved successfully!");
      } else {
        // Show dialog to create new file
        setShowNewFileDialog(true);
      }
    } catch (error) {
      setOutput(`Error saving file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewFile = async () => {
    if (!newFileName.trim()) {
      setOutput("File name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const fileData = {
        fileName: newFileName,
        extension: extensionMap[language] || "txt",
        code: code,
        visibleToUsers: [] as string[]
      };

      const newFile = await createFile(fileData);

      // Add to files list and set as current
      setFiles([...files, newFile]);
      setCurrentFile(newFile);
      setOriginalCode(code);
      setHasUnsavedChanges(false);
      setOutput("New file created successfully!");
      setShowNewFileDialog(false);
      setNewFileName("");
    } catch (error) {
      setOutput(`Error creating file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!currentFile) return;

    if (!window.confirm(`Are you sure you want to delete ${currentFile.fileName}.${currentFile.extension}?`)) {
      return;
    }

    try {
      await deleteFile(currentFile.id);

      // Remove from files list
      setFiles(files.filter(f => f.id !== currentFile.id));

      // Clear current file
      setCurrentFile(null);
      setCode(defaultCodes[language]);
      setOutput("File deleted successfully!");
      setHasUnsavedChanges(false);
    } catch (error) {
      setOutput(`Error deleting file: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleAddUserAccess = async () => {
    if (!currentFile || !newUserEmail.trim()) return;

    try {
      const updatedFile = await addUserAccess(currentFile.id, newUserEmail);

      // Update files list and current file
      setFiles(files.map(f => f.id === updatedFile.id ? updatedFile : f));
      setCurrentFile(updatedFile);
      setNewUserEmail("");
      setOutput(`User ${newUserEmail} can now access this file`);
    } catch (error) {
      setOutput(`Error adding user: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleRemoveUserAccess = async (email: string) => {
    if (!currentFile) return;

    try {
      const updatedFile = await removeUserAccess(currentFile.id, email);

      // Update files list and current file
      setFiles(files.map(f => f.id === updatedFile.id ? updatedFile : f));
      setCurrentFile(updatedFile);
      setOutput(`User ${email} access revoked`);
    } catch (error) {
      setOutput(`Error removing user: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleNewFile = () => {
    // Clear current file
    setCurrentFile(null);

    // Reset to default code for selected language
    setCode(defaultCodes[language]);
    setOutput("");
    setHasUnsavedChanges(false);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (currentFile) {
      setHasUnsavedChanges(value !== originalCode);
    }
  };

  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "cpp":
        return <SiCplusplus className="text-blue-400 mr-2" />;
      case "js":
        return <SiJavascript className="text-yellow-400 mr-2" />;
      case "java":
        return <FaJava className="text-red-400 mr-2" />;
      case "py":
        return <SiPython className="text-blue-300 mr-2" />;
      default:
        return <VscFile className="text-gray-400 mr-2" />;
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-800 p-3 mb-2 rounded">
        <div className="flex items-center space-x-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            disabled={!!currentFile}
            className="p-2 bg-gray-700 text-white rounded"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <div className={`text-sm ${hasUnsavedChanges ? 'text-yellow-600 font-bold' : ''}`}>
            {currentFile ? `${currentFile.fileName}.${currentFile.extension}${hasUnsavedChanges ? ' (unsaved)' : ''}` : "Unsaved Code"}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            title="save"
            onClick={handleSaveFile}
            disabled={isSaving}
            className={`
              ${hasUnsavedChanges ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} 
              text-white px-3 py-2 rounded
              transition-all duration-300 ease-in-out
              ${isSaving ? 'opacity-75 animate-pulse' : 'opacity-100'}
              focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
            `}
          >
            {isSaving ? <FaHourglassStart /> : <IoIosSave />}
          </button>

          {currentFile && (
            <>
              <button
                title="add collaborator"
                onClick={() => setShowAccessDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded"
              >
                <FcCollaboration />
              </button>

              <button
                onClick={handleDeleteFile}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
              >
                <MdDelete />
              </button>
            </>
          )}

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
                <span className="inline-block animate-spin"><FaHourglassStart /></span>

              </>
            ) : (
              <VscDebugStart />
            )}
          </button>
        </div>
      </div>

      {/* Main Content with Editor, Output, and Sidebar */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Files Sidebar - Moved to the leftmost position */}
        <Panel defaultSize={15} className="overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-800 rounded-t flex justify-between items-center">
            <h2 className="text-lg font-bold">Files</h2>
            <button
              title="new file"
              onClick={handleNewFile}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
            >
              <VscNewFile />
            </button>
          </div>
          <div className="flex-1 border border-gray-700 bg-gray-800 rounded-b overflow-auto p-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin mr-2">⟳</div> Loading...
              </div>
            ) : files.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No files found</p>
            ) : (
              <ul className="space-y-1">
                {files.map((file) => (
                  <li
                    key={file.id}
                    onClick={() => loadFileContent(file.id)}
                    className={`
                      p-2 rounded cursor-pointer hover:bg-gray-700
                      ${currentFile?.id === file.id ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
                    `}
                  >
                    <div className="flex items-center">
                      <>
                        {getFileIcon(file.extension)}
                        <span className="flex-1 truncate">{file.fileName}.{file.extension}</span>
                      </>

                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        {/* Resizable Divider */}
        <PanelResizeHandle className="w-2 bg-gray-600 hover:bg-blue-500 cursor-ew-resize transition-colors duration-200" />

        {/* Code Editor Panel */}
        <Panel defaultSize={60} className="overflow-hidden flex flex-col">
          <div className="p-2 bg-gray-800 rounded-t">
            <h2 className="text-lg font-bold">{language.toUpperCase()} Code Editor</h2>
          </div>
          <div className="flex-1 overflow-hidden border border-gray-700 rounded-b relative">
            <div className="absolute inset-0 overflow-auto">
              <CodeMirror
                value={code}
                height="100%"
                extensions={[languageExtensions[language]]}
                onChange={handleCodeChange}
                theme="dark"
                className="h-full"
              />
            </div>
          </div>
        </Panel>

        {/* Resizable Divider */}
        <PanelResizeHandle className="w-2 bg-gray-600 hover:bg-blue-500 cursor-ew-resize transition-colors duration-200" />

        {/* Output Panel */}
        <Panel defaultSize={25} className="overflow-hidden flex flex-col">
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

      {/* New File Dialog with blurred background */}
      {showNewFileDialog && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New File</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">File Name</label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Enter file name"
              />
              <p className="text-sm text-gray-400 mt-1">
                Extension will be: .{extensionMap[language] || "txt"}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewFileDialog(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewFile}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Control Dialog with blurred background */}
      {showAccessDialog && currentFile && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Access Control: {currentFile.fileName}.{currentFile.extension}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Add User Access</label>
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Enter email address"
                />
                <button
                  onClick={handleAddUserAccess}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                  <IoMdAddCircleOutline />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Users with access:</h4>
              <ul className="max-h-60 overflow-y-auto bg-gray-700 rounded p-2">
                {currentFile.visibleToUsers.map((email) => (
                  <li key={email} className="flex justify-between items-center p-2 hover:bg-gray-600 rounded">
                    <span>{email}</span>
                    {email !== currentFile.ownerEmail && (
                      <button
                        onClick={() => handleRemoveUserAccess(email)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <IoPersonRemoveOutline />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAccessDialog(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                <MdOutlineClose />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeCompiler;