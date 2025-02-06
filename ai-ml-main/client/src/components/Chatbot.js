import React, { useState, useRef, useEffect } from "react";
import { Box, VStack, Input, Button, Text, useToast, Flex } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { sendMessage, analyzeSymptoms } from "./services/api"; // Import the updated API functions

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Send the user's message to Gemini via the updated `sendMessage` function
      const response = await sendMessage(input);

      // Update the chat history
      setMessages((prev) => [
        ...prev,
        { type: "user", content: input },
        { type: "bot", content: response },
      ]);

      setInput("");
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
    if (e.key === "Enter" && !e.shiftKey) {
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
              justify={msg.type === "user" ? "flex-end" : "flex-start"}
              mb={2}
            >
              <Box
                maxW="80%"
                bg={msg.type === "user" ? "blue.500" : "white"}
                color={msg.type === "user" ? "white" : "black"}
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
