import React from 'react';
import { ChakraProvider, Box, Container } from '@chakra-ui/react';
import { theme } from './theme';
import PCOSAnalysis from './components/PCOSAnalysis';
import Chatbot from './components/Chatbot';
import Header from './components/Header';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        <Header />
        <Container maxW="container.xl" py={8}>
          <PCOSAnalysis />
          <Chatbot />
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
