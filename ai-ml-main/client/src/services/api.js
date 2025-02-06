import { GoogleGenerativeAI } from '@google/generative-ai';  
  
const API_URL = 'http://54.89.78.190:5000';  
const API_KEY = "AIzaSyAeY8VVy8_rNI70lCpVnxqzBxkTc8XFUMQ";  
const genAI = new GoogleGenerativeAI(API_KEY);  
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });  
  
const PCOS_CONTEXT = `You are an expert PCOS healthcare assistant. Provide accurate, evidence-based information about:  
- PCOS symptoms, diagnosis, and treatment  
- Lifestyle modifications and diet recommendations  
- Exercise guidelines and stress management  
- Fertility considerations and management strategies  
Keep responses focused on PCOS topics, clear, and encouraging.`;  
  
// Helper function to get chat history from local storage  
const getChatHistory = () => {  
  const history = localStorage.getItem('chatHistory');  
  return history ? JSON.parse(history) : [{ role: "system", parts: PCOS_CONTEXT }];  
};  
  
// Helper function to save chat history to local storage  
const saveChatHistory = (history) => {  
  localStorage.setItem('chatHistory', JSON.stringify(history));  
};  
  
// Function to send a message and get a response from Gemini API  
export const sendMessage = async (message) => {  
  try {  
    const chatHistory = getChatHistory();  
    const chat = model.startChat({ history: chatHistory });  
  
    const userSymptoms = localStorage.getItem("User_Symptoms");  
    const mlResponse = localStorage.getItem("Ml_Model_Response");  
      
    let prompt = "talk in the context of PCOS hormonal disease and use your thought process and respond to the user's query";  
  
    if (userSymptoms && mlResponse) {  
      prompt = "talk in the context of what symptoms the user has and the ML model's response from the app and give your thought process regarding the user's query";  
    }  
  
    let chatContext = "";  
    if (userSymptoms) {  
      chatContext += `User_symptoms: ${userSymptoms}\n\n`;  
    }  
    if (mlResponse) {  
      chatContext += `ML_model_response: ${mlResponse}\n\n`;  
    }  
      
    chatContext += JSON.stringify(chatHistory);  
    message = `${chatContext}\nuser_query: ${message}`;  
  
    const result = await chat.sendMessage(message);  
    const response = await result.response.text();  
  
    // Update chat history  
    const updatedHistory = [  
      ...chatHistory,  
      { role: "user", parts: message },  
      { role: "model", parts: response }  
    ];  
    saveChatHistory(updatedHistory);  
  
    return response;  
  } catch (error) {  
    console.error('Chat API Error:', error);  
    throw error;  
  }  
};  
  
// PCOS Analysis  
export const analyzeSymptoms = async (formData) => {  
  try {  
    console.log('Sending analysis data:', formData);  
    const processedData = {  
      age: Number(formData.age),  
      weight: Number(formData.weight),  
      height: Number(formData.height),  
      cycle: Number(formData.cycle),  
      hairGrowth: Boolean(formData.hairGrowth),  
      skinDarkening: Boolean(formData.skinDarkening),  
      hairLoss: Boolean(formData.hairLoss),  
      pimples: Boolean(formData.pimples)  
    };  
    const response = await fetch(`${API_URL}/analyze`, {  
      method: 'POST',  
      headers: { 'Content-Type': 'application
