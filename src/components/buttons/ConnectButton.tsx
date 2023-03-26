import {
    Button,
    Popover,
    PopoverTrigger,
    useDisclosure,
  } from '@chakra-ui/react';
  import { FC, useCallback, useMemo } from 'react';
  
  import { useWeb3Auth } from '../../hooks/useWeb3Auth';
  import { trimString } from '../../utils/trimString';
  import { WalletModal } from '../modals/WalletModal';
  
  export const ConnectButton: FC = () => {
    const { login, logout, address } = useWeb3Auth();
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const buttonLabel = useMemo(() => {
      if (address) {
        return address;
      }
      return 'Connect';
    }, [address]);
  
    const handleLogin = useCallback(() => {
      login();
    }, [login]);
  
    const handleLogout = useCallback(() => {
      logout();
    }, [logout]);
  
    return (
      <>
        <Popover trigger="hover">
          <PopoverTrigger>
            <Button onClick={handleLogin}>{trimString(buttonLabel, 7)}</Button>
          </PopoverTrigger>
        </Popover>
        <WalletModal isOpen={isOpen} onClose={onClose} />
      </>
    );
  };