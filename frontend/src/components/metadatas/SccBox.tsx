import { StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Grid, Image, SimpleGrid, Spacer } from "@chakra-ui/react";
import { FC } from "react";
import { ISCC } from "../../types/SCC";

import { SCCLogo } from "../../assets";
import { useGetSCCByEmail } from "../../api/file";

export const SccBox: FC = () => {
  const { sccsData, isLoading, isError } = useGetSCCByEmail();

  return (
    <>
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        {
          sccsData && sccsData.map((sccData: ISCC) => {
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
              </Box>
            );
          })
        }
      </Grid>
    </>
  );
};