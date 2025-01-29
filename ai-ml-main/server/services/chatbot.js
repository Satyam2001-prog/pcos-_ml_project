// services/chatbot.js
const natural = require('natural');
const Chat = require('../models/Chat');
const fs = require('fs').promises;
const path = require('path');

class Chatbot {
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.intents = null;
    this.initializeClassifier();
  }

  async initializeClassifier() {
    try {
      const intentsFile = await fs.readFile(
        path.join(__dirname, '../data/intents.json'),
        'utf8'
      );
      this.intents = JSON.parse(intentsFile);
      
      this.intents.intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
          this.classifier.addDocument(pattern, intent.tag);
        });
      });
      
      this.classifier.train();
    } catch (error) {
      console.error('Error initializing classifier:', error);
      throw error;
    }
  }

  async processMessage(userId, message) {
    try {
      const intent = this.classifier.classify(message);
      const response = this.getResponse(intent);
      
      // Save chat interaction
      await Chat.create({
        userId,
        message,
        response,
        intent
      });

      return {
        message: response,
        intent
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  getResponse(intent) {
    const intentData = this.intents.intents.find(i => i.tag === intent);
    if (!intentData) {
      return "I'm not sure about that. Would you like to know about PCOS symptoms or general information?";
    }
    
    return intentData.responses[
      Math.floor(Math.random() * intentData.responses.length)
    ];
  }

  async updateFromFeedback(chatId, feedback) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      chat.feedback = feedback;
      await chat.save();

      // Use feedback to improve responses
      if (feedback === 'positive') {
        this.classifier.addDocument(chat.message, chat.intent);
        this.classifier.train();
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  }
}

module.exports = new Chatbot();
