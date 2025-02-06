import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, Input, Button, Text, useToast, Flex } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import { GoogleGenerativeAI } from '@google/generative-ai';
 
// ✅ Directly assign API key here
const API_KEY = "AIzaSyAeY8VVy8_rNI70lCpVnxqzBxkTc8XFUMQ";
 
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
// PCOS-specific context
const PCOS_CONTEXT = `You are an expert PCOS healthcare assistant. Provide accurate, evidence-based information about:
- PCOS symptoms, diagnosis, and treatment
- Lifestyle modifications and diet recommendations
- Exercise guidelines and stress management
- Fertility considerations and management strategies
Keep responses focused on PCOS topics, clear, and encouraging.`;
 
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const chatHistory = useRef([{ role: "system", parts: PCOS_CONTEXT }]);
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
 
  useEffect(scrollToBottom, [messages]);
 
  const handleSendMessage = async () => {
    if (!input.trim()) return;
 
    setLoading(true);
    try {
      // Create chat with context
      const chat = model.startChat({
        history: chatHistory.current
      });
 
      // Generate response
      const result = await chat.sendMessage(input);
      const response = await result.response.text();  // ✅ Correctly extracting response text
 
      // Update chat history
      chatHistory.current.push(
        { role: "user", parts: input },
        { role: "model", parts: response }
      );
 
      setMessages(prev => [...prev,
        { type: 'user', content: input },
        { type: 'bot', content: response }
      ]);
      setInput('');
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Unable to process your message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Gemini API Error:", error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
 
  return (
<Box bg="white" p={6} rounded="lg" shadow="base">
<Text fontSize="2xl" mb={4} color="blue.600" fontWeight="bold">
        PCOS Assistant
</Text>
<VStack spacing={4}>
<Box
          w="full"
          h="400px"
          overflowY="auto"
          p={4}
          borderWidth={1}
          borderRadius="md"
          bg="gray.50"
>
          {messages.map((msg, idx) => (
<Flex
              key={idx}
              justify={msg.type === 'user' ? 'flex-end' : 'flex-start'}
              mb={2}
>
<Box
                maxW="80%"
                bg={msg.type === 'user' ? 'blue.500' : 'white'}
                color={msg.type === 'user' ? 'white' : 'black'}
                p={3}
                rounded="lg"
                shadow="md"
>
                {msg.content}
</Box>
</Flex>
          ))}
<div ref={messagesEndRef} />
</Box>
<Flex w="full">
<Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about PCOS..."
            mr={2}
            bg="white"
            borderColor="blue.200"
            _hover={{ borderColor: "blue.300" }}
            _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
          />
<Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleSendMessage}
            leftIcon={<FiSend />}
            _hover={{ bg: "blue.600" }}
>
            Send
</Button>
</Flex>
</VStack>
</Box>
  );
};
 
export default Chatbot;
