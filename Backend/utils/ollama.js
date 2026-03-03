import "dotenv/config";

const getOllamaResponse = async (message) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const finalPrompt = `Give a medium, clear answer.\n\n${message}`;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3:latest", // ✅ make sure this matches `ollama list`
        prompt: finalPrompt,
        stream: false,
        options: {
          num_predict: 300, // ✅ increased from 150 to avoid cut-off responses
        },
      }),
      signal: controller.signal, // ✅ abort if it hangs too long
    });

    clearTimeout(timeout); // ✅ clear timeout if response comes in time

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Ollama HTTP error: " + response.status + " - " + text);
    }

    const data = await response.json();

    if (!data.response) { // ✅ guard against empty response
      throw new Error("No response received from Ollama model.");
    }

    return data.response;

  } catch (err) {
    clearTimeout(timeout); // ✅ also clear timeout on error

    if (err.name === "AbortError") { // ✅ handle timeout specifically
      console.error("❌ Request timed out. Make sure Ollama is running and the model is loaded.");
    } else {
      console.error("❌ Error talking to Ollama:", err.message);
    }

    throw err;
  }
};

export default getOllamaResponse;
