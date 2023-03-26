import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
import { AppLogo } from '../../assets';

const Footer = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      mt="14"
      bgColor="black"
      justifyContent="space-between"
      p="6"
    >
      <Box display="grid" justifyContent="center" pl="10" flexBasis="33%">
        <Box textAlign="left" >
          <SocialIcon
            network="discord"
            bgColor="gray"
            style={{ height: 30, width: 30, marginRight: 24 }}
          />
          <SocialIcon
            network="twitter"
            bgColor="gray"
            style={{ height: 30, width: 30, marginRight: 24 }}
          />
          <SocialIcon
            network="github"
            bgColor="gray"
            style={{ height: 30, width: 30, marginRight: 24 }}
          />
          <SocialIcon
            network="telegram"
            bgColor="gray"
            style={{ height: 30, width: 30, marginRight: 24 }}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexBasis="16.7%"
        fontSize="lg"
        textAlign="left"
      >
        <Text fontWeight="bold" fontSize="lg" textColor="white" pt="3">
          Support
        </Text>
        <Box pt="4" fontSize="sm" textColor="white">
          <Link to={'/documentation'}>Documentation</Link>
        </Box>
        <Box pt="4" fontSize="sm" textColor="white">
          <Link to={'/api_status'}>API Status</Link>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexBasis="16.7%"
        fontSize="lg"
        textAlign="left"
      >
        <Text fontWeight="bold" fontSize="lg" textColor="white" pt="3">
          Company
        </Text>
        <Box pt="4" fontSize="sm" textColor="white">
          <Link to={'/about'}>About</Link>
        </Box>
        <Box pt="4" fontSize="sm" textColor="white">
          <Link to={'/jobs'}>Jobs</Link>
        </Box>
        <Box pt="4" fontSize="sm" textColor="white">
          <Link to={'/press'}>Press</Link>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexBasis="16.7%"
        fontSize="lg"
        textAlign="left"
      >
        <Text fontWeight="bold" fontSize="lg" textColor="white" pt="3">
          Legal
        </Text>
        <Box pt="4" fontSize="sm" textColor="white">
          <Link to={'/terms'}>Terms</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;