import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { isAudioUrl, isVideoUrl } from "@/utils/helpers";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { AddEpisodeModal } from "@/components/AddEpisodeModal";

export async function getStaticPaths() {
  const paths: never[] = [];
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(context: { params: { pod: any } }) {
  const { pod } = context.params;
  const podNormal = pod.toString().toLowerCase();
  return {
    props: {
      podNormal,
    },
  };
}

const Pod = (props: any) => {
  const router = useRouter();
  const { podNormal: pod } = props;
  const { data: podcastId } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastNameToId",
    args: [pod],
  });
  const { address } = useAccount();
  const { data: podcast }: { data: any; isLoading: boolean } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastIdToPodcast",
    args: [podcastId],
  });
  const [podcastData, setPodcastData] = useState<any>({});
  const [podcastMetadataObject, setPodcastMetadataObject] = useState("");
  const [latestEpisodeFile, setLatestEpisodeFile] = useState<any>("");
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });

  const { data: latestEpisode }: { data: any } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "episodeIdToEpisode",
    args: [podcastData?.latestEpisodeId],
  });

  useEffect(() => {
    if (podcast?.name) {
      setPodcastData(podcast);
    }
    getMetadata(podcast?.metadataUri);
    if (latestEpisode?.episodeUri) {
      getEpisodeLink(latestEpisode?.episodeUri);
    }
  }, [podcast, latestEpisode]);

  const getMetadata = async (podcastMetadataUri: string) => {
    const response = await fetch(podcastMetadataUri);
    const json = await response.json();
    setPodcastMetadataObject(
      `https://nftstorage.link/ipfs/${json.image.substring(7)}`
    );
  };

  const getEpisodeLink = async (episodeMetadataUri: string) => {
    const response = await fetch(
      `https://nftstorage.link/ipfs/${latestEpisode?.episodeUri?.substring(7)}`
    );
    const json = await response.json();
    const episodeExternalUrl = await fetch(
      `https://nftstorage.link/ipfs/${json.external_url.substring(7)}`
    );

    setLatestEpisodeFile(episodeExternalUrl.url);
  };

  if (Object.keys(podcastData).length === 0)
    return (
      <Box bg="gray.100" h="100vh" p={6}>
        <Stack maxW="6xl" w="full" mx="auto" p={6} spacing={6}>
          <Box bg="primary.dark" p={6} rounded="lg" shadow="md">
            <Heading size="lg" mb={6} fontWeight="bold">
              Loading...
            </Heading>
            <Button
              bg="blue.500"
              color="white"
              p={2}
              rounded="lg"
              shadow="md"
              onClick={() => router.push("/create")}
            >
              Make it yourself!
            </Button>
          </Box>
        </Stack>
      </Box>
    );

  return (
    <Box bg="blackAlpha.300" h="calc(100vh)" p={6}>
      <Stack maxW="6xl" w="full" mx="auto" p={6} spacing={6}>
        <Stack gap={2} direction="row">
          {podcastMetadataObject ? (
            <Image src={podcastMetadataObject} width={50} height={50} />
          ) : (
            <Flex
              borderRadius="2xl"
              bgGradient="linear(to-br, blue.400, purple.500, pink.400)"
              w={50}
              h={50}
            />
          )}
          <Heading size="xl" fontWeight="bold">
            {podcastData?.name?.toUpperCase()}
          </Heading>
        </Stack>
        <Stack>
          <Text>{podcastData?.description}</Text>
          <Stack>
            <Text _hover={{ textDecoration: "underline" }}>
              Host:{" "}
              <Link
                href={`https://explorer.testnet.mantle.xyz/address/${podcastData?.host}`}
              >
                {podcastData?.host}
              </Link>
            </Text>
            <Text>Topic: {podcastData?.topic}</Text>
          </Stack>
        </Stack>
        <Box>
          {latestEpisodeFile && (
            <>
              <Heading size="xl" mb={6} fontWeight="bold">
                Latest Episode
              </Heading>
              {isAudioUrl(latestEpisodeFile) ? (
                <audio src={latestEpisodeFile} controls />
              ) : isVideoUrl(latestEpisodeFile) ? (
                <video src={latestEpisodeFile} controls />
              ) : (
                <>File format not supported</>
              )}
              {isLargerThan800}

              <Link href={latestEpisodeFile} target="_blank">
                <Text>Download Link, {latestEpisodeFile}</Text>
              </Link>
            </>
          )}
        </Box>

        <Box hidden={!podcastData?.name || podcastData?.host !== address}>
          <AddEpisodeModal
            podcastId={podcastId}
            podcastPreviousGuest={podcastData.guest}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default Pod;
