import { AspectRatio, Box, Button, ButtonGroup, Center, Container, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { FC } from "react";

export const UploadBox: FC = () => {
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();

    return (
      <div>
            <AspectRatio width="64" ratio={1}>
                <Box
                    borderColor="gray.300"
                    borderStyle="dashed"
                    borderWidth="2px"
                    rounded="md"
                    shadow="sm"
                    role="group"
                    transition="all 150ms ease-in-out"
                    _hover={{
                    shadow: "md"
                    }}
                    as={motion.div}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                >
                    <Box position="relative" height="100%" width="100%">
                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        height="100%"
                        width="100%"
                        display="flex"
                        flexDirection="column"
                    >
                        <Stack
                        height="100%"
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justify="center"
                        spacing="4"
                        >
                        <Box height="16" width="12" position="relative">
                        </Box>
                        <Stack p="8" textAlign="center" spacing="1">
                            <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                            Drop images here
                            </Heading>
                            <Text fontWeight="light">or click to upload</Text>
                        </Stack>
                        </Stack>
                    </Box>
                    <Input
                        type="file"
                        height="100%"
                        width="100%"
                        position="absolute"
                        top="0"
                        left="0"
                        opacity="0"
                        aria-hidden="true"
                        accept="image/*"
                        onDragEnter={startAnimation}
                        onDragLeave={stopAnimation}
                    />
                    </Box>
                </Box>
            </AspectRatio>
            <ButtonGroup gap='1' pt={4}>
                <Button colorScheme='green'>Upload</Button>
                <Button colorScheme='orange'>Mint</Button>
                <Button colorScheme='twitter'>My UCO</Button>
            </ButtonGroup>
      </div>
    );
}