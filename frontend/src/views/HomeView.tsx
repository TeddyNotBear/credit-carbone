import {
    Heading,
    Flex,
    Spacer,
    Image
} from '@chakra-ui/react';
import { FC, useCallback, useState } from "react";
import { EnvironmentImg } from '../assets';

const HomeView: FC = () => {

    return (
        <Flex px={16}>
            <Heading>Crédit Carbone</Heading>
            <Spacer />
            <Image src={ EnvironmentImg } boxSize='700px' alt='Environment' />
        </Flex>
    );
}

export default HomeView;

