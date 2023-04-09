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
import { Contract, ethers } from 'ethers';
import {  FC, useCallback, useState } from 'react';
import { SCC_ABI } from '../../abi';
import { useUpload, useUploadToIPFS, useVerif } from '../../api/file';
import { SCC_PROXY_CONTRACT_ADDRESS } from '../../constants/addresses';
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
    
interface SccModalProps {
    jsonData: string[] | undefined;
    isOpen: boolean;
    onClose: () => void;
    setSuccess: any;
    setCallbackMessage: any;
    setIpfsHashes: any;
}
    
export const SccModal: FC<SccModalProps> = ({ jsonData, isOpen, onClose, setSuccess, setCallbackMessage, setIpfsHashes }) => {
    const [ipfsLoading, setIpfsLoading] = useState<boolean>(false);
    const [isVerif, setIfVerif] = useState<boolean>();
    
    const { uploadToIPFS } = useUploadToIPFS();
    const { upload } = useUpload();
    const { userInfo, provider } = useWeb3Auth();
    const { verif } = useVerif();

    const uploadToIPFSSuccess = (callbackData: any) => {
        console.log(callbackData);
        { setSuccess(true); }
        { setCallbackMessage(callbackData.message); }
        { setIpfsHashes(callbackData.data); }
    };

    const uploadToIPFSError = () => {};

    const verifSuccess = async (callbackData: any) => {
        setIfVerif(callbackData.message);
        if(callbackData.message) {
            console.log('TRUE');
            await handleUpload(jsonData);
            await handleUploadInDB(jsonData);
        }
        console.log('FALSE');
    };

    const verifError = () => {};

    const handleUploadInDB = useCallback(async (jsonData: any) => {
        if(jsonData) {
            upload({
                jsonData: jsonData,
                type: 'SCC',
                email: localStorage.getItem('userEmail')!,
            })
        }
    }, [jsonData, userInfo]);

    const handleVerif = useCallback(async () => {
        if(jsonData) {
            verif({
                jsonData: jsonData,
                email: localStorage.getItem('userEmail')!,
                onSuccess: verifSuccess,
                onError: verifError,
            })
        }
    }, [jsonData, userInfo]);

    const handleUpload = useCallback(async (jsonData: any) => {
        if(jsonData) {
            let formatedJSON = new Array<any>;
            jsonData.forEach((json: any) => {
                let tmp = {
                    name: json.id_scc,
                    description: "La description du projet registry",
                    image: "ipfs://QmetGyhGKYhyjyGci6bZo8h29psLm3LqMFAwgNSxLHFYRQ/POC.png",
                    attributes: [
                        {
                            trait_type: "scc_id",
                            value: json.id_scc
                        },
                        {
                            trait_type: "scc_address",
                            value: json.scc_address
                        },
                        /*{
                            trait_type: "scc_retirement_status",
                            value: json.scc_retirement_status
                        },*/
                        {
                            trait_type: "scc_ghg_value",
                            value: json.scc_ghg_value
                        },
                        {
                            trait_type: "scc_farmer_fees",
                            value: json.scc_farmer_fees
                        },
                        {
                            trait_type: "scc_developer_fees",
                            value: json.scc_developer_fees
                        },
                        {
                            trait_type: "scc_minter_registry_fees",
                            value: json.scc_minter_registry_fees
                        },
                        {
                            trait_type: "scc_registry",
                            value: json.scc_registry
                        },
                        {
                            trait_type: "uco_parcel_id",
                            value: json.uco_parcel_id
                        },
                        {
                            trait_type: "uco_project_developer",
                            value: json.uco_project_developer
                        },
                        {
                            trait_type: "scc_uco_id",
                            value: json.scc_uco_id
                        },
                        {
                            trait_type: "uco_project_id",
                            value: json.uco_project_id
                        },
                        {
                            trait_type: "scc_uco_id",
                            value: json.scc_uco_id
                        }
                    ],
                    compiler: "VMS"
                };
                formatedJSON.push(
                    tmp
                )
            })
            setIpfsLoading(true);
            uploadToIPFS({
                jsonData: formatedJSON,
                email: localStorage.getItem('userEmail')!,
                onSuccess: uploadToIPFSSuccess,
                onError: uploadToIPFSError,
            });
            setIpfsLoading(false);
        }
    }, [setSuccess]);

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
                        await handleVerif();
                        onClose();
                    }}>Accept</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};