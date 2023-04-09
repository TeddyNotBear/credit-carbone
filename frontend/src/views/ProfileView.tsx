import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    useColorModeValue,
    Button,
    Badge,
    Stack,
    Grid,
    Image
} from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from "react";
import { BlankAvatarLogo, SCCLogo } from '../assets';
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { ethers, Contract } from 'ethers';
import { SCC_PROXY_CONTRACT_ADDRESS } from '../constants/addresses';
import { SCC_ABI } from '../abi';
import { ISCC } from '../types/SCC';
import { useCompensateSCC } from '../api/file';

const ProfileView: FC = () => {
    const { userInfo, address, provider, getPrivateKey } = useWeb3Auth();
    const { compensateSCC } = useCompensateSCC();
    const [privateKey, setPrivateKey] = useState<string>();
    const [tokensOwnedArr, setTokensOwnedArr] = useState<any[]>();

    const handlePrivateKey = useCallback(async () => {
        const privateKeyResult = await getPrivateKey();
        setPrivateKey(privateKeyResult);
    }, [getPrivateKey]);

    useEffect(() => {
        const init = async () => {
          try {
            const browserProvider = new ethers.BrowserProvider(provider);
            const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY!, browserProvider);
            const sccContract = new Contract(SCC_PROXY_CONTRACT_ADDRESS, SCC_ABI, signer);
            const counter = await sccContract.tokensOwnedCount(address);

            let jsonArr: ISCC[] = [];

            for (let index = 0; index < counter; index++) {
                const res = await sccContract.tokensOwned(address, index);
                const resTokensOwned = await sccContract.uri(res);
                const response = await fetch(`https://ipfs.io/${resTokensOwned}`);

                if(!response.ok)
                throw new Error(response.statusText);

                const json = await response.json();
                jsonArr.push(json);
            }
            setTokensOwnedArr(jsonArr);
          } catch (error) {
            console.error(error);
          }
        };
    
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        init();
    }, [compensateSCC]);

    const compensateItem = async (tokenId: number) => {
        console.log('tokenId :', tokenId);
        try {
          compensateSCC({
            onChainId: tokenId,
          });
        } catch (error: any) {
          console.error(error);
        }
    }
    

    return (
        <>
            <Center py={6}>
                <Box
                    maxW={'400px'}
                    w={'full'}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'2xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}
                >
                    <Avatar
                        size={'xl'}
                        src={BlankAvatarLogo}
                        mb={4}
                        pos={'relative'}
                    />
                    <Heading fontSize={'2xl'} fontFamily={'body'}>{ userInfo.email }</Heading>
                    <Text fontWeight={600} color={'gray.500'} mb={4}>
                        { address && address }
                    </Text>
                    <Text textAlign={'center'} color={useColorModeValue('gray.700', 'gray.400')} py={3} mb={4}>
                        { localStorage.getItem('role') && localStorage.getItem('role') }
                    </Text>
                    <Button colorScheme='orange' onClick={handlePrivateKey}>Export your private key</Button>
                    { privateKey && <Text>{ privateKey }</Text>}
                </Box>
            </Center>
            <Grid templateColumns='repeat(4, 1fr)' gap={6} px={16} py={6}>
            {
                tokensOwnedArr && tokensOwnedArr.map((sccData: ISCC, idx: any) => {
                    return (
                    <Box maxW='sm' key={sccData.id_scc} borderWidth='1px' borderRadius='lg' overflow='hidden'>
                        <Image src={SCCLogo} alt={SCCLogo} />

                        <Box p='6'>
                        <Box display='flex' alignItems='baseline'>
                            <Badge borderRadius='full' px='2' colorScheme='teal'>New</Badge>
                            <Box
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            fontSize='xs'
                            textTransform='uppercase'
                            ml='2'
                            >
                            n°{sccData.id_scc} &bull; {sccData.scc_retirement_status} &bull; {sccData.uco_vintage}
                            </Box>
                        </Box>
                        <Box
                            mt='1'
                            fontWeight='semibold'
                            as='h4'
                            lineHeight='tight'
                            noOfLines={1}
                        >
                            {sccData.scc_registry} - {sccData.scc_ghg_value} ghg - {sccData.scc_farmer_fees} fees
                        </Box>
                        <Box>{sccData.uco_country}</Box>
                        <Box
                            color='gray.500'
                            fontSize='xs'
                            textTransform='uppercase'
                            >
                            linked to uco n°{sccData.scc_uco_id}
                            </Box>
                        </Box>
                        <Center pb={6}>
                            {   sccData.scc_retirement_status !== 'Compensate'
                                ? <Button onClick={() => compensateItem(sccData.onChainId)} colorScheme='orange'>Compensate</Button> 
                                : <></>
                            }
                        </Center>
                    </Box>
                    );
                })
            }
            </Grid>
        </>
    );
}

export default ProfileView;