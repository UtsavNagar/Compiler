const DOMAIN = "http://localhost:8080/api/compile";
// const DOMAIN = "https://backendforcodecompiler.onrender.com";

export const compileCode = async (data: { code: string; input: string; language: string }) => {
  try {
    let endpoint = `${DOMAIN}/${data.language}`; // Dynamically choose the right API endpoint

    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include', // Important for CORS with credentials
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: data.code, input: data.input }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Compilation Error:', error);
    if (error instanceof Error) {
      return "Error: " + error.message;
    }
    return "An unknown error occurred";
  }
};