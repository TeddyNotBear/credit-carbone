import { Box, Flex, useColorModeValue, Image, Grid, Spacer, Text, Heading } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import TopBar from '../navbar/TopBar';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = () => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <TopBar />
      <Box ml={{ base: 0 }} p="4">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;