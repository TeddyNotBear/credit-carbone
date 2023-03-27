import { ChakraProvider, theme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Web3Provider } from './contexts/Web3AuthProvider';
import routes from './router';

const App = () => {
  const elements = useRoutes(routes);
  const queryClient = new QueryClient();

  return (
    <ChakraProvider theme={theme}>
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <Suspense>{elements}</Suspense>
        </QueryClientProvider>
      </Web3Provider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ChakraProvider>
  );
};

export default App;