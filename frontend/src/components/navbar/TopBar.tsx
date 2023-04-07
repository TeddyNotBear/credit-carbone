import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { AppLogo } from '../../assets';
import { ConnectButton } from '../../components/buttons/ConnectButton';

import NavLink, { NavLinkProps } from './NavLink';

const Links: NavLinkProps[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'UCO',
    path: '/uco',
  },
  {
    name: 'SCC',
    path: '/scc',
  },
  {
    name: 'Marketplace',
    path: '/marketplace',
  },
  {
    name: 'Profile',
    path: '/profile',
  },
];

const TopBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Link to="/">
              <Image h="10" src={AppLogo} alt="logo" />
            </Link>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map(link => 
              {
                if(localStorage.getItem('role') == 'Corporate' && (link.name == 'Marketplace' || link.name == 'Profile') ) {
                  return(
                    <NavLink key={link.name} name={link.name} path={link.path} />
                  )
                }
                if(localStorage.getItem('role') == 'Mandataire' && (link.name == 'Marketplace' || link.name == 'Profile' || link.name == 'UCO' || link.name == 'SCC' ) ) {
                  return(
                    <NavLink key={link.name} name={link.name} path={link.path} />
                  )
                }
              })}
            </HStack>
          </HStack>
          <Flex alignItems={'center'} justify="flex-end">
            <ConnectButton />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(link => (
                <NavLink key={link.name} name={link.name} path={link.path} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default TopBar;