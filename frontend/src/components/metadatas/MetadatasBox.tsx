import { StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Image } from "@chakra-ui/react";
import { FC } from "react";
import { IUCO } from "../../types/UCO";

import { UCOLogo } from "../../assets";

export const MetadatasBox: FC<{ ucoData: IUCO }> = ({ ucoData }) => {

  return (
    <>
       <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Image src={UCOLogo} alt={UCOLogo} />

        <Box p='6'>
          <Box display='flex' alignItems='baseline'>
            <Badge borderRadius='full' px='2' colorScheme='teal'>New</Badge>
          </Box>
          <Box
            mt='1'
            fontWeight='semibold'
            as='h4'
            lineHeight='tight'
            noOfLines={1}
          >
            {ucoData.id_uco}
          </Box>
        </Box>
      </Box>
    </>
  );
};