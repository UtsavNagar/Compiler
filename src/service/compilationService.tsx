const DOMAIN = "http://localhost:8080";
// const DOMAIN = "https://backendforcodecompiler.onrender.com";

/**
 * Helper function to get Firebase authentication token
 */
const getAuthToken = async (): Promise<string> => {
  const user = await import("firebase/auth").then(({ getAuth }) => getAuth().currentUser);
  if (!user) throw new Error("User is not authenticated");
  return await user.getIdToken();
};

/**
 * Helper function to handle API requests
 */
const apiRequest = async (endpoint: string, method: string, data?: any) => {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${DOMAIN}${endpoint}`, {
      method,
      credentials: "include", // Important for CORS with credentials
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send Firebase token in headers
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Create a new code file
 */
export const createFile = async (fileData: {
  fileName: string;
  extension: string;
  code: string;
  visibleToUsers?: string[];
}) => {
  return apiRequest("/api/files", "POST", fileData);
};

/**
 * Get all files visible to the authenticated user
 */
export const getVisibleFiles = async () => {
  return apiRequest("/api/files", "GET");
};

/**
 * Get a file by ID
 */
export const getFileById = async (fileId: string) => {
  return apiRequest(`/api/files/${fileId}`, "GET");
};

/**
 * Update an existing code file
 */
export const updateFile = async (
  fileId: string,
  fileData: { fileName?: string; extension?: string; code?: string }
) => {
  return apiRequest(`/api/files/${fileId}`, "PUT", fileData);
};

/**
 * Delete a file
 */
export const deleteFile = async (fileId: string) => {
  return apiRequest(`/api/files/${fileId}`, "DELETE");
};

/**
 * Add a user to the file's visible users list
 */
export const addUserAccess = async (fileId: string, userEmail: string) => {
  return apiRequest(`/api/files/${fileId}/access`, "POST", { userEmail });
};

/**
 * Remove a user from the file's visible users list
 */
export const removeUserAccess = async (fileId: string, userEmail: string) => {
  return apiRequest(`/api/files/${fileId}/access`, "DELETE", { userEmail });
};

/**
 * Compile code using the backend compiler API
 */
export const compileCode = async (data: { code: string; input: string; language: string }) => {
  try {
    let endpoint = `${DOMAIN}/api/compile/${data.language}`;
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: data.code, input: data.input }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Compilation Error:", error);
    return error instanceof Error ? "Error: " + error.message : "An unknown error occurred";
  }
};
