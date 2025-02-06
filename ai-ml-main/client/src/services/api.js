// client/src/services/api.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const API_KEY = "AIzaSyAeY8VVy8_rNI70lCpVnxqzBxkTc8XFUMQ"; // Replace with your Gemini API key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// PCOS-specific context
const PCOS_CONTEXT = `You are an expert PCOS healthcare assistant. Provide accurate, evidence-based information about:
- PCOS symptoms, diagnosis, and treatment
- Lifestyle modifications and diet recommendations
- Exercise guidelines and stress management
- Fertility considerations and management strategies
Keep responses focused on PCOS topics, clear, and encouraging.`;

// Chat message handling
export const sendMessage = async (message) => {
  try {
    // Start a chat with the PCOS context
    const chat = model.startChat({
      history: [{ role: "user", parts: PCOS_CONTEXT }],
    });

    // Send the user's message to Gemini
    const result = await chat.sendMessage(message);
    const response = await result.response.text();

    // Store the chat response in sessionStorage
    sessionStorage.setItem("chatResponse", JSON.stringify(response));

    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// PCOS Analysis
export const analyzeSymptoms = async (formData) => {
  try {
    console.log("Sending analysis data:", formData);

    // Process form data
    const processedData = {
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      cycle: Number(formData.cycle),
      hairGrowth: Boolean(formData.hairGrowth),
      skinDarkening: Boolean(formData.skinDarkening),
      hairLoss: Boolean(formData.hairLoss),
      pimples: Boolean(formData.pimples),
    };

    // Create a prompt for Gemini based on the form data
    const prompt = `Analyze the following PCOS symptoms and provide recommendations:
    - Age: ${processedData.age}
    - Weight: ${processedData.weight}
    - Height: ${processedData.height}
    - Cycle: ${processedData.cycle}
    - Hair Growth: ${processedData.hairGrowth}
    - Skin Darkening: ${processedData.skinDarkening}
    - Hair Loss: ${processedData.hairLoss}
    - Pimples: ${processedData.pimples}`;

    // Send the prompt to Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Store the analysis response in sessionStorage
    sessionStorage.setItem("analysisResponse", JSON.stringify(response));

    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Feedback submission (optional, if you still want to use it)
export const submitFeedback = async (chatId, feedback) => {
  try {
    // You can still send feedback to your server if needed
    const response = await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, feedback }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Feedback submission failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Feedback API Error:", error);
    throw error;
  }
};
