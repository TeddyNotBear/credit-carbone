import { Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { UploadBox } from "../components/files/UploadBox";

const UcoView: FC = () => {


    return (
        <Flex>
            <UploadBox />
            {/* <MetadatasBox ucoData={} /> */}
        </Flex>
    );
}

export default UcoView;