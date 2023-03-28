import { AspectRatio, Box, Button, ButtonGroup, Center, Container, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useUpload, useUploadToIPFS } from "../../api/file";

import * as XLSX from 'xlsx/xlsx.mjs';
import { useWeb3Auth } from "../../hooks/useWeb3Auth";
import { useGetUCOByEmail } from "../../api/file";

export const UploadBox: FC = () => {
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();

    const [jsonData, setJsonData] = useState<string[] | undefined>();
    const [ipfsLoading, setIpfsLoading] = useState<any>(false);
    const [userEmail, setUserEmail] = useState<string>("");
    const { uploadToIPFS } = useUploadToIPFS();
    const { upload } = useUpload();
    const { getUserInfo } = useWeb3Auth();

    const uploadToIPFSSuccess = (callbackData: string[]) => {
        console.log(callbackData);
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

            const userInfo = await getUserInfo();
            upload({
                jsonData: jsonData,
                type: 'UCO',
                email: userInfo.email,
            })

        }
    }, [jsonData, getUserInfo]);

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
                            Drop images here
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
            <ButtonGroup gap='1' pt={4}>
                <Button onClick={handleUpload} colorScheme='green'>Upload</Button>
                <Button colorScheme='orange'>Mint</Button>
            </ButtonGroup>
      </div>
    );
}