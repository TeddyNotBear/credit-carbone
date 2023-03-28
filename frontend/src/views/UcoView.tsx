import { Container, Flex, Spacer } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { UploadBox } from "../components/files/UploadBox";
import { MetadatasBox } from "../components/metadatas/MetadatasBox";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

const UcoView: FC = () => {

    return (
        <Flex px={16}>
            <UploadBox />
            <Spacer />
            <MetadatasBox />
        </Flex>
    );
}

export default UcoView;