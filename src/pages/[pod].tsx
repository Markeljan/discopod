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
  useSigner,
} from "wagmi";
import { BigNumber, Contract, ethers } from "ethers";
import { isAudioUrl, isVideoUrl } from "@/utils/helpers";
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
  useMediaQuery,
} from "@chakra-ui/react";
import { AddEpisodeModal } from "@/components/AddEpisodeModal";

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

  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectibleValue, setCollectibleValue] = useState<BigNumber>();
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [podcastMetadataObject, setPodcastMetadataObject] = useState("");
  const { data: signer } = useSigner();
  const [latestEpisodeFile, setLatestEpisodeFile] = useState<any>("");

  const [isLargerThan800] = useMediaQuery("(min-width: 800px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });

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
  const { data: writeData, write } = useContractWrite(config);

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
  const handleCollectibleValueChange = (e: any) => {
    const ethersToWei = ethers.utils.parseUnits(e.target.value, "ether");
    setCollectibleValue(ethersToWei);
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
        image: new File([imageFile], imageFile.name.replace(/\s/g, ""), {
          type: imageFile.type,
        }),
        external_url: new File([mediaFile], mediaFile.name.replace(/\s/g, ""), {
          type: mediaFile.type,
        }),
      });
    } catch (error) {
      console.error(error);
    }
    setUploadPending(false);
    setMetadataUrl(
      `https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`
    );

    setMintPending(true);
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
    <Box bg="blackAlpha.300" h="calc(100vh)" p={6} >
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
          <Heading size="xl" fontWeight="bold" >
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
          <AddEpisodeModal podcastId={podcastId} podcastPreviousGuest={podcastData.guest}/>
          {/* <Box p={6} rounded="lg" shadow="md">
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
                <FormLabel fontWeight="medium">
                  Collectible Mint Price:
                </FormLabel>
                <Input
                  required
                  onChange={handleCollectibleValueChange}
                  placeholder="0.1 ether"
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
                    onChange={(e) =>
                      setImageFile(e.target.files?.item(0) || null)
                    }
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
                    onChange={(e) =>
                      setMediaFile(e.target.files?.item(0) || null)
                    }
                    border="1px solid"
                    borderColor="gray.400"
                    borderRadius="lg"
                    p={2}
                  />
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  w="full"
                  rounded="lg"
                >
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
          </Box> */}
        </Box>
      </Stack>
    </Box>
  );
};

export default Pod;
