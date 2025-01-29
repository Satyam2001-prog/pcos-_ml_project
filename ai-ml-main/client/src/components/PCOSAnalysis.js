// client/src/components/PCOSAnalysis.js
import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  Heading,
  SimpleGrid,
  Checkbox,
  Progress,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Center,
  Stack,
  InputGroup,
  InputRightAddon
} from '@chakra-ui/react';
import { analyzeSymptoms } from '../services/api';

const PCOSAnalysis = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    cycle: '',
    hairGrowth: false,
    skinDarkening: false,
    hairLoss: false,
    pimples: false
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();

  const validateForm = () => {
    if (!formData.age || !formData.weight || !formData.height || !formData.cycle) {
      throw new Error('Please fill in all required fields');
    }
    if (formData.age < 0 || formData.age > 120) {
      throw new Error('Please enter a valid age');
    }
    if (formData.weight < 20 || formData.weight > 300) {
      throw new Error('Please enter a valid weight');
    }
    if (formData.height < 100 || formData.height > 250) {
      throw new Error('Please enter a valid height');
    }
    if (formData.cycle < 0 || formData.cycle > 100) {
      throw new Error('Please enter a valid cycle length');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      validateForm();
      console.log('Submitting data:', formData);
      
      const data = await analyzeSymptoms(formData);
      console.log('Received response:', data);
      
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Risk Level: ${data.risk}%`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.message);
      toast({
        title: "Analysis Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="lg" borderRadius="lg">
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Center>
            <Stack spacing={2} textAlign="center" mb={4}>
              <Heading size="lg" color="purple.600">PCOS Risk Assessment</Heading>
              <Text color="gray.600">Fill in your details for a personalized PCOS risk analysis</Text>
            </Stack>
          </Center>

          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Enter your age"
                  />
                  <InputRightAddon children="years" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Weight</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="Enter weight"
                  />
                  <InputRightAddon children="kg" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Height</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    placeholder="Enter height"
                  />
                  <InputRightAddon children="cm" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Menstrual Cycle Length</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    value={formData.cycle}
                    onChange={(e) => setFormData({...formData, cycle: e.target.value})}
                    placeholder="Average cycle length"
                  />
                  <InputRightAddon children="days" />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Box mt={8} bg="gray.50" p={4} borderRadius="md">
              <Text fontWeight="bold" mb={4}>Common PCOS Symptoms:</Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Checkbox
                  colorScheme="purple"
                  isChecked={formData.hairGrowth}
                  onChange={(e) => setFormData({...formData, hairGrowth: e.target.checked})}
                >
                  Excess Hair Growth
                </Checkbox>
                <Checkbox
                  colorScheme="purple"
                  isChecked={formData.skinDarkening}
                  onChange={(e) => setFormData({...formData, skinDarkening: e.target.checked})}
                >
                  Skin Darkening
                </Checkbox>
                <Checkbox
                  colorScheme="purple"
                  isChecked={formData.hairLoss}
                  onChange={(e) => setFormData({...formData, hairLoss: e.target.checked})}
                >
                  Hair Loss
                </Checkbox>
                <Checkbox
                  colorScheme="purple"
                  isChecked={formData.pimples}
                  onChange={(e) => setFormData({...formData, pimples: e.target.checked})}
                >
                  Acne/Pimples
                </Checkbox>
              </SimpleGrid>
            </Box>

            <Center mt={8}>
              <Button
                colorScheme="purple"
                size="lg"
                type="submit"
                isLoading={loading}
                loadingText="Analyzing..."
                width={{ base: "full", md: "auto" }}
                minW="200px"
                height="50px"
                boxShadow="md"
              >
                Analyze Risk
              </Button>
            </Center>
          </form>

          {result && (
            <Box mt={8}>
              <Alert
                status={result.risk > 70 ? "warning" : result.risk > 40 ? "info" : "success"}
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                borderRadius="lg"
                p={6}
              >
                <AlertIcon boxSize="40px" mr={0} />
                <Text mt={4} mb={2} fontSize="xl" fontWeight="bold">
                  Risk Level: {result.risk}%
                </Text>
                <Box w="full" maxW="400px" mt={2}>
                  <Progress
                    value={result.risk}
                    colorScheme={result.risk > 70 ? "red" : result.risk > 40 ? "yellow" : "green"}
                    height="20px"
                    borderRadius="full"
                  />
                </Box>
                {result.bmi && (
                  <Text mt={4} fontSize="lg">
                    BMI: {result.bmi}
                  </Text>
                )}
                <Text mt={4} color="gray.600">
                  {result.recommendations?.message}
                </Text>
                {result.recommendations?.steps && (
                  <Box mt={4} textAlign="left">
                    <Text fontWeight="bold" mb={2}>Recommended Steps:</Text>
                    <VStack align="start" spacing={2}>
                      {result.recommendations.steps.map((step, index) => (
                        <Text key={index}>• {step}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Alert>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default PCOSAnalysis;
