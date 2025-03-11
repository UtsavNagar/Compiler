import axios from "axios";
import API from "./api";

const DOMAIN = "http://localhost:9090";

export const compileCppCode = async (data: { code: string; input: string }) => {
  try {
    const response = await fetch(DOMAIN+API.cppCompilationApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.text();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return "Error: " + error.message;
    }
    return "An unknown error occurred";
  }
};


