import { StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Grid, Image, SimpleGrid } from "@chakra-ui/react";
import { FC } from "react";
import { IUCO } from "../../types/UCO";

import { UCOLogo } from "../../assets";
import { useGetUCOByEmail } from "../../api/file";

export const MetadatasBox: FC = () => {
  const { ucosData, isLoading, isError } = useGetUCOByEmail();
  console.log(ucosData)
  return (
    <>
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        {
          ucosData && ucosData.map((ucoData: IUCO) => {
            return (
              <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                <Image src={UCOLogo} alt={UCOLogo} />

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
                      n°{ucoData.id_uco} &bull; {ucoData.uco_retirement_status} &bull; {ucoData.uco_vintage}
                    </Box>
                  </Box>
                  <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={1}
                  >
                    {ucoData.uco_primary_crop} - {ucoData.uco_project_type}
                  </Box>
                  <Box>{ucoData.uco_country}</Box>
                </Box>
              </Box>
            );
          })
        }
      </Grid>
    </>
  );
};