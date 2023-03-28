import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalCloseButton
} from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import { useUpload, useUploadToIPFS, useVerif } from '../../api/file';
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
    
interface SccModalProps {
    jsonData: string[] | undefined;
    isOpen: boolean;
    onClose: () => void;
}
    
export const SccModal: FC<SccModalProps> = ({ jsonData, isOpen, onClose }) => {
    const [ipfsLoading, setIpfsLoading] = useState<boolean>(false);
    const [isVerif, setIfVerif] = useState<boolean>();
    const { uploadToIPFS } = useUploadToIPFS();
    const { upload } = useUpload();
    const { userInfo } = useWeb3Auth();
    const { verif } = useVerif();

    const uploadToIPFSSuccess = (callbackData: any) => {
        console.log(callbackData.message);
    };

    const uploadToIPFSError = () => {};

    const verifSuccess = (callbackData: any) => {
        console.log(callbackData.message);
        setIfVerif(callbackData.message);
    };

    const verifError = () => {};

    const handleVerif = useCallback(async () => {
        if(jsonData) {
            verif({
                jsonData: jsonData,
                email: userInfo.email,
                onSuccess: verifSuccess,
                onError: verifError,
            })
        }
    }, [jsonData, userInfo]);

    const handleUpload = useCallback(async () => {
        if(jsonData) {
            console.log("VERIFIED")
            setIpfsLoading(true);
            uploadToIPFS({
                jsonData: jsonData,
                onSuccess: uploadToIPFSSuccess,
                onError: uploadToIPFSError,
            });
            setIpfsLoading(false);

            /*upload({
                jsonData: jsonData,
                type: 'SCC',
                email: userInfo.email,
            })*/
        }
    }, [jsonData, userInfo]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Notice</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    As a reminder, carbon credits can only be added once a year
                </ModalBody>
                
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme='green' onClick={async () => {
                        handleVerif();
                        onClose();
                    }}>Accept</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};