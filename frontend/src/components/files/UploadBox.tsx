import { AspectRatio, Box, Button, ButtonGroup, Heading, Input, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useUpload, useUploadToIPFS } from "../../api/file";
import { ethers, Contract } from 'ethers';

import { useWeb3Auth } from "../../hooks/useWeb3Auth";
import { SccModal } from "../modals/SccModal";

import { SCC_PROXY_CONTRACT_ADDRESS, UCO_PROXY_CONTRACT_ADDRESS } from "../../constants/addresses";
import { SCC_ABI, UCO_ABI } from "../../abi";

import * as XLSX from 'xlsx/xlsx.mjs';
import { trimString } from "../../utils/trimString";

export const UploadBox: FC<{ type: string }> = ({ type }) => {
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();

    const [jsonData, setJsonData] = useState<string[] | undefined>();
    const [sccIds, setSccIds] = useState<string[]>([]);
    const [isSuccess, setSuccess] = useState<boolean>(false);
    const [callbackMessage, setCallbackMessage] = useState<string>();
    const [ipfsHashes, setIpfsHashes] = useState<[]>();
    const [ipfsLoading, setIpfsLoading] = useState<any>(false);
    const [mintLoading, setMintLoading] = useState<any>(false);
    const [txHash, setTxHash] = useState<string>();

    const { provider, address } = useWeb3Auth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { uploadToIPFS } = useUploadToIPFS();
    const { upload } = useUpload();
    const { userInfo } = useWeb3Auth();

    const mint = async () => {
        console.log('Upload Box :', ipfsHashes);
        try {
            if (ipfsHashes) {
                const browserProvider = new ethers.BrowserProvider(provider);
                const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY!, browserProvider);
                let tx;
                if (type === 'UCO') {
                    const ucoContract = new Contract(UCO_PROXY_CONTRACT_ADDRESS, UCO_ABI, signer);
                    tx = await ucoContract.mint(address, ipfsHashes.length, ipfsHashes);
                } else if(type === 'SCC') {
                    console.log('SCC');
                    const sccContract = new Contract(SCC_PROXY_CONTRACT_ADDRESS, SCC_ABI, signer);
                    console.log('sccIds :', sccIds);
                    tx = await sccContract.mint(address, ipfsHashes.length, ipfsHashes, sccIds);
                }
                setMintLoading(true);
                await tx.wait();
                setMintLoading(false);
                setTxHash(tx.hash);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const uploadToIPFSSuccess = (callbackData: any) => {
        console.log(type);
        setSuccess(true);
        setCallbackMessage(callbackData.message);
        setIpfsHashes(callbackData.data);
        setIpfsLoading(false);
        console.log(callbackData.data);
        if (jsonData) {
            upload({
                jsonData: jsonData,
                type: type,
                email: localStorage.getItem('userEmail')!,
            })
        }
    };

    const uploadToIPFSError = () => { };

    const handleUpload = useCallback(async () => {
        if (jsonData) {
            let formatedJSON = new Array<any>;
            jsonData.forEach((json: any) => {
                let tmp = {
                    name: json.id_uco,
                    description: "La description du projet registry",
                    image: "ipfs://QmetGyhGKYhyjyGci6bZo8h29psLm3LqMFAwgNSxLHFYRQ/POC.png",
                    attributes: [
                        {
                            trait_type: "uco_registry",
                            value: json.uco_registry
                        },
                        {
                            trait_type: "uco_parcel_id",
                            value: json.uco_parcel_id
                        },
                        {
                            trait_type: "uco_parcel_area",
                            value: json.uco_parcel_area
                        },
                        {
                            trait_type: "uco_vintage",
                            value: json.uco_vintage.toString()
                        },
                        {
                            trait_type: "uco_country",
                            value: json.uco_country
                        },
                        {
                            trait_type: "uco_project_id",
                            value: json.uco_project_id
                        },
                        {
                            trait_type: "uco_primary_crop",
                            value: json.uco_primary_crop
                        },
                        {
                            trait_type: "uco_project_type",
                            value: json.uco_project_type
                        },
                        {
                            trait_type: "uco_project_developer",
                            value: json.uco_project_developer
                        },
                        {
                            trait_type: "uco_wallet_id",
                            value: json.uco_wallet_id
                        }
                    ],
                    compiler: "VMS"
                };
                formatedJSON.push(
                    tmp
                )
            })
            setIpfsLoading(true);
            console.log(localStorage.getItem('userEmail')!)
            uploadToIPFS({
                jsonData: formatedJSON,
                email: localStorage.getItem('userEmail')!,
                onSuccess: uploadToIPFSSuccess,
                onError: uploadToIPFSError,
            });
        }
    }, [jsonData]);

    const handleXLSXFile = useCallback(async (event: any) => {
        event.preventDefault();
        if (event.target.files) {
            const reader = new FileReader();
            reader.onload = (event?: any) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "array" })
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setJsonData(json);
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
            {isSuccess && <Text color="green">{callbackMessage}</Text>}
            {txHash &&
                <a href={`https://mumbai.polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                    Tx hash : {trimString(txHash, 18)}
                </a>
            }
            <ButtonGroup gap='1' pt={4}>
                {
                    type && type === 'UCO'
                        ? !ipfsLoading
                            ? <Button onClick={handleUpload} colorScheme='green'>Upload</Button>
                            : <Button
                                isLoading
                                loadingText='Uploading...'
                                colorScheme='green'
                                variant='outline'
                                spinnerPlacement='start'
                            >
                                Upload
                            </Button>
                        : <Button onClick={onOpen} colorScheme='green'>Upload</Button>
                }
                {!mintLoading
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
            <SccModal
                jsonData={jsonData}
                isOpen={isOpen}
                onClose={onClose}
                setSuccess={setSuccess}
                setCallbackMessage={setCallbackMessage}
                setIpfsHashes={setIpfsHashes}
                setSccIds={setSccIds}
            />
        </div>
    );
}