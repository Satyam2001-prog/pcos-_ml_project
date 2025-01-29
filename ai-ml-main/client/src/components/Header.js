import React from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="blue.500" color="white" py={4} shadow="base">
      <Container maxW="container.xl">
        <Heading size="lg">PCOS Assistant</Heading>
        <Text mt={1}>Your AI-powered guide to understanding PCOS</Text>
      </Container>
    </Box>
  );
};

export default Header;
