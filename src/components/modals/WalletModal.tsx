import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { FC } from 'react';
  
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
  
interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}
  
export const WalletModal: FC<WalletModalProps> = ({ isOpen, onClose }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to your wallet</ModalHeader>
          <ModalBody>
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