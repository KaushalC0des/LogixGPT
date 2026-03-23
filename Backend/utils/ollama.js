// import "dotenv/config";

// const getOllamaResponse = async (message) => {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

//   try {
//     const finalPrompt = `Give a medium, clear answer.\n\n${message}`;

//     const response = await fetch("http://127.0.0.1:11434/api/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "phi3:latest", 
//         prompt: finalPrompt,
//         stream: false,
//         options: {
//           num_predict: 300, 
//         },
//       }),
//       signal: controller.signal, 
//     });

//     clearTimeout(timeout);

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error("Ollama HTTP error: " + response.status + " - " + text);
//     }

//     const data = await response.json();

//     if (!data.response) { 
//       throw new Error("No response received from Ollama model.");
//     }

//     return data.response;

//   } catch (err) {
//     clearTimeout(timeout); 

//     if (err.name === "AbortError") {
//       console.error("❌ Request timed out. Make sure Ollama is running and the model is loaded.");
//     } else {
//       console.error("❌ Error talking to Ollama:", err.message);
//     }

//     throw err;
//   }
// };

// export default getOllamaResponse;

import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.NVIDIA_API_KEY
});

const getOllamaResponse = async (message) => {
    try {
        const completion = await client.chat.completions.create({
            model: "meta/llama-3.3-70b-instruct",
            messages: [{ role: "user", content: message }],
            temperature: 0.7,
            max_tokens: 1024,
            stream: false  // keeping stream false to match your existing code
        });

        return completion.choices[0].message.content;

    } catch (err) {
        console.error("❌ NVIDIA error:", err.message);
        throw err;
    }
};

export default getOllamaResponse;