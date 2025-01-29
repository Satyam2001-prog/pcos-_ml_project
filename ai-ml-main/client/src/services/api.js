// client/src/services/api.js

const API_URL = 'http://54.89.78.190:5000';  // Update with your EC2 IP

// Chat message handling
export const sendMessage = async (message) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Chat failed');
    }

    const data = await response.json();
    return data;
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(processedData)
    });

    const data = await response.json();
    console.log('Analysis response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Analysis failed');
    }

    return data;
  } catch (error) {
    console.error('Analysis API Error:', error);
    throw error;
  }
};

// Feedback submission
export const submitFeedback = async (chatId, feedback) => {
  try {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, feedback })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Feedback submission failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Feedback API Error:', error);
    throw error;
  }
};
