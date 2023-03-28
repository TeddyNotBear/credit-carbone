import { Container, Flex, Spacer } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { UploadBox } from "../components/files/UploadBox";
import { UcoBox } from "../components/metadatas/UcoBox";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

const UcoView: FC = () => {

    return (
        <Flex px={16}>
            <UploadBox type={'UCO'} />
            <Spacer />
            <UcoBox />
        </Flex>
    );
}

export default UcoView;