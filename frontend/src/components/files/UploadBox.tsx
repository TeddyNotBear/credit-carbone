import { AspectRatio, Box, Button, ButtonGroup, Center, Container, Heading, Input, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useUpload, useUploadToIPFS } from "../../api/file";
import { ethers, Contract } from 'ethers';

import { useWeb3Auth } from "../../hooks/useWeb3Auth";
import { useGetUCOByEmail } from "../../api/file";
import { SccModal } from "../modals/SccModal";

import { UCO_PROXY_CONTRACT_ADDRESS } from "../../constants/addresses";
import { UCO_ABI } from "../../abi";

import * as XLSX from 'xlsx/xlsx.mjs';
import { trimString } from "../../utils/trimString";

export const UploadBox: FC<{ type: string }> = ({ type }) => {
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();

    const [jsonData, setJsonData] = useState<string[] | undefined>();
    const [isSuccess, setSuccess] = useState<boolean>(false);
    const [callbackMessage, setCallbackMessage] = useState<string>();
    const [ipfsHashes, setIpfsHashes] = useState<[]>();
    const [ipfsLoading, setIpfsLoading] = useState<any>(false);
    const [userEmail, setUserEmail] = useState<string>("");
    const [contract, setContract] = useState<any>();
    const [txHash, setTxHash] = useState<string>();

    const { provider } = useWeb3Auth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { uploadToIPFS } = useUploadToIPFS();
    const { upload } = useUpload();
    const { userInfo } = useWeb3Auth();

    const mint = async () => {
        console.log(ipfsHashes);
        try {
            if(ipfsHashes) {
                const browserProvider = new ethers.BrowserProvider(provider);
                const signer = await browserProvider.getSigner();
                const ucoContract = new Contract(UCO_PROXY_CONTRACT_ADDRESS, UCO_ABI, signer);
                const tx = await ucoContract.mint(ipfsHashes.length, ipfsHashes);
                setTxHash(tx.hash);
                setIpfsLoading(true);
                await tx.wait();
                setIpfsLoading(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const uploadToIPFSSuccess = (callbackData: any) => {
        setSuccess(true);
        setCallbackMessage(callbackData.message);
        setIpfsHashes(callbackData.data);
        console.log(callbackData.data);
        if(jsonData) {
            upload({
                jsonData: jsonData,
                type: 'UCO',
                email: userInfo.email,
            })
        }
    };

    const uploadToIPFSError = () => {};

    const handleUpload = useCallback(async () => {
        if(jsonData) {
            setIpfsLoading(true);
            uploadToIPFS({
                jsonData: jsonData,
                onSuccess: uploadToIPFSSuccess,
                onError: uploadToIPFSError,
            });
            setIpfsLoading(false);
        }
    }, [jsonData]);

    const handleXLSXFile = useCallback(async (event: any) => {
        event.preventDefault();
        if(event.target.files) {
            const reader = new FileReader();
            reader.onload = (event?: any) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "array" })
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setJsonData(json);
                console.log(json)
            }
            reader.readAsArrayBuffer(event.target.files[0]);
        }
    }, [jsonData]);

    return (
      <div>
            <AspectRatio width="64" ratio={1}>
                <Box
                    borderColor="gray.300"
                    borderStyle="dashed"
                    borderWidth="2px"
                    rounded="md"
                    shadow="sm"
                    role="group"
                    transition="all 150ms ease-in-out"
                    _hover={{
                    shadow: "md"
                    }}
                    as={motion.div}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                >
                    <Box position="relative" height="100%" width="100%">
                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        height="100%"
                        width="100%"
                        display="flex"
                        flexDirection="column"
                    >
                        <Stack
                        height="100%"
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justify="center"
                        spacing="4"
                        >
                        <Box height="16" width="12" position="relative">
                        </Box>
                        <Stack p="8" textAlign="center" spacing="1">
                            <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                            Drop files here
                            </Heading>
                            <Text fontWeight="light">or click to upload</Text>
                        </Stack>
                        </Stack>
                    </Box>
                    <Input
                        type="file"
                        height="100%"
                        width="100%"
                        position="absolute"
                        top="0"
                        left="0"
                        opacity="0"
                        aria-hidden="true"
                        onDragEnter={startAnimation}
                        onDragLeave={stopAnimation}
                        onChange={(e) => handleXLSXFile(e)}
                    />
                    </Box>
                </Box>
            </AspectRatio>
            { isSuccess && <Text color="green">{ callbackMessage }</Text> }
            { txHash &&  
                <a href={`https://mumbai.polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                    Tx hash : { trimString(txHash, 18) }
                </a>
            }
            <ButtonGroup gap='1' pt={4}>
                {
                    type && type === 'UCO'
                    ? <Button onClick={handleUpload} colorScheme='green'>Upload</Button>
                    : <Button onClick={onOpen} colorScheme='green'>Upload</Button>
                }
                { !ipfsLoading 
                    ? <Button onClick={mint} colorScheme='orange'>Mint</Button>
                    : <Button 
                        isLoading 
                        loadingText='Minting...' 
                        colorScheme='orange'
                        variant='outline'
                        spinnerPlacement='start'
                    >
                        Mint
                    </Button> 
                }
            </ButtonGroup>
            <SccModal jsonData={jsonData} isOpen={isOpen} onClose={onClose} setSuccess={setSuccess} />
      </div>
    );
}