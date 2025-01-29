import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f7fafc',
      500: '#718096',
      900: '#171923',
    },
  },
  fonts: {
    heading: 'Roboto, system-ui, sans-serif',
    body: 'Roboto, system-ui, sans-serif',
  },
});

export { theme };
