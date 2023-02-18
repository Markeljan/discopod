import { useState } from "react";
import { NFTStorage, File } from "nft.storage";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
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
} from "@chakra-ui/react";

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1NzI4OERlZTM2QUY3N0FjZjZEQ0YxQjBiMjY4QzQ2YjZjMGZhNzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjE0NTA1OTA5NCwibmFtZSI6InBvZGNoYWluIn0.XjX9uNYAm-sQ4esJlTmgpK65zZ4LpyERfnsd2peOaWc";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("Public Goods");
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
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
    setMetadataUrl(
      `https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`
    );
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

    const receipt = await newTx.wait();
    console.log(receipt);
    setMintPending(false);
  };

  return (
    <Container h="full" minH="full" bgColor="black" w="full" minW="full">
      <Flex
        flexDirection="column"
        maxW="2xl"
        w="full"
        marginX="auto"
        padding={6}
      >
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
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="">Category</FormLabel>
            <RadioGroup onChange={setTopic} value={topic}>
              <Stack direction="row">
                <Radio value="Public Goods">Public Goods</Radio>
                <Radio value="Web3 PGF">Web3 PGF</Radio>
                <Radio value="Carbon Offsets">Carbon Offsets</Radio>
                <Radio value="Sustainability">Sustainability</Radio>
              </Stack>
            </RadioGroup>
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
          <Button
            type="submit"
            disabled={uploadPending || mintPending}
            color="white"
            fontWeight="medium"
            bgColor="purple.500"
            _hover={{ bgColor: "purple.700" }}
          >
            {metadataUrl && data
              ? "Mint Successful"
              : uploadPending
              ? "Uploading to IPFS..."
              : mintPending
              ? "Minting..."
              : "Mint"}
          </Button>

          {data && data.hash && (
            <Box color="green.500">
              <Link
                href={`https://explorer.testnet.mantle.xyz/tx/${data.hash}`}
                target="_blank"
              >
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
