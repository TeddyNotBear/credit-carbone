import {
  Button,
  Popover,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, useCallback, useMemo } from 'react';
  
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
import { trimString } from '../../utils/trimString';
import { ChoiceModal } from '../modals/ChoiceModal';
  
export const ConnectButton: FC = () => {
  const { login, logout, address } = useWeb3Auth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = useCallback(async () => {
    await logout();
    localStorage.removeItem("userEmail");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("role");
  }, [logout]);
  
  return (
    <>
      <Popover trigger="hover">
        <PopoverTrigger>
          {
            address 
            ? <Button onClick={handleLogout} colorScheme='red'>Disconnect</Button>
            : <Button onClick={onOpen} colorScheme='blue'>Connect</Button>
          }
        </PopoverTrigger>
      </Popover>
      <ChoiceModal isOpen={isOpen} onClose={onClose} />
    </>
  );
  };