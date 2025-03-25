// const DOMAIN = "http://localhost:8080/api/compile";
const DOMAIN = "https://backendforcodecompiler.onrender.com";

export const compileCode = async (data: { code: string; input: string; language: string }) => {
  try {
    let endpoint = `${DOMAIN}/${data.language}`; // Dynamically choose the right API endpoint

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({ code: data.code, input: data.input }), // Send only required data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error) {
      return "Error: " + error.message;
    }
    return "An unknown error occurred";
  }
};
