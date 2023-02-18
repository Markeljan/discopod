import { PodcastCard } from "@/components/PodcastCard";
import Link from "next/link";
import Image from "next/image";
import { Text, Flex, Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex
      minH="full"
      h="full"
      backgroundColor="black"
      paddingX="10"
      gap={8}
      alignItems={{ base: "center", lg: "stretch" }}
      justifyContent="space-between"
      flexDirection="column"
    >
      <Flex
        justify="space-between"
        flexDirection={{ base: "column", lg: "row" }}
        gap={8}
      >
        <Flex
          gap={4}
          flexDirection="column"
          alignItems={{ base: "center", lg: "start" }}
          paddingY={10}
        >
          <Text
            fontSize="4xl"
            fontWeight="medium"
            color="white"
            textAlign={{ base: "center", lg: "left" }}
            maxW="80"
          >
            JOIN THE PUBLIC DISCOURSE
          </Text>
          <Link href="https://twitter.com/discopodxyz" target="_blank">
            <Button colorScheme="purple" borderRadius="md">
              JOIN THE DISCO
            </Button>
          </Link>
        </Flex>

        <Flex order={{ base: "first", lg: "none" }}   justifyItems="center">
          <Image
            alt="discopod logo"
            src="/discopodlogov0.svg"
            width={300}
            height={300}
          />
        </Flex>

        <Flex
          gap={4}
          flexDirection="column"
          alignItems={{ base: "center", lg: "end" }}
          paddingY={10}
        >
          <Text
            fontSize="4xl"
            fontWeight="medium"
            color="white"
            textAlign={{ base: "center", lg: "right" }}
            maxW="80"
          >
            DISCO POD FOR PUBLIC GOODS
          </Text>
          <Link href="/create">
            <Button colorScheme="purple">CREATE A PODCAST</Button>
          </Link>
        </Flex>
      </Flex>

      <Flex
        flexDirection={{ base: "column", lg: "row" }}
        justify="space-between"
        alignItems={{ base: "center", lg: "stretch" }}
        gap={8}
        paddingY={10}
      >
        <PodcastCard
          title="Carbon Credits in Web3"
          hostName="mark.eth"
          guestName="mike.eth"
          topic="Carbon Credits in Web3"
          fundGoal={250}
          fundRaised={220}
        />
        <PodcastCard
          title="Ocean Cleaning"
          hostName="mary.eth"
          guestName="mike.eth"
          topic="Ocean Cleaning"
          fundGoal={500}
          fundRaised={450}
        />
        <PodcastCard
          title="Climate Tech"
          hostName="naama.eth"
          guestName="mike.eth"
          topic="Climate Tech"
          fundGoal={1000}
          fundRaised={450}
        />
      </Flex>
    </Flex>
  );
}
