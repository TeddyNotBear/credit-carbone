import { Container, Flex, Spacer } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { UploadBox } from "../components/files/UploadBox";
import { SccBox } from "../components/metadatas/SccBox";

const SccView: FC = () => {

    return (
        <Flex px={16}>
            <UploadBox type={'SCC'} />
            <Spacer />
            <SccBox />
        </Flex>
    );
}

export default SccView;