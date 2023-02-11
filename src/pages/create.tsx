import { useState } from "react";
import { NFTStorage, File, Blob } from "nft.storage";
import tempNFT from "public/tempNFT.png";

const NFT_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc1NzI4OERlZTM2QUY3N0FjZjZEQ0YxQjBiMjY4QzQ2YjZjMGZhNzMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NjE0NTA1OTA5NCwibmFtZSI6InBvZGNoYWluIn0.XjX9uNYAm-sQ4esJlTmgpK65zZ4LpyERfnsd2peOaWc";

export default function Create() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("mario");
  const [uploadPending, setUploadPending] = useState(false);
  const [mintPending, setMintPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState("");
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const podchain = { title, body, author };
    setUploadPending(true);
    setMintPending(true);

    const metadata = await client.store({
      name: title,
      description: body,
      image: new File([tempNFT.src], "tempNFT.png", { type: "image/png" }),
      external_url: new File([file], file.name.replace(/\s/g, ""), { type: file.type }),
    });
    console.log(metadata);
    if (metadata) {
      setIsPending(false);

      console.log(
        `https://nftstorage.link/ipfs/${metadata.url.substring(7)}`,
        `https://nftstorage.link/ipfs/${metadata.data.external_url.pathname.substring(2)}`
      );
    }

    return {
      metadataUrl: `https://nftstorage.link/ipfs/${metadata.url.substring(7)}`,
      fileUrl: `https://nftstorage.link/ipfs/${metadata.data.external_url.pathname.substring(2)}`,
    };

    // write to contract here
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
            <label className="block font-medium mb-2">Podchain body:</label>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
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
                <label className="block font-medium mb-2">File:</label>

                <div className="flex justify-center">
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
                    <input
                      type="file"
                      required
                      onChange={(e) => setFile(e.target.files?.item(0))}
                      className="w-full p-2 border border-gray-400 rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {!uploadPending && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                  Upload
                </button>
              )}
              {uploadPending && (
                <button
                  disabled
                  className="bg-gray-400 cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg"
                >
                  Uploading...
                </button>
              )}
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
                Adding Blog...
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
