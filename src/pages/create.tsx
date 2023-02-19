import { useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { useContractWrite, usePrepareContractWrite, useSigner, useTransaction } from "wagmi";
import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import Link from "next/link";
import { Contract } from "ethers";
import {
  Flex,
  Container,
  Text,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Box,
  Select,
} from "@chakra-ui/react";

type Hash = `0x${string}`;

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1NzI4OERlZTM2QUY3N0FjZjZEQ0YxQjBiMjY4QzQ2YjZjMGZhNzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjE0NTA1OTA5NCwibmFtZSI6InBvZGNoYWluIn0.XjX9uNYAm-sQ4esJlTmgpK65zZ4LpyERfnsd2peOaWc";

const CATEGORIES = ["Public Goods", "Web3 PGF", "Carbon Offsets", "Sustainability"];

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("Public Goods");
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<Hash>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const { data: signer } = useSigner();

  const { config } = usePrepareContractWrite({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "createPodcast",
    args: [
      title.toLowerCase(),
      description,
      metadataUrl,
      topic,
      { gasLimit: 1000000, gasPrice: 1 },
    ],
  });
  const { data, isSuccess, write } = useContractWrite(config);

  const {
    data: mintData,
    isError: mintError,
    isLoading: mintLoading,
  } = useTransaction({
    hash: mintTxHash,
    onSuccess: () => {
      setMintPending(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile || !write) return;
    setUploadPending(true);

    let metadata;
    try {
      metadata = await client.store({
        name: title,
        description: description,
        image: new File([imageFile], imageFile.name.replace(/\s/g, ""), {
          type: imageFile.type,
        }),
        external_url: `discopod.xyz/${title}`,
      });
      console.log(metadata);
    } catch (error) {
      console.error(error);
    }

    setUploadPending(false);
    setMetadataUrl(`https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`);
    setMintPending(true);
    console.log(`https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`);
    console.log("before tx write, metadataUrl: ", metadataUrl);
    // write to contract here

    const CONTRACT = new Contract(DISCOPOD_ADDRESS, DISCOPOD_ABI, signer!);
    const newTx = await CONTRACT.createPodcast(
      title.toLowerCase(),
      description,
      `https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`,
      topic,
      {
        gasLimit: 1000000,
        gasPrice: 1,
      }
    );
    setMintTxHash(newTx.hash);
  };

  return (
    <Container h="100vh" minH="full" bgColor="black" w="full" minW="full">
      <Flex flexDirection="column" maxW="2xl" w="full" marginX="auto" padding={6} minH="full">
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "1.25rem",
          }}
        >
          <Text fontWeight="bold" mb={2} fontSize="2xl">
            Mint a Pod
          </Text>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="title">Pod title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="">Category</FormLabel>

            <RadioGroup display={{ base: "none", md: "flex" }} onChange={setTopic} value={topic}>
              <Stack direction="row">
                {CATEGORIES.map((category) => (
                  <Radio key={category} value={category}>
                    {category}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <Select
              display={{ base: "flex", md: "none" }}
              onChange={(e) => setTopic(e.target.value)}
              value={topic}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="image">Cover Image</FormLabel>
            <Input
              type="file"
              onChange={(e) => setImageFile(e.target.files?.item(0) || null)}
              h={12}
              paddingTop={2}
              paddingLeft={2}
            />
          </FormControl>
          <Flex justifyContent="center" mt={8}>
            <Button
              type="submit"
              disabled={uploadPending || mintPending}
              color="white"
              fontWeight="medium"
              bgColor="purple.500"
              w={{ base: "full", md: "50%" }}
              _hover={{ bgColor: "purple.700" }}
            >
              Mint
            </Button>
          </Flex>

          <Text mt={4} textAlign="center">
            {metadataUrl && data
              ? "Your Pod has been minted!"
              : uploadPending
              ? "Uploading your image to IPFS..."
              : mintPending
              ? "Minting your Pod..."
              : mintData
              ? "Your Pod has been minted!"
              : ""}
          </Text>

          {mintData && (
            <Flex color="green.500" justify="flex-end" mt={2}>
              <Flex gap={2}>
                <Link href={`/${title}`}>
                  <Text>Check it out!</Text>
                </Link>
              </Flex>
            </Flex>
          )}

          {data && data.hash && (
            <Box color="green.500">
              <Link href={`https://explorer.testnet.mantle.xyz/tx/${data.hash}`} target="_blank">
                <Text>Tx Hash: {data.hash.substring(0, 12)}</Text>
              </Link>
            </Box>
          )}
          {isSuccess && (
            <Box bgColor="purple.500" color="white" fontWeight="medium">
              {" "}
              <Link href={`/${title}`}> Go to Pod Page</Link>
            </Box>
          )}
        </form>
      </Flex>
    </Container>
  );
}
