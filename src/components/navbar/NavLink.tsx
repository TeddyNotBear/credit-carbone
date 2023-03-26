import { Box, Link, useColorModeValue } from '@chakra-ui/react';
import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface NavLinkProps {
  name: string;
  path: string;
}

const NavLink: FC<NavLinkProps> = ({ name, path }) => (
  <Box
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
  >
    <RouterLink to={path}>{name}</RouterLink>
  </Box>
);

export default NavLink;