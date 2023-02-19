import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import Link from "next/link";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useSigner,
} from "wagmi";
import { estimateL2GasCost, estimateTotalGasCost } from "@mantleio/sdk";
import { BigNumber, Contract } from "ethers";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import ReactPlayer from "react-player";

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1NzI4OERlZTM2QUY3N0FjZjZEQ0YxQjBiMjY4QzQ2YjZjMGZhNzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjE0NTA1OTA5NCwibmFtZSI6InBvZGNoYWluIn0.XjX9uNYAm-sQ4esJlTmgpK65zZ4LpyERfnsd2peOaWc";

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

const DISCOPOD = {
  address: DISCOPOD_ADDRESS,
  abi: DISCOPOD_ABI,
};

const Pod = (props: any) => {
  const router = useRouter();

  const { podNormal: pod } = props;
  const {
    data: podcastId,
    isError,
    isLoading,
  } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "podcastNameToId",
    args: [pod],
  });
  const { address } = useAccount();

  const { data: podcast, isLoading: podcastDataLoading }: { data: any; isLoading: boolean } =
    useContractRead({
      address: DISCOPOD_ADDRESS,
      abi: DISCOPOD_ABI,
      functionName: "podcastIdToPodcast",
      args: [podcastId],
    });
  const [podcastData, setPodcastData] = useState<any>({});

  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectibleValue, setCollectibleValue] = useState(0);
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [podcastMetadataObject, setPodcastMetadataObject] = useState("");
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [gasPrice, setGasPrice] = useState<BigNumber>(BigNumber.from(53000));
  const [totalGasCost, setTotalGasCost] = useState<BigNumber>(BigNumber.from(1000000));
  const [latestEpisodeFile, setLatestEpisodeFile] = useState<any>("");

  const { config } = usePrepareContractWrite({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "addEpisode",
    args: [
      podcastId,
      metadataUrl,
      collectibleValue,
      podcastData?.guest,
      { gasLimit: 10000000, gasPrice: 1 },
    ],
  });
  const {
    data: writeData,
    isLoading: writeIsLoading,
    isSuccess: writeIsSuccess,
    write,
  } = useContractWrite(config);

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
    if (latestEpisode?.episodeUri) getEpisodeLink(latestEpisode?.episodeUri);
  }, [podcast, latestEpisode]);

  const getMetadata = async (podcastMetadataUri: string) => {
    const response = await fetch(podcastMetadataUri);
    const json = await response.json();
    setPodcastMetadataObject(`https://nftstorage.link/ipfs/${json.image.substring(7)}`);
  };

  const getEpisodeLink = async (episodeMetadataUri: string) => {
    const response = await fetch(
      `https://nftstorage.link/ipfs/${latestEpisode?.episodeUri?.substring(7)}`
    );
    const json = await response.json();
    setLatestEpisodeFile(json.external_url);
  };
  let metadata: any;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile || !mediaFile || !write) return;
    setUploadPending(true);

    try {
      metadata = await client.store({
        name: title,
        description: description,
        image: new File([imageFile], imageFile.name.replace(/\s/g, ""), { type: imageFile.type }),
        external_url: new File([mediaFile], mediaFile.name.replace(/\s/g, ""), {
          type: mediaFile.type,
        }),
      });
    } catch (error) {
      console.error(error);
    }
    setUploadPending(false);
    setMetadataUrl(`https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`);

    setMintPending(true);

    let gasCost = BigNumber.from(10000000);
    try {
      gasCost = await estimateTotalGasCost(provider, config);
    } catch (error) {
      console.error(error);
    }
    const CONTRACT = new Contract(DISCOPOD_ADDRESS, DISCOPOD_ABI, signer!);
    const tx = await CONTRACT.addEpisode(
      podcastId,
      metadata?.url,
      collectibleValue,
      podcastData?.guest,
      {
        gasLimit: 10000000,
      }
    );

    await tx.wait();

    setMintPending(false);
  };
  console.log("podcastData:", podcastData);
  console.log("latestEpisode:", latestEpisode);

  if (Object.keys(podcastData).length === 0)
    return (
      <Box bg="gray.100" h="100vh" p={6}>
        <Stack maxW="6xl" w="full" mx="auto" p={6} spacing={6}>
          <Box bg="primary.dark" p={6} rounded="lg" shadow="md">
            <Heading size="lg" mb={6} fontWeight="bold">
              Podcast Does not exist... Yet! Make it yourself!
            </Heading>
            <Button
              bg="blue.500"
              color="white"
              p={2}
              rounded="lg"
              shadow="md"
              onClick={() => router.push("/create")}
            >
              Create Podcast
            </Button>
          </Box>
        </Stack>
      </Box>
    );

  return (
    <Box bg="gray.100" h="-moz-max-content" p={6}>
      <Stack maxW="6xl" w="full" mx="auto" p={6} spacing={6}>
        <Box bg="primary.dark" p={6} rounded="lg" shadow="md">
          <Heading size="xl" mb={6} fontWeight="bold">
            {podcastData?.name?.toUpperCase()}
          </Heading>
          {podcastMetadataObject ? (
            <Flex w="100%" justifyContent="center">
              <Image src={podcastMetadataObject} width={200} height={200} />
            </Flex>
          ) : (
            <Box w={20} h={20} bgGradient="linear(to-r, indigo.400, pink.400)" />
          )}
          <Text>{podcastData?.description}</Text>
          <Text>Topic: {podcastData?.topic}</Text>
          <Text>{podcastData?.host?.substring(0, 8)}</Text>
        </Box>
        <Box>
          <Heading size="xl" mb={6} fontWeight="bold">
            Episodes
          </Heading>
          {latestEpisode && (
            <>
              <Link
                href={`https://nftstorage.link/ipfs/${latestEpisode.episodeUri.substring(7)}`}
                target="_blank"
              >
                <Text>{latestEpisode.episodeUri.substring(0, 8)}</Text>
              </Link>

              <Link
                href={`https://nftstorage.link/ipfs/${latestEpisodeFile.substring(7)}`}
                target="_blank"
              >
                <Text>Download Link</Text>
              </Link>
            </>
          )}
        </Box>
        <Box hidden={!podcastData?.name || podcastData?.host !== address}>
          <Box p={6} rounded="lg" shadow="md">
            <form onSubmit={handleSubmit}>
              <Heading size="xl" mb={6} fontWeight="bold">
                Mint Next Episode
              </Heading>
              <FormControl mb={4}>
                <FormLabel fontWeight="medium">Episode title:</FormLabel>
                <Input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  border="1px solid"
                  borderColor="gray.400"
                  borderRadius="lg"
                  p={2}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontWeight="medium">Description:</FormLabel>
                <Textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  border="1px solid"
                  borderColor="gray.400"
                  borderRadius="lg"
                  p={2}
                  h={32}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontWeight="medium">Collectible Value:</FormLabel>
                <Input
                  type="number"
                  required
                  value={collectibleValue}
                  onChange={(e) => setCollectibleValue(parseInt(e.target.value))}
                  border="1px solid"
                  borderColor="gray.400"
                  borderRadius="lg"
                  p={2}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel fontWeight="medium">Thumbnail</FormLabel>
                <Box mb={4}>
                  <Input
                    type="file"
                    required
                    onChange={(e) => setImageFile(e.target.files?.item(0) || null)}
                    border="1px solid"
                    borderColor="gray.400"
                    borderRadius="lg"
                    p={2}
                  />
                </Box>
                <Box mb={4}>
                  <FormLabel fontWeight="medium">Audio / Video</FormLabel>
                  <Input
                    type="file"
                    required
                    onChange={(e) => setMediaFile(e.target.files?.item(0) || null)}
                    border="1px solid"
                    borderColor="gray.400"
                    borderRadius="lg"
                    p={2}
                  />
                </Box>

                <Stack direction="row" alignItems="center" w="full" rounded="lg">
                  {
                    <Button
                      disabled={uploadPending || mintPending}
                      bg="Purple"
                      _hover={{ bg: "violet.700" }}
                      color="White"
                      type="submit"
                      fontWeight="medium"
                      py={2}
                      px={4}
                      rounded="lg"
                    >
                      {metadataUrl && writeData
                        ? "Mint Successful"
                        : uploadPending
                        ? "Uploading to IPFS..."
                        : mintPending
                        ? "Minting..."
                        : "Mint"}
                    </Button>
                  }
                  {writeData && writeData.hash && (
                    <Box color="green.500">
                      <Link
                        href={`https://explorer.testnet.mantle.xyz/tx/${writeData.hash}`}
                        target="_blank"
                      >
                        <Text>Tx Hash: {writeData.hash.substring(0, 12)}</Text>
                      </Link>
                    </Box>
                  )}
                </Stack>
              </FormControl>
            </form>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Pod;
