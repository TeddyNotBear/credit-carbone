import { Badge, Box, Button, Flex, Grid, Image, Text, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { FC, useEffect } from "react";
import { SCC_ABI } from "../abi";
import { useGetSCCOnSale, useRemoveFromSaleCC } from '../api/file';
import { SCCLogo } from '../assets';
import { SCC_PROXY_CONTRACT_ADDRESS } from "../constants/addresses";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { ISCC } from "../types/SCC";

const MarketplaceView: FC = () => {
    const { sccsData, isLoading, isError } = useGetSCCOnSale();
    const { removeFromSaleSCC } = useRemoveFromSaleCC();
    const { provider } = useWeb3Auth();
    
    const removeItem = async (idx: number, sccId: string) => {
        console.log(idx);
        console.log(sccId);
        try {
          const browserProvider = new ethers.BrowserProvider(provider);
          const signer = await browserProvider.getSigner();
          const sccContract = new Contract(SCC_PROXY_CONTRACT_ADDRESS, SCC_ABI, signer);
          const tx = await sccContract.removeFromSale(idx);
          await tx.wait();
          console.log(tx.hash);
    
          removeFromSaleSCC({
            sccId: sccId,
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
                            <Button colorScheme='orange'>Buy</Button>
                            <Button onClick={() => removeItem(idx, sccData.id_scc)} colorScheme='red'>Remove</Button>
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

