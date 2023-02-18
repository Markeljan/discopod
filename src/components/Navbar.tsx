import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Flex, Container, Text } from "@chakra-ui/react";
export default function Navbar() {
  return (
    <Container width="full" maxWidth="full" paddingY={2}>
      <Flex justify="center" alignItems="center" w="full">
        <Flex w="50%" justify="start" alignItems="center" paddingX={4} gap={4}>
          <Flex justify="start">
            <Link href="/">
              <Text fontWeight="bold" _hover={{ color: "blackAlpha.700" }}>
                Disco Pod
              </Text>
            </Link>
          </Flex>
        </Flex>
        <Flex w="50%" alignItems="center" justify="end" paddingX={2} gap={4}>
          <Flex
            marginX={4}
            borderRadius="xl"
            bgColor="blackAlpha.100"
            _hover={{ bgColor: "blackAlpha.200" }}
          >
            <Link href="/create">
              <Text fontWeight="bold" p={2}>
                Create
              </Text>
            </Link>
          </Flex>

          <ConnectButton />
        </Flex>
      </Flex>
    </Container>
  );
}
