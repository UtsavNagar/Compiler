const DOMAIN = "http://localhost:9090/api/compile";
// const DOMAIN = "backendforcodecompiler-production.up.railway.app";

export const compileCode = async (data: { code: string; input: string; language: string }) => {
  try {
    let endpoint = `${DOMAIN}/${data.language}`; // Dynamically choose the right API endpoint

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
