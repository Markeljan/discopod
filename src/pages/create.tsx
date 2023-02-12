import { useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { DISCOPOD_ADDRESS, DISCOPOD_ABI } from "constants/contractData";
import Link from "next/link";

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1NzI4OERlZTM2QUY3N0FjZjZEQ0YxQjBiMjY4QzQ2YjZjMGZhNzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjE0NTA1OTA5NCwibmFtZSI6InBvZGNoYWluIn0.XjX9uNYAm-sQ4esJlTmgpK65zZ4LpyERfnsd2peOaWc";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [headless, setHeadless] = useState(true);
  const [topic, setTopic] = useState("Public Goods");
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const { address } = useAccount();
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
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile || !write) return;
    setUploadPending(true);

    const metadata = await client.store({
      name: title,
      description: description,
      image: new File([imageFile], imageFile.name.replace(/\s/g, ""), { type: imageFile.type }),
      external_url: `discopod.xyz/${title}`,
    });
    console.log(metadata);
    if (metadata) {
      setUploadPending(false);
      setMetadataUrl(`https://nftstorage.link/ipfs/${metadata.url.substring(7)}`);
    }
    setMintPending(true);
    console.log(`https://nftstorage.link/ipfs/${metadata.url.substring(7)}`);
    // write to contract here
    const tx = await write();
    setMintPending(false);
  };

  return (
    <div className="h-full min-h-screen bg-slate-600">
      <div
        className="flex flex-col max-w-2xl w-full mx-auto
     p-6"
      >
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Mint a Pod</h2>
          <div className="mb-4">
            <label className="block font-medium mb-2">Pod title:</label>
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
            <label className="block font-medium mb-2">Category:</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-lg"
            >
              <option value="Public Goods">Public Goods</option>
              <option value="Web3 PGF">Web3 PGF</option>
              <option value="Carbon Offsets">Carbon Offsets</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Pod Cover Image:</label>
            <div className="mb-4 ">
              <input
                type="file"
                required
                onChange={(e) => setImageFile(e.target.files?.item(0) || null)}
                className="w-full p-2 border border-gray-400 rounded-lg"
              />
            </div>

            <div className="flex justify-center items-center w-full border-2 border-solid border-gray-400 rounded-lg">
              {
                <button
                  disabled={uploadPending || mintPending}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  {metadataUrl && data
                    ? "Mint Successful"
                    : uploadPending
                    ? "Uploading to IPFS..."
                    : mintPending
                    ? "Minting..."
                    : "Mint"}
                </button>
              }
              {isSuccess && data && (
                <div className="text-green-500">
                  <Link
                    href={`https://explorer.testnet.mantle.xyz/address/${DISCOPOD_ADDRESS}`}
                    target="_blank"
                  >
                    <p>Tx Hash: {data.hash.substring(0, 12)}</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
