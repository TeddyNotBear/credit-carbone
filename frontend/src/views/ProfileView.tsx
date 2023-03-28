import {
    Heading,
    Avatar,
    Box,
    Center,
    Text,
    useColorModeValue,
    Button,
} from '@chakra-ui/react';
import { FC, useCallback, useState } from "react";
import { BlankAvatarLogo } from '../assets';
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { trimString } from '../utils/trimString';

const ProfileView: FC = () => {
    const { userInfo, address, getPrivateKey } = useWeb3Auth();
    const [privateKey, setPrivateKey] = useState<string>();

    const handlePrivateKey = useCallback(async () => {
        const privateKeyResult = await getPrivateKey();
        setPrivateKey(privateKeyResult);
    }, [getPrivateKey]);

    return (
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
                    { address && trimString(address, 12) }
                </Text>
                <Button colorScheme='red' onClick={handlePrivateKey}>Export your private key</Button>
                { privateKey && <Text>{ privateKey }</Text>}
            </Box>
        </Center>
    );
}

export default ProfileView;