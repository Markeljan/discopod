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
  }, [podcast]);

  const getMetadata = async (podcastMetadataUri: string) => {
    const response = await fetch(podcastMetadataUri);
    const json = await response.json();
    setPodcastMetadataObject(`https://nftstorage.link/ipfs/${json.image.substring(7)}`);
  };

  const getEpisodeLink = async (episodeMetadataUri: string) => {
    const response = await fetch(
      `https://nftstorage.link/ipfs/${latestEpisode.episodeUri.substring(7)}`
    );
    const json = await response.json();
    console.log(json);
    setLatestEpisodeFile(`https://nftstorage.link/ipfs/${json.external_url.substring(7)}`);
  };
  let metadata: any;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile || !mediaFile || !write) return;
    setUploadPending(true);
    console.log(podcast);

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
    console.log("meta", metadata);
    console.log(`https://nftstorage.link/ipfs/${metadata?.url.substring(7)}`);
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
  return (
    <div className=" bg-gray-100 p-6">
      <div className="flex flex-col max-w-6xl w-full mx-auto p-6">
        <div className="bg-primary.dark p-6 rounded-lg shadow-md">
          {/* {podcastDataLoading && (
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
          )} */}
          <h2 className="text-2xl font-bold mb-6">{podcastData?.name?.toUpperCase()}</h2>

          {podcastMetadataObject ? (
            <img src={podcastMetadataObject} width={50} height={50} />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-pink-400" />
          )}

          <p>{podcastData?.description}</p>
          <p>Topic: {podcastData?.topic}</p>
          <p>{podcastData?.host?.substring(0, 8)}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Episodes</h2>
          {latestEpisode && (
            <Link
              href={`https://nftstorage.link/ipfs/${latestEpisode.episodeUri.substring(7)}`}
              target="_blank"
            >
              <p>{latestEpisode.episodeUri}</p>
            </Link>
          )}
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

              <div className="flex items-center w-full rounded-lg">
                {
                  <button
                    disabled={uploadPending || mintPending}
                    className="bg-violet-500 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg"
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
