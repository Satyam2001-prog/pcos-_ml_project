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
  
    let chatContext = prompt;  
    if (userSymptoms) {  
      chatContext += `\n\nUser_symptoms: ${userSymptoms}`;  
    }  
    if (mlResponse) {  
      chatContext += `\n\nML_model_response: ${mlResponse}`;  
    }  
      
    message = `${chatContext}\n\nuser_query: ${message}`;  
  
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
