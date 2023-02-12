import { useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { PODCHAIN_ADDRESS, PODCHAIN_ABI } from "constants/contractData";

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1NzI4OERlZTM2QUY3N0FjZjZEQ0YxQjBiMjY4QzQ2YjZjMGZhNzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjE0NTA1OTA5NCwibmFtZSI6InBvZGNoYWluIn0.XjX9uNYAm-sQ4esJlTmgpK65zZ4LpyERfnsd2peOaWc";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [headless, setHeadless] = useState(true);
  const [author, setAuthor] = useState("mario");
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const { config } = usePrepareContractWrite({
    address: PODCHAIN_ADDRESS,
    abi: PODCHAIN_ABI,
    functionName: "createPodcast",
    args: [title, description, headless, metadataUrl],
  });
  const { write } = useContractWrite(config);
  const { data, isLoading, isSuccess } = useContractRead({
    address: PODCHAIN_ADDRESS,
    abi: PODCHAIN_ABI,
    functionName: "getPodcastName",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !imageFile || !write) return;
    const podchain = { title, description, author };
    setUploadPending(true);

    const metadata = await client.store({
      name: title,
      description: description,
      image: new File([imageFile], imageFile.name.replace(/\s/g, ""), { type: imageFile.type }),
      external_url: "discopod.xyz",
    });
    console.log(metadata);
    if (metadata) {
      setUploadPending(false);

      setMetadataUrl(`https://nftstorage.link/ipfs/${metadata.url.substring(7)}`);
      setFileUrl(
        `https://nftstorage.link/ipfs/${metadata.data.external_url.pathname.substring(2)}`
      );
    }

    setMintPending(true);

    console.log(
      `https://nftstorage.link/ipfs/${metadata.url.substring(7)}`,
      `https://nftstorage.link/ipfs/${metadata.data.external_url.pathname.substring(2)}`
    );
    // write to contract here
    const tx = await write();
    console.log(tx);
    setMintPending(false);
  };

  return (
    <div className="h-full min-h-screen bg-primary">
      <div
        className="flex flex-col max-w-2xl w-full mx-auto
     p-6"
      >
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Mint a Podchain</h2>
          <div className="mb-4">
            <label className="block font-medium mb-2">Podchain title:</label>
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
            <label className="block font-medium mb-2">Podchain author:</label>
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-lg"
            >
              <option value="mario">Mario</option>
              <option value="yoshi">Yoshi</option>
            </select>

            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-6">Upload a Audio or Video File</h2>
              <div className="mb-4">
                <div className="flex justify-center gap-4">
                  {file?.type === "video/mp4" ? (
                    <>
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500">{file.name}</p>
                        <video src={URL.createObjectURL(file)} className="w-32 h-32 object-cover" />
                      </div>
                    </>
                  ) : file?.type === "audio/mpeg" ? (
                    <>
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500">{file.name}</p>
                        <audio src={URL.createObjectURL(file)} className="w-32 h-32 object-cover" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500">Podchain Cover Image</p>
                        <input
                          type="file"
                          required
                          onChange={(e) => setImageFile(e.target.files?.item(0) || null)}
                          className="w-full p-2 border border-gray-400 rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500">Audio / Video File</p>
                        <input
                          type="file"
                          required
                          onChange={(e) => setFile(e.target.files?.item(0) || null)}
                          className="w-full p-2 border border-gray-400 rounded-lg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {
                <button
                  disabled={uploadPending || mintPending}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  {fileUrl ? "Uploaded Successfully" : uploadPending ? "Uploading..." : "Upload"}
                </button>
              }
            </div>
            {ipfsHash && (
              <div className="mt-6">
                <p>IPFS Hash: {ipfsHash}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            {!mintPending && (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                Add Blog
              </button>
            )}
            {mintPending && (
              <button
                disabled
                className="bg-gray-400 cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg"
              >
                Minting Podchain...
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
