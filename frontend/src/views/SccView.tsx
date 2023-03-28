import { Container, Flex, Spacer } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import { UploadBox } from "../components/files/UploadBox";

const SccView: FC = () => {

    return (
        <Flex px={16}>
            <UploadBox type={'SCC'} />
        </Flex>
    );
}

export default SccView;