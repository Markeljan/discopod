import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Box,
  Stack,
  Link,
  Text,
} from "@chakra-ui/react";
import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import { BigNumber, Contract, ethers } from "ethers";
import { NFTStorage } from "nft.storage";

type Props = {
  podcastId: any;
  podcastPreviousGuest: string;
};
const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1NzI4OERlZTM2QUY3N0FjZjZEQ0YxQjBiMjY4QzQ2YjZjMGZhNzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjE0NTA1OTA5NCwibmFtZSI6InBvZGNoYWluIn0.XjX9uNYAm-sQ4esJlTmgpK65zZ4LpyERfnsd2peOaWc";

export const AddEpisodeModal = ({ podcastId, podcastPreviousGuest }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: signer } = useSigner();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collectibleValue, setCollectibleValue] = useState<BigNumber>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [metadataUrl, setMetadataUrl] = useState("");
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [currentError, setCurrentError] = useState<any | null>();
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const { config } = usePrepareContractWrite({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "addEpisode",
    args: [
      podcastId,
      metadataUrl,
      collectibleValue,
      podcastPreviousGuest,
      { gasLimit: 10000000, gasPrice: 1 },
    ],
  });
  const {
    data: writeData,
    write,
    isLoading,
    isSuccess,
    error,
  } = useContractWrite(config);

  const handleCollectibleValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const ethersToWei = ethers.utils.parseUnits(e.target.value, "ether");
    setCollectibleValue(ethersToWei);
  };
  let metadata: any;

  useEffect(() => {
    setCurrentError(error);
  }, [error]);

  const handleSubmit = async () => {
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
      setCurrentError(error);
    }
    setUploadPending(false);
    setMetadataUrl(
      `https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`
    );

    setMintPending(true);
    const CONTRACT = new Contract(DISCOPOD_ADDRESS, DISCOPOD_ABI, signer!);
    let tx;

    try {
      tx = await CONTRACT.addEpisode(
        podcastId,
        metadata?.url,
        collectibleValue,
        podcastPreviousGuest,
        {
          gasLimit: 10000000,
        }
      );
    } catch (error) {
      setCurrentError(error);
    }
    try {
      await tx.wait();
    } catch (error) {
      console.error(error);
    }

    console.log("transaction: ", tx);
    setMintPending(false);
  };

  return (
    <>
      <Button onClick={onOpen}>Add Episode</Button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Next Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
              <FormLabel fontWeight="medium">Collectible Mint Price:</FormLabel>
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
                  p={1}
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
                  p={1}
                />
              </Box>

              <Stack direction="row" alignItems="center" w="full" rounded="lg">
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
                {currentError && <Text>Error: {currentError.message}</Text>}
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={uploadPending || mintPending}
              bg="Purple"
              _hover={{ bg: "violet.700" }}
              color="White"
              type="submit"
              fontWeight="medium"
              rounded="lg"
              mr={2}
              onClick={handleSubmit}
            >
              {metadataUrl && writeData
                ? "Mint Successful"
                : uploadPending
                ? "Uploading to IPFS..."
                : mintPending
                ? "Minting..."
                : "Submit"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
