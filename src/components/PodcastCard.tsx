import Link from "next/link";
import {
  Card,
  CardBody,
  CardFooter,
  Flex,
  Text,
  Container,
} from "@chakra-ui/react";

type Props = {
  title: string;
  hostName: string;
  guestName: string;
  topic: string;
  fundGoal: number;
  fundRaised: number;
};

export const PodcastCard = ({
  title,
  hostName,
  guestName,
  topic,
  fundGoal,
  fundRaised,
}: Props) => {
  const fundPercentage = (fundRaised / fundGoal) * 100;
  return (
    <Link href={`/${title}`}>
      <Card
        width={80}
        maxWidth={80}
        borderRadius="xl"
        _hover={{ backgroundColor: "gray.100" }}
        _active={{ backgroundColor: "gray.100" }}
      >
        <CardBody padding={4}>
          <Flex gap={4}>
            <Flex
              padding={4}
              borderRadius="2xl"
              bgGradient="linear(to-br, blue.400, purple.500, pink.400)"
              alignItems="center"
              w={60}
              maxW={60}
            >
              <Text
                fontWeight="bold"
                color="white"
                fontSize="xl"
                textAlign="center"
              >
                {topic}
              </Text>
            </Flex>
            <Flex flexDirection="column" textAlign="center" w={60}>
              <Text color="red.500" fontWeight="bold" fontSize="xl">
                Live
              </Text>
              <Text fontWeight="bold" fontSize="xl">
                {hostName}
              </Text>
              <Text fontSize="lg">hosting</Text>
              <Text fontWeight="bold" fontSize="xl">
                {guestName}
              </Text>
            </Flex>
          </Flex>
        </CardBody>
        <CardFooter padding={4} paddingTop={0}>
          <Container
            position="relative"
            w="full"
            h={6}
            bgColor="black"
            borderRadius="full"
          >
            <Container
              h={6}
              position="absolute"
              left={0}
              bgGradient="linear(to-b,  purple.500, pink.500)"
              style={{ width: `${fundPercentage}%` }}
              borderRadius="full"
            />

            <Text
              color="white"
              fontWeight="semibold"
              position="absolute"
              right={0}
              paddingRight={4}
            >
              ${fundGoal}
            </Text>
          </Container>
        </CardFooter>
      </Card>
    </Link>
  );
};
