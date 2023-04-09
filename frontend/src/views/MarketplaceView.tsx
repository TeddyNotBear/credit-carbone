import { Badge, Box, Button, Flex, Grid, Image } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { FC, useState } from "react";
import { SCC_ABI } from "../abi";
import { useGetSCCOnSale, useRemoveFromSaleSCC } from '../api/file';
import { SCCLogo } from '../assets';
import { SCC_PROXY_CONTRACT_ADDRESS } from "../constants/addresses";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { ISCC } from "../types/SCC";

const MarketplaceView: FC = () => {
    const { sccsData } = useGetSCCOnSale();
    const { removeFromSaleSCC } = useRemoveFromSaleSCC();
    const { provider, address } = useWeb3Auth();
    const [buyLoading, setBuyLoadingLoading] = useState<any>(false);
    
    const removeItem = async (tokenId: number, sccId: string) => {
        try {
          const browserProvider = new ethers.BrowserProvider(provider);
          const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY!, browserProvider);
          const sccContract = new Contract(SCC_PROXY_CONTRACT_ADDRESS, SCC_ABI, signer);
          const tx = await sccContract.removeFromSale(address, tokenId - 1);
          await tx.wait();
          console.log(tx.hash);
    
          removeFromSaleSCC({
            sccId: sccId,
            email: localStorage.getItem('userEmail')!,
          });
        } catch (error: any) {
          console.error(error);
        }
    }

    const buyItem = async (tokenId: number, sccId: string) => {
        try {
            const browserProvider = new ethers.BrowserProvider(provider);
            const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY!, browserProvider);
            const sccContract = new Contract(SCC_PROXY_CONTRACT_ADDRESS, SCC_ABI, signer);
            setBuyLoadingLoading(true);
            console.log('tokenId :', tokenId - 1);
            await sccContract.buy(address, tokenId - 1);
            setBuyLoadingLoading(false);
            removeFromSaleSCC({
                sccId: sccId,
                email: localStorage.getItem('userEmail')!,
            });
        } catch (error: any) {
            console.error(error);
        }
    }

    return (
        <>
            <Grid templateColumns='repeat(4, 1fr)' gap={6} px={16}>
                {
                    sccsData && sccsData.map((sccData: ISCC, idx: any) => {
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
                            <Flex p='6' gap={2}>
                                {
                                    localStorage.getItem('role') == 'Corporate'
                                    ? !buyLoading
                                        ? <Button onClick={() => buyItem(sccData.onChainId, sccData.id_scc) } colorScheme='orange'>Buy</Button>
                                        : <Button 
                                            isLoading 
                                            loadingText='Buying...' 
                                            colorScheme='orange'
                                            variant='outline'
                                            spinnerPlacement='start'
                                        >
                                            Buy
                                        </Button> 
                                    : <></>
                                    
                                }
                                {
                                    localStorage.getItem('role') != 'Corporate'
                                    ? <Button onClick={() => removeItem(sccData.onChainId, sccData.id_scc)} colorScheme='red'>Remove</Button>
                                    : <></>
                                }
                            </Flex>
                        </Box>
                        );
                    })
                }
            </Grid>
        </>
    );
}

export default MarketplaceView;

