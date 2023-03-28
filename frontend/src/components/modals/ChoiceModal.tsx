import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  RadioGroup,
  Stack,
  Radio
} from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import { useCreateNewUser } from '../../api/user';
  
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
  
interface ChoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}
  
export const ChoiceModal: FC<ChoiceModalProps> = ({ isOpen, onClose }) => {
  const { login, logout, getUserInfo, getAccounts, address } = useWeb3Auth();
  const [role, setRole] = useState<string>();
  const { mutationFunc } = useCreateNewUser();

  const handleSuccess = () => {
    onClose();
  };

  const handleRegister = useCallback(async () => {
    await login();
    const userInfo = await getUserInfo();
    const address = await getAccounts();

    if(userInfo) {
      console.log(userInfo.email)
      console.log(address)
      console.log(role)
      console.log('Condition OK !')

      if(role) {
        console.log('Condition OK 2!')
        localStorage.setItem("userEmail", userInfo.email);
        localStorage.setItem("walletAddress", address);
        localStorage.setItem("role", role);
      
        mutationFunc({
          email: userInfo.email,
          wallet_address: address,
          role,
          onSuccess: handleSuccess
        })
      }
      
    }
  }, [role, getAccounts, getUserInfo]);

  const handleLogin = useCallback(async () => {
    await login();
    const userInfo = await getUserInfo();
    const address = await getAccounts();

    if(userInfo && address && role) {
      localStorage.setItem("userEmail", userInfo.email);
      localStorage.setItem("walletAddress", address);
    }
  }, [login]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect or create a new account</ModalHeader>
        <ModalBody>
          <Text fontSize='20px'>Choose your role</Text>
          <RadioGroup onChange={setRole} value={role} pb={4}>
              <Stack spacing={5} direction='row'>
                  <Radio colorScheme='orange' size='lg' value='Corporate'>Corporate</Radio>
                  <Radio colorScheme='green' size='lg' value='Mandataire'>Mandataire</Radio>
              </Stack>
          </RadioGroup>
          {
            !role
            ? <Button onClick={handleRegister} mr={3} colorScheme='blue' isDisabled>Register</Button>
            : <Button onClick={handleRegister} mr={3} colorScheme='blue'>Register</Button>
          }
          <Button onClick={handleLogin} colorScheme='green'>Login</Button>
          { !role && <Text color='red'>*Select a role in order to register</Text> }
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};