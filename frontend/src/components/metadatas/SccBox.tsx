import { Badge, Box, Button, Flex, Grid, Image, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { ISCC } from "../../types/SCC";

import { SCCLogo } from "../../assets";
import { useGetSCCByEmail, usePutOnSaleSCC } from "../../api/file";
import { Contract, ethers } from "ethers";
import { useWeb3Auth } from "../../hooks/useWeb3Auth";
import { SCC_PROXY_CONTRACT_ADDRESS } from "../../constants/addresses";
import { SCC_ABI } from "../../abi";

export const SccBox: FC = () => {
  const { sccsData, isLoading, isError } = useGetSCCByEmail();
  const { provider, address, userInfo } = useWeb3Auth();
  const { putOnSaleSCC } = usePutOnSaleSCC();

  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>();
  const [sellLoading, setSellLoadingLoading] = useState<any>(false);

  const handleAmount = (e: any) => {
    setAmount(e.target.value);
  }

  const sellItem = async (amount: string, tokenId: number, sccId: string) => {
    console.log(tokenId);
    try {
      const browserProvider = new ethers.BrowserProvider(provider);
      const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY!, browserProvider);
      const sccContract = new Contract(SCC_PROXY_CONTRACT_ADDRESS, SCC_ABI, signer);
      const tx = await sccContract.putOnSale(address, tokenId - 1, ethers.parseEther(amount));
      setSellLoadingLoading(true);
      await tx.wait();
      setSellLoadingLoading(false);
      console.log(tx.hash);
      setTxHash(tx.hash);

      putOnSaleSCC({
        sccId: sccId,
        email: userInfo.email,
      });
    } catch (error: any) {
      console.error(error);
    }
  }
  return (
    <>
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
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
                <Flex p='6'>
                  {
                    !sccData.onSale && sccData.scc_retirement_status !== 'Compensate'
                    ? <InputGroup pr={2} >
                        <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em' children='$' />
                        <Input onChange={(e: any) => handleAmount(e)} placeholder='Enter amount' />
                      </InputGroup>
                    : <></>
                  }
                  {
                    !sellLoading
                    ? !sccData.onSale && sccData.scc_retirement_status !== 'Compensate'
                      ? <Button onClick={() => sellItem(amount, sccData.onChainId, sccData.id_scc)} colorScheme='orange'>Sell</Button>
                      : <></>
                    : !sccData.onSale
                      ? <Button 
                          isLoading 
                          loadingText='Selling...' 
                          colorScheme='orange'
                          variant='outline'
                          spinnerPlacement='start'
                        >
                          Sell
                        </Button> 
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
};