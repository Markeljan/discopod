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
} from "wagmi";
import { estimateL2GasCost, L2Provider } from "@mantleio/sdk";
import { BigNumber } from "ethers";

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

  const { data: podcast }: { data: any } = useContractRead({
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
  const provider = useProvider();

  const { config } = usePrepareContractWrite({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "addEpisode",
    args: [
      podcastId,
      metadataUrl,
      collectibleValue,
      podcastData?.guest,
      { gasLimit: 100000000, gasPrice: 1 },
    ],
  });
  const {
    data: writeData,
    isLoading: writeIsLoading,
    isSuccess: writeIsSuccess,
    write,
  } = useContractWrite(config);

  console.log(metadataUrl);

  const { data: latestEpisode } = useContractRead({
    address: DISCOPOD_ADDRESS,
    abi: DISCOPOD_ABI,
    functionName: "episodeIdToEpisode",
    args: [podcastData?.latestEpisodeId],
  });

  console.log("latestEipsode", latestEpisode);

  useEffect(() => {
    if (podcast?.name) {
      setPodcastData(podcast);
    }
  }, [podcast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile || !mediaFile || !write) return;
    setUploadPending(true);

    const metadata = await client.store({
      name: title,
      description: description,
      image: new File([imageFile], imageFile.name.replace(/\s/g, ""), { type: imageFile.type }),
      external_url: new File([mediaFile], mediaFile.name.replace(/\s/g, ""), {
        type: mediaFile.type,
      }),
    });
    console.log(metadata);
    if (metadata) {
      setUploadPending(false);
      setMetadataUrl(`https://nftstorage.link/ipfs/${metadata.url.substring(7)}`);
    }

    setMintPending(true);
    console.log(`https://nftstorage.link/ipfs/${metadata.url.substring(7)}`);

    //get the current blocks gas limit

    const tx = await write();

    // estimateL2GasCost(provider, tx:TransactionRequest): Promise<BigNumber>;

    setMintPending(false);
  };

  console.log(podcastData);

  return (
    <div className=" bg-gray-100 p-6">
      <div className="flex flex-col max-w-6xl w-full mx-auto p-6">
        <div className="bg-primary.dark p-6 rounded-lg shadow-md">
          {!podcastData?.name && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Podcast Does not exist... Yet! Make it yourself!
              </h2>
              <button
                className=" bg-blue-500 text-white p-2 rounded-lg shadow-md"
                onClick={() => router.push("/create")}
              >
                Create Podcast
              </button>
            </>
          )}
          <h2 className="text-2xl font-bold mb-6">{podcastData?.name?.toUpperCase()}</h2>
          <p>{podcastData?.description}</p>
          <p>{podcastData?.topic}</p>
          <p>{podcastData?.host?.substring(0, 8)}</p>
        </div>
        <div hidden={!podcastData?.name || podcastData?.host !== address}>
          <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Mint Next Episode</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Episode title:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-400 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Description:</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 h-32 border border-gray-400 rounded-lg"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Collectible Value:</label>
              <input
                type="number"
                required
                value={collectibleValue}
                onChange={(e) => setCollectibleValue(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-400 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Thumbnail</label>
              <div className="mb-4 ">
                <input
                  type="file"
                  required
                  onChange={(e) => setImageFile(e.target.files?.item(0) || null)}
                  className="w-full p-2 border border-gray-400 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">Audio / Video</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setMediaFile(e.target.files?.item(0) || null)}
                  className="w-full p-2 border border-gray-400 rounded-lg"
                />
              </div>

              <div className="flex justify-center items-center w-full border-2 border-solid border-gray-400 rounded-lg">
                {
                  <button
                    disabled={uploadPending || mintPending}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    {metadataUrl && writeData
                      ? "Mint Successful"
                      : uploadPending
                      ? "Uploading to IPFS..."
                      : mintPending
                      ? "Minting..."
                      : "Mint"}
                  </button>
                }
                {writeData && writeData.hash && (
                  <div className="text-green-500">
                    <Link
                      href={`https://explorer.testnet.mantle.xyz/tx/${writeData.hash}`}
                      target="_blank"
                    >
                      <p>Tx Hash: {writeData.hash.substring(0, 12)}</p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pod;
